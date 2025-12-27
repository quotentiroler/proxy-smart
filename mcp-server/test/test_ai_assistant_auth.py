"""
Test AI Assistant Agent authentication with JWT client assertion.

This test validates that the ai-assistant-agent client can authenticate using
JWT client assertion (RFC 7523) for Backend Services authentication pattern.

Requirements:
    - Keycloak running with ai-assistant-agent client configured
    - Private key for signing JWT assertions (generated via generate_jwt_keypair.py)
    - MCP server running with --validate-tokens flag
"""

import base64
import hashlib
import json
import secrets
import time
from pathlib import Path

import httpx
import jwt
import pytest


# Test configuration
AI_ASSISTANT_CLIENT_ID = "ai-assistant-agent"
BACKEND_PROXY_URL = "http://localhost:8445"
MCP_SERVER_URL = "http://localhost:8000/mcp"


async def discover_token_endpoint(backend_url: str) -> str:
    """
    Discover the token endpoint following MCP authorization spec.
    
    This implements the proper MCP discovery flow:
    1. Fetch Protected Resource Metadata (RFC 9728) to get authorization server(s)
    2. Fetch Authorization Server Metadata to get token endpoint
    
    The token endpoint URL is needed for the JWT assertion's audience (aud) claim.
    
    Args:
        backend_url: The MCP server (backend proxy) URL
        
    Returns:
        The authorization server's token endpoint URL
    """
    async with httpx.AsyncClient() as client:
        # Step 1: Get Protected Resource Metadata (RFC 9728)
        # This tells us which authorization server(s) to use
        pr_response = await client.get(
            f"{backend_url}/.well-known/oauth-protected-resource",
            timeout=10.0
        )
        pr_response.raise_for_status()
        pr_metadata = pr_response.json()
        
        # Extract authorization server(s)
        auth_servers = pr_metadata.get("authorization_servers", [])
        if not auth_servers:
            raise ValueError("No authorization servers found in Protected Resource Metadata")
        
        # Use the first authorization server
        # (In production, client should select appropriate server per RFC 9728 Section 7.6)
        auth_server_url = auth_servers[0]
        
        # Step 2: Get Authorization Server Metadata
        # Try OpenID Connect Discovery first, then OAuth 2.0 AS Metadata
        # Per MCP spec: clients MUST support both discovery mechanisms
        
        # Try OpenID Connect Discovery
        try:
            oidc_response = await client.get(
                f"{auth_server_url}/.well-known/openid-configuration",
                timeout=10.0
            )
            oidc_response.raise_for_status()
            as_metadata = oidc_response.json()
            return as_metadata["token_endpoint"]
        except (httpx.HTTPError, KeyError):
            pass
        
        # Try OAuth 2.0 Authorization Server Metadata
        try:
            oauth_response = await client.get(
                f"{auth_server_url}/.well-known/oauth-authorization-server",
                timeout=10.0
            )
            oauth_response.raise_for_status()
            as_metadata = oauth_response.json()
            return as_metadata["token_endpoint"]
        except (httpx.HTTPError, KeyError):
            pass
        
        raise ValueError(
            f"Could not discover token endpoint from authorization server {auth_server_url}. "
            "Tried both OpenID Connect Discovery and OAuth 2.0 AS Metadata endpoints."
        )


def load_private_key() -> str:
    """Load the AI assistant's private key for JWT signing."""
    # Try to find the private key in the keys directory
    script_dir = Path(__file__).parent.parent
    private_key_path = script_dir / "keys" / "ai_assistant_private.pem"
    
    if not private_key_path.exists():
        pytest.skip(
            f"Private key not found at {private_key_path}. "
            "Generate it with: python scripts/generate_jwt_keypair.py"
        )
    
    with open(private_key_path, 'r') as f:
        return f.read()


