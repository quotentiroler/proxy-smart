"""Proxy-backed authentication service for the MCP server."""

import asyncio
import json
import logging
import time
from pathlib import Path
from typing import Optional

import jwt
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

from config import settings
from generated.api_client.api.authentication_api import AuthenticationApi
from generated.api_client.api_client import ApiClient
from generated.api_client.configuration import Configuration
from generated.api_client.exceptions import ApiException
from generated.api_client.models.token_request import TokenRequest

logger = logging.getLogger(__name__)


class BackendServicesAuth:
    """
    Handles SMART Backend Services authentication by delegating to the proxy.

    The proxy forwards the client credentials flow to the underlying identity
    provider. We still mint a client assertion that targets the upstream token
    endpoint, but the HTTP exchange runs through the proxy using the generated
    client library.
    """

    def __init__(
        self,
        client_id: str = "ai-assistant-agent",
        private_key_path: Optional[str] = None,
        backend_api_url: Optional[str] = None,
        scope: str = "openid profile",
    ):
        """Initialize Backend Services authentication."""

        self.client_id = client_id
        self.backend_api_url = (backend_api_url or settings.backend_api_url).rstrip("/")
        self.scope = scope

        configuration = Configuration(host=self.backend_api_url)
        self._api_client = ApiClient(configuration=configuration)
        self._auth_api = AuthenticationApi(self._api_client)

        if private_key_path is None:
            # Default to keys directory at mcp-server/keys/
            # Path calculation: auth.py -> src/services -> src -> mcp-server -> keys
            private_key_path = str(
                Path(__file__).parent.parent.parent / "keys" / "ai_assistant_private.pem"
            )

        self.private_key_path = private_key_path
        self._private_key: Optional[rsa.RSAPrivateKey] = None
        self._cached_token: Optional[str] = None
        self._token_expiry: Optional[float] = None
        self._token_endpoint: Optional[str] = None

    def _load_private_key(self) -> None:
        """Load the private key from disk if needed."""
        if self._private_key is None:
            try:
                with open(self.private_key_path, "rb") as key_file:
                    loaded_key = serialization.load_pem_private_key(
                        key_file.read(), password=None, backend=default_backend()
                    )
                    if not isinstance(loaded_key, rsa.RSAPrivateKey):
                        raise ValueError("Private key must be RSA for backend services auth")
                    self._private_key = loaded_key
                logger.info("Successfully loaded private key", extra={"path": self.private_key_path})
            except Exception as exc:
                logger.error(
                    "Failed to load private key", extra={"path": self.private_key_path, "error": str(exc)}
                )
                raise

    async def _ensure_token_endpoint(self) -> str:
        """Fetch and cache the upstream token endpoint from the proxy."""
        if self._token_endpoint:
            return self._token_endpoint

        try:
            auth_config = await asyncio.to_thread(self._auth_api.get_auth_config)
        except ApiException as api_error:
            body = None
            try:
                body = json.loads(api_error.body) if api_error.body else None
            except json.JSONDecodeError:
                body = api_error.body

            logger.error(
                "Proxy auth config request failed",
                extra={"status": api_error.status, "reason": api_error.reason, "body": body},
            )
            raise Exception(f"Proxy authentication failed: {api_error.status} - {api_error.reason}") from api_error
        except Exception as exc:
            logger.error("Unexpected error fetching auth config", extra={"error": str(exc)})
            raise

        token_endpoint = (
            auth_config.keycloak.token_endpoint if auth_config and auth_config.keycloak else None
        )

        if not token_endpoint:
            try:
                config_snapshot = auth_config.model_dump() if auth_config else None
            except Exception:  # pragma: no cover - defensive
                config_snapshot = None

            logger.error(
                "Proxy auth config did not include a token endpoint",
                extra={"config": config_snapshot},
            )
            raise Exception("Proxy authentication failed: token endpoint not configured")

        self._token_endpoint = token_endpoint
        return token_endpoint

    def _create_jwt_assertion(self, token_endpoint: str) -> str:
        """Create a JWT assertion for the backend services flow."""
        self._load_private_key()
        if self._private_key is None:
            raise ValueError("Private key failed to load for backend services auth")

        now = int(time.time())
        claims = {
            "iss": self.client_id,
            "sub": self.client_id,
            "aud": token_endpoint,
            "exp": now + 300,  # 5 minutes
            "iat": now,
            "jti": f"{self.client_id}-{now}",
        }

        return jwt.encode(
            claims,
            self._private_key,
            algorithm="RS384",
            headers={"kid": "ai-assistant-key-1"},
        )

    async def get_access_token(self, force_refresh: bool = False) -> str:
        """Get an access token via the proxy using the backend services flow."""

        if not force_refresh and self._cached_token and self._token_expiry:
            if time.time() < self._token_expiry - 60:  # 60s buffer
                logger.debug("Using cached access token")
                return self._cached_token

        token_endpoint = await self._ensure_token_endpoint()

        try:
            logger.info(
                "Fetching access token via proxy auth endpoint",
                extra={"proxy": self.backend_api_url, "audience": token_endpoint},
            )

            client_assertion = self._create_jwt_assertion(token_endpoint)

            token_request = TokenRequest(
                grant_type="client_credentials",
                client_id=self.client_id,
                client_assertion_type="urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                client_assertion=client_assertion,
                scope=self.scope,
            )

            token_response = await asyncio.to_thread(
                self._auth_api.post_auth_token,
                token_request=token_request,
            )

            if token_response.error:
                logger.error(
                    "Proxy auth token request failed",
                    extra={
                        "error": token_response.error,
                        "description": token_response.error_description,
                    },
                )
                raise Exception(
                    f"Proxy authentication failed: {token_response.error} - {token_response.error_description}"
                )

            access_token = token_response.access_token
            if not access_token:
                logger.error(
                    "Proxy auth token response missing access_token",
                    extra={"response": token_response.to_dict() if hasattr(token_response, "to_dict") else None},
                )
                raise Exception("Proxy authentication failed: access token missing from response")

            expires_in_raw = token_response.expires_in or 3600
            expires_in = float(expires_in_raw)

            self._cached_token = access_token
            self._token_expiry = time.time() + expires_in

            logger.info("Successfully obtained access token via proxy")
            logger.debug("Token expires in %ss", expires_in)
            logger.debug("Token preview: %s...", access_token[:50])

            return access_token

        except ApiException as api_error:
            body = None
            try:
                body = json.loads(api_error.body) if api_error.body else None
            except json.JSONDecodeError:
                body = api_error.body

            logger.error(
                "Proxy auth API call failed",
                extra={"status": api_error.status, "reason": api_error.reason, "body": body},
            )
            raise Exception(f"Proxy authentication failed: {api_error.status} - {api_error.reason}") from api_error
        except Exception as exc:
            logger.error("Error fetching access token", extra={"error": str(exc)})
            raise


_auth_service: Optional[BackendServicesAuth] = None


def get_backend_services_auth() -> BackendServicesAuth:
    """Get or create the global backend services auth instance."""
    global _auth_service
    if _auth_service is None:
        _auth_service = BackendServicesAuth()
    return _auth_service
