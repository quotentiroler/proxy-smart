"""Keycloak authentication service for MCP server using Backend Services JWT auth."""

import json
import logging
import time
from pathlib import Path
from typing import Optional
import httpx
import jwt
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

logger = logging.getLogger(__name__)


class KeycloakBackendServicesAuth:
    """
    Handles Backend Services authentication with Keycloak using asymmetric JWT.
    
    This implements the SMART Backend Services specification for obtaining
    access tokens using client_credentials grant with JWT assertion.
    """

    def __init__(
        self,
        keycloak_url: str = "http://localhost:8080",
        realm: str = "proxy-smart",
        client_id: str = "ai-assistant-agent",
        private_key_path: Optional[str] = None,
    ):
        """
        Initialize Keycloak Backend Services authentication.

        Args:
            keycloak_url: Base URL of Keycloak server
            realm: Keycloak realm name
            client_id: Backend Services client ID
            private_key_path: Path to private key PEM file for JWT signing
        """
        self.keycloak_url = keycloak_url
        self.realm = realm
        self.client_id = client_id
        self.token_endpoint = f"{keycloak_url}/realms/{realm}/protocol/openid-connect/token"
        
        # Load private key
        if private_key_path is None:
            # Default to keys directory at mcp-server/keys/
            # Path calculation: keycloak_auth.py -> src/services -> src -> mcp-server -> keys
            private_key_path = str(Path(__file__).parent.parent.parent / "keys" / "ai_assistant_private.pem")
        
        self.private_key_path = private_key_path
        self._private_key = None
        self._cached_token: Optional[str] = None
        self._token_expiry: Optional[float] = None

    def _load_private_key(self):
        """Load the private key from file."""
        if self._private_key is None:
            try:
                with open(self.private_key_path, "rb") as f:
                    self._private_key = serialization.load_pem_private_key(
                        f.read(),
                        password=None,
                        backend=default_backend()
                    )
                logger.info(f"Successfully loaded private key from {self.private_key_path}")
            except Exception as e:
                logger.error(f"Failed to load private key from {self.private_key_path}: {e}")
                raise

    def _create_jwt_assertion(self) -> str:
        """
        Create a JWT assertion for client authentication.
        
        The JWT is signed with the private key and includes:
        - iss: client_id (issuer)
        - sub: client_id (subject)
        - aud: token endpoint (audience)
        - exp: expiration time (5 minutes from now)
        - iat: issued at time
        - jti: unique identifier
        """
        self._load_private_key()
        
        now = int(time.time())
        claims = {
            "iss": self.client_id,
            "sub": self.client_id,
            "aud": self.token_endpoint,
            "exp": now + 300,  # 5 minutes
            "iat": now,
            "jti": f"{self.client_id}-{now}"
        }
        
        # Sign the JWT with RS384 (matches Keycloak config)
        token = jwt.encode(
            claims,
            self._private_key,
            algorithm="RS384",
            headers={"kid": "ai-assistant-key-1"}
        )
        
        return token

    async def get_access_token(self, force_refresh: bool = False) -> str:
        """
        Get an access token from Keycloak using client_credentials with JWT assertion.

        Args:
            force_refresh: Force token refresh even if cached token is valid

        Returns:
            JWT access token

        Raises:
            Exception: If token fetch fails
        """
        # Return cached token if still valid
        if not force_refresh and self._cached_token and self._token_expiry:
            if time.time() < self._token_expiry - 60:  # 60s buffer
                logger.debug("Using cached access token")
                return self._cached_token

        try:
            logger.info(f"Fetching access token from Keycloak: {self.token_endpoint}")

            # Create JWT assertion
            client_assertion = self._create_jwt_assertion()
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.token_endpoint,
                    data={
                        "grant_type": "client_credentials",
                        "client_id": self.client_id,
                        "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                        "client_assertion": client_assertion,
                        "scope": "openid profile"
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"},
                    timeout=10.0,
                )

                response.raise_for_status()
                token_data = response.json()
                access_token = token_data["access_token"]
                expires_in = token_data.get("expires_in", 3600)

                self._cached_token = access_token
                self._token_expiry = time.time() + expires_in
                
                logger.info("Successfully obtained access token from Keycloak")
                logger.debug(f"Token expires in {expires_in}s")
                logger.debug(f"Token: {access_token[:50]}...")

                return access_token

        except httpx.HTTPStatusError as e:
            logger.error(f"Failed to get access token: HTTP {e.response.status_code}")
            logger.error(f"Response: {e.response.text}")
            raise Exception(f"Keycloak authentication failed: {e.response.status_code} - {e.response.text}")
        except Exception as e:
            logger.error(f"Error fetching access token: {e}")
            raise


# Global instance
_keycloak_auth: Optional[KeycloakBackendServicesAuth] = None


def get_keycloak_auth() -> KeycloakBackendServicesAuth:
    """Get or create the global Keycloak auth instance."""
    global _keycloak_auth
    if _keycloak_auth is None:
        _keycloak_auth = KeycloakBackendServicesAuth()
    return _keycloak_auth