def create_jwt_assertion(client_id: str, token_endpoint: str, private_key: str) -> str:
    """
    Create a JWT assertion for client authentication (RFC 7523).
    
    Args:
        client_id: The OAuth2 client ID
        token_endpoint: The token endpoint URL
        private_key: RSA private key in PEM format
        
    Returns:
        JWT assertion string
    """
    now = int(time.time())
    
    # JWT claims for client assertion
    claims = {
        "iss": client_id,  # Issuer (client_id)
        "sub": client_id,  # Subject (client_id)
        "aud": token_endpoint,  # Audience (token endpoint)
        "jti": secrets.token_urlsafe(32),  # Unique JWT ID
        "exp": now + 300,  # Expires in 5 minutes
        "iat": now  # Issued at
    }
    
    # Sign with RS384 (matching Keycloak configuration)
    assertion = jwt.encode(
        claims,
        private_key,
        algorithm="RS384",
        headers={"kid": "ai-assistant-key-1"}  # Key ID from Keycloak config
    )
    
    return assertion


@pytest.fixture(scope="module")
async def ai_assistant_token():
    """
    Obtain an access token for the AI Assistant using JWT client assertion.
    
    This uses the Backend Services authentication pattern (client_credentials grant
    with JWT authentication).
    """
    try:
        # Discover the Keycloak token endpoint from OAuth metadata
        keycloak_token_endpoint = await discover_token_endpoint(BACKEND_PROXY_URL)
        
        # Load private key
        private_key = load_private_key()
        
        # Create JWT assertion with Keycloak token endpoint as audience
        jwt_assertion = create_jwt_assertion(
            client_id=AI_ASSISTANT_CLIENT_ID,
            token_endpoint=keycloak_token_endpoint,
            private_key=private_key
        )
        
        # Request token using client_credentials grant with JWT assertion
        # Send request to backend proxy (which forwards to Keycloak)
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BACKEND_PROXY_URL}/auth/token",
                data={
                    "grant_type": "client_credentials",
                    "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                    "client_assertion": jwt_assertion,
                    "scope": "openid profile email"
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                timeout=10.0
            )
            
            if response.status_code != 200:
                pytest.fail(
                    f"Failed to obtain AI Assistant token: {response.status_code}\n"
                    f"Response: {response.text}"
                )
            
            token_data = response.json()
            access_token = token_data.get("access_token")
            
            if not access_token:
                pytest.fail(f"No access token in response: {token_data}")
            
            print(f"\n✅ Successfully obtained AI Assistant token")
            print(f"   Token type: {token_data.get('token_type')}")
            print(f"   Expires in: {token_data.get('expires_in')} seconds")
            print(f"   Scopes: {token_data.get('scope')}")
            
            return access_token
            
    except httpx.ConnectError:
        pytest.skip("Backend API not available. Start with: npm run backend")
    except FileNotFoundError as e:
        pytest.skip(f"Required file not found: {e}")


class TestAIAssistantAuthentication:
    """Test AI Assistant agent authentication with JWT client assertion."""
    
    @pytest.mark.asyncio
    async def test_obtain_token_with_jwt_assertion(self):
        """Test that AI Assistant can obtain a token using JWT assertion."""
        # Discover the Keycloak token endpoint from OAuth metadata
        keycloak_token_endpoint = await discover_token_endpoint(BACKEND_PROXY_URL)
        
        private_key = load_private_key()
        jwt_assertion = create_jwt_assertion(
            client_id=AI_ASSISTANT_CLIENT_ID,
            token_endpoint=keycloak_token_endpoint,
            private_key=private_key
        )
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BACKEND_PROXY_URL}/auth/token",
                data={
                    "grant_type": "client_credentials",
                    "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                    "client_assertion": jwt_assertion,
                    "scope": "openid profile email"
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                timeout=10.0
            )
            
            assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
            
            token_data = response.json()
            assert "access_token" in token_data
            assert token_data.get("token_type").lower() == "bearer"
            assert "expires_in" in token_data
            
            # Decode token to verify claims
            access_token = token_data["access_token"]
            decoded = jwt.decode(access_token, options={"verify_signature": False})
            
            # Verify client_id in token
            assert decoded.get("azp") == AI_ASSISTANT_CLIENT_ID or decoded.get("client_id") == AI_ASSISTANT_CLIENT_ID
            
            # Verify audience includes MCP server
            aud = decoded.get("aud", [])
            if isinstance(aud, str):
                aud = [aud]
            assert "http://localhost:8445/mcp" in aud, f"MCP audience not found in token: {aud}"
            
            print(f"\n✅ Token claims verified:")
            print(f"   Client: {decoded.get('azp') or decoded.get('client_id')}")
            print(f"   Subject: {decoded.get('sub')}")
            print(f"   Audience: {aud}")
            print(f"   Scopes: {decoded.get('scope', '').split()}")
    
    @pytest.mark.asyncio
    async def test_mcp_initialize_with_ai_assistant_token(self, ai_assistant_token):
        """Test MCP server initialization with AI Assistant token."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                MCP_SERVER_URL,
                json={
                    "jsonrpc": "2.0",
                    "id": "init",
                    "method": "initialize",
                    "params": {
                        "protocolVersion": "2025-03-26",
                        "capabilities": {},
                        "clientInfo": {
                            "name": "ai-assistant-test",
                            "version": "1.0"
                        }
                    }
                },
                headers={
                    "Authorization": f"Bearer {ai_assistant_token}",
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                },
                timeout=10.0
            )
            
            assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
            
            # Parse SSE response
            text = response.text
            assert "event: message" in text
            assert "data:" in text
            
            # Extract JSON from SSE
            for line in text.split('\n'):
                if line.startswith('data: '):
                    data = json.loads(line[6:])
                    assert data["jsonrpc"] == "2.0"
                    assert "result" in data
                    assert data["result"]["protocolVersion"] == "2025-03-26"
                    
                    print(f"\n✅ AI Assistant successfully initialized MCP session")
                    print(f"   Server: {data['result'].get('serverInfo', {}).get('name')}")
                    print(f"   Session ID: {response.headers.get('Mcp-Session-Id')}")
    
    @pytest.mark.asyncio
    async def test_mcp_list_tools_with_ai_assistant(self, ai_assistant_token):
        """Test listing MCP tools with AI Assistant token."""
        async with httpx.AsyncClient() as client:
            # Initialize first
            init_response = await client.post(
                MCP_SERVER_URL,
                json={
                    "jsonrpc": "2.0",
                    "id": "init",
                    "method": "initialize",
                    "params": {
                        "protocolVersion": "2025-03-26",
                        "capabilities": {},
                        "clientInfo": {"name": "ai-assistant-test", "version": "1.0"}
                    }
                },
                headers={
                    "Authorization": f"Bearer {ai_assistant_token}",
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            session_id = init_response.headers.get("Mcp-Session-Id")
            assert session_id is not None
            
            # Send initialized notification
            await client.post(
                MCP_SERVER_URL,
                json={
                    "jsonrpc": "2.0",
                    "method": "notifications/initialized"
                },
                headers={
                    "Authorization": f"Bearer {ai_assistant_token}",
                    "Mcp-Session-Id": session_id,
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            # List tools
            tools_response = await client.post(
                MCP_SERVER_URL,
                json={
                    "jsonrpc": "2.0",
                    "id": "list",
                    "method": "tools/list",
                    "params": {}
                },
                headers={
                    "Authorization": f"Bearer {ai_assistant_token}",
                    "Mcp-Session-Id": session_id,
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            assert tools_response.status_code == 200
            
            # Parse SSE response
            text = tools_response.text
            for line in text.split('\n'):
                if line.startswith('data: '):
                    data = json.loads(line[6:])
                    assert "result" in data, f"Expected result, got: {data}"
                    
                    tools = data["result"].get("tools", [])
                    print(f"\n✅ AI Assistant can access {len(tools)} MCP tools")
                    
                    # Check for expected tools (admin operations for AI Assistant)
                    tool_names = [t["name"] for t in tools]
                    
                    # AI Assistant should have access to admin tools
                    expected_admin_tools = [
                        "admin_list_healthcare_users",
                        "admin_list_smart_apps",
                        "admin_list_identity_providers"
                    ]
                    
                    found_admin_tools = [t for t in expected_admin_tools if t in tool_names]
                    print(f"   Admin tools available: {len(found_admin_tools)}/{len(expected_admin_tools)}")
                    
                    if found_admin_tools:
                        print(f"   Sample admin tools: {found_admin_tools[:3]}")
    
    @pytest.mark.asyncio
    async def test_mcp_call_tool_with_ai_assistant(self, ai_assistant_token):
        """Test calling an MCP tool with AI Assistant token."""
        async with httpx.AsyncClient() as client:
            # Initialize
            init_response = await client.post(
                MCP_SERVER_URL,
                json={
                    "jsonrpc": "2.0",
                    "id": "init",
                    "method": "initialize",
                    "params": {
                        "protocolVersion": "2025-03-26",
                        "capabilities": {},
                        "clientInfo": {"name": "ai-assistant-test", "version": "1.0"}
                    }
                },
                headers={
                    "Authorization": f"Bearer {ai_assistant_token}",
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            session_id = init_response.headers.get("Mcp-Session-Id")
            
            # Send initialized notification
            await client.post(
                MCP_SERVER_URL,
                json={
                    "jsonrpc": "2.0",
                    "method": "notifications/initialized"
                },
                headers={
                    "Authorization": f"Bearer {ai_assistant_token}",
                    "Mcp-Session-Id": session_id,
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            # Call a tool (health check)
            tool_response = await client.post(
                MCP_SERVER_URL,
                json={
                    "jsonrpc": "2.0",
                    "id": "call",
                    "method": "tools/call",
                    "params": {
                        "name": "list_health",
                        "arguments": {}
                    }
                },
                headers={
                    "Authorization": f"Bearer {ai_assistant_token}",
                    "Mcp-Session-Id": session_id,
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            assert tool_response.status_code == 200
            
            # Parse SSE response
            text = tool_response.text
            for line in text.split('\n'):
                if line.startswith('data: '):
                    data = json.loads(line[6:])
                    assert "result" in data, f"Expected result, got: {data}"
                    
                    print(f"\n✅ AI Assistant successfully called MCP tool")
                    print(f"   Tool: list_health")
                    print(f"   Result: {json.dumps(data['result'], indent=2)[:200]}...")


@pytest.mark.asyncio
async def test_jwt_assertion_validation():
    """Test that invalid JWT assertions are rejected."""
    # Discover the Keycloak token endpoint from OAuth metadata
    keycloak_token_endpoint = await discover_token_endpoint(BACKEND_PROXY_URL)
    
    # Create an invalid JWT assertion (wrong signing key)
    invalid_assertion = jwt.encode(
        {
            "iss": AI_ASSISTANT_CLIENT_ID,
            "sub": AI_ASSISTANT_CLIENT_ID,
            "aud": keycloak_token_endpoint,
            "exp": int(time.time()) + 300
        },
        "wrong-secret",  # Wrong key
        algorithm="HS256"  # Wrong algorithm
    )
    
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BACKEND_PROXY_URL}/auth/token",
            data={
                "grant_type": "client_credentials",
                "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                "client_assertion": invalid_assertion
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=10.0
        )
        
        # Should reject invalid assertion
        assert response.status_code in [400, 401], f"Expected 400/401, got {response.status_code}"
        
        error_data = response.json()
        assert "error" in error_data
        
        print(f"\n✅ Invalid JWT assertion correctly rejected")
        print(f"   Error: {error_data.get('error')}")
        print(f"   Description: {error_data.get('error_description')}")
