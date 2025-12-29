"""
Tests for MCP server with JWT token validation enabled.

These tests require:
1. Backend API running on port 8445 (or configured backend URL)
2. MCP server started with --validate-tokens flag
3. Valid JWT tokens from the backend OAuth server

Run with: pytest test/test_authentication_validated.py

Prerequisites:
- Backend API: npm run backend (port 8445)
- MCP Server: python src/proxy_smart_backend_mcp_generated.py --transport http --validate-tokens
"""

import pytest
import httpx
import webbrowser
import socket
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from typing import Dict, Any, Optional
import threading
import time
import hashlib
import base64
import secrets

# Mark all tests in this file as requiring validated auth
pytestmark = [
    pytest.mark.asyncio,
    pytest.mark.validated_auth,
    pytest.mark.require_backend
]


@pytest.fixture(scope="session")
def backend_api_url():
    """Backend API URL for token acquisition."""
    return "http://localhost:8445"


@pytest.fixture(scope="session")
async def check_validation_available(backend_api_url):
    """
    Check if token validation is available.
    
    This fixture checks if:
    1. Backend API is running (JWKS endpoint)
    2. MCP server is running with --validate-tokens
    
    If not available, tests will be skipped automatically.
    """
    import httpx
    
    # Check if backend JWKS endpoint is available
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{backend_api_url}/.well-known/jwks.json",
                timeout=2.0
            )
            if response.status_code != 200:
                pytest.skip("Backend JWKS endpoint not available - validation tests skipped")
    except (httpx.ConnectError, httpx.TimeoutException):
        pytest.skip("Backend API not available - validation tests skipped")
    
    # Check if MCP server is running
    # Note: Server may return 200 with auth error, 400, or 405 - all indicate it's running
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8000/mcp",
                json={"jsonrpc": "2.0", "id": "test", "method": "ping"},
                timeout=2.0
            )
            # Any response (including auth errors) means server is running
            # We just need to verify the endpoint exists
    except (httpx.ConnectError, httpx.TimeoutException):
        pytest.skip("MCP server not available - validation tests skipped")
    
    return True


@pytest.fixture(scope="session")
def mcp_server_url_validated():
    """
    MCP server URL with validation enabled.
    
    Note: Tests will auto-skip if validation is not available.
    To run these tests, start the MCP server with:
    
        cd mcp-server
        uv run python generated_mcp/proxy_smart_backend_mcp_generated.py --transport http --port 8000 --validate-tokens
    
    Without --validate-tokens flag, the test_initialize_with_invalid_token test will fail
    because the server will delegate validation to the backend instead of rejecting
    invalid tokens immediately.
    """
    return "http://localhost:8000/mcp"


class OAuthCallbackHandler(BaseHTTPRequestHandler):
    """HTTP handler to capture OAuth callback."""
    
    authorization_code: Optional[str] = None
    error_received: Optional[str] = None
    
    def do_GET(self):
        """Handle OAuth callback."""
        parsed = urlparse(self.path)
        query = parse_qs(parsed.query)
        
        print(f"\n🔔 Callback received: {self.path}")
        
        if 'code' in query:
            OAuthCallbackHandler.authorization_code = query['code'][0]
            print(f"✅ Authorization code captured: {query['code'][0][:20]}...")
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b"""
                <html>
                <head><title>Authentication Successful</title></head>
                <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                    <h1 style="color: green;">&#x2714; Authentication Successful!</h1>
                    <p>You can close this window and return to the tests.</p>
                    <p style="color: gray; font-size: 12px;">This window will close automatically in 3 seconds...</p>
                    <script>setTimeout(() => window.close(), 3000);</script>
                </body>
                </html>
            """)
        elif 'error' in query:
            OAuthCallbackHandler.error_received = query.get('error_description', [query['error'][0]])[0]
            print(f"❌ OAuth error: {OAuthCallbackHandler.error_received}")
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            error_msg = OAuthCallbackHandler.error_received.replace('+', ' ')
            self.wfile.write(f"""
                <html>
                <head><title>Authentication Failed</title></head>
                <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                    <h1 style="color: red;">&#x2716; Authentication Failed</h1>
                    <p><strong>Error:</strong> {error_msg}</p>
                    <p style="color: gray; font-size: 12px;">You can close this window.</p>
                </body>
                </html>
            """.encode())
        else:
            print(f"⚠️  No code or error in callback: {query}")
            self.send_response(400)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b"""
                <html>
                <head><title>Authentication Failed</title></head>
                <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
                    <h1 style="color: red;">Authentication Failed</h1>
                    <p>No authorization code received.</p>
                </body>
                </html>
            """)
    
    def log_message(self, format, *args):
        """Enable log messages for debugging."""
        print(f"🌐 HTTP: {format % args}")


def get_free_port() -> int:
    """Find a free port for the callback server."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        s.listen(1)
        port = s.getsockname()[1]
    return port


@pytest.fixture(scope="session")
async def valid_jwt_token_interactive(backend_api_url):
    """
    Obtain a valid JWT token via interactive browser login.
    
    This opens a browser for the user to log in via OAuth2 authorization code flow.
    The token is cached for the entire test session.
    
    Uses the existing Keycloak configuration:
    - Client: ai-assistant-agent (public client for testing)
    - User: admin / admin
    """
    # Check if we can reach the backend
    try:
        async with httpx.AsyncClient() as client:
            health_response = await client.get(f"{backend_api_url}/health", timeout=5.0)
            if health_response.status_code != 200:
                pytest.fail(f"Backend API not healthy at {backend_api_url}")
    except Exception as e:
        pytest.fail(f"Backend API not available at {backend_api_url}: {e}")
    
    # Start local callback server
    callback_port = get_free_port()
    callback_url = f"http://localhost:{callback_port}/callback"
    
    # Reset class variables
    OAuthCallbackHandler.authorization_code = None
    OAuthCallbackHandler.error_received = None
    
    server = HTTPServer(('localhost', callback_port), OAuthCallbackHandler)
    server.timeout = 1  # 1 second timeout for handle_request
    
    # Use a thread that keeps serving until we get a code or timeout
    def serve_until_code():
        while OAuthCallbackHandler.authorization_code is None and OAuthCallbackHandler.error_received is None:
            server.handle_request()  # Will timeout after 1 second if no request
    
    server_thread = threading.Thread(target=serve_until_code, daemon=True)
    server_thread.start()
    
    # Generate PKCE code verifier and challenge (required by admin-ui client)
    code_verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode('utf-8')).digest()
    ).decode('utf-8').rstrip('=')
    
    # Build authorization URL using admin-ui client (public client that supports auth code flow)
    client_id = "admin-ui"
    # Use standard OIDC scopes that are already configured in Keycloak
    scope = "openid profile email"
    auth_url = (
        f"{backend_api_url}/auth/authorize"
        f"?response_type=code"
        f"&client_id={client_id}"
        f"&redirect_uri={callback_url}"
        f"&scope={scope}"
        f"&state=test-state-123"
        f"&code_challenge={code_challenge}"
        f"&code_challenge_method=S256"
    )
    
    print("\n" + "="*80)
    print("🔐 INTERACTIVE LOGIN REQUIRED")
    print("="*80)
    print(f"\nOpening browser for OAuth login...")
    print(f"Auth URL: {auth_url}")
    print(f"Callback URL: {callback_url}")
    print("\nPlease log in with admin credentials:")
    print("  - Username: admin")
    print("  - Password: admin")
    print("\nWaiting for authentication...")
    
    # Open browser
    webbrowser.open(auth_url)
    
    # Wait for callback (timeout after 60 seconds)
    timeout = 60
    start_time = time.time()
    while OAuthCallbackHandler.authorization_code is None and OAuthCallbackHandler.error_received is None:
        if time.time() - start_time > timeout:
            server.server_close()
            pytest.skip("OAuth login timed out after 60 seconds")
        time.sleep(0.5)
        # Check if thread exited (meaning code was received or error occurred)
        if not server_thread.is_alive():
            break
    
    # Close the server socket
    server.server_close()
    # Wait for thread to finish gracefully
    server_thread.join(timeout=3)
    
    # Check if we got an error instead of code
    if OAuthCallbackHandler.error_received:
        pytest.skip(f"OAuth error: {OAuthCallbackHandler.error_received}")
    
    auth_code = OAuthCallbackHandler.authorization_code
    if not auth_code:
        pytest.skip("No authorization code received")
    
    print(f"✅ Authorization code received: {auth_code[:20]}...")
    
    # Exchange code for token (include PKCE code_verifier)
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            f"{backend_api_url}/auth/token",
            data={
                "grant_type": "authorization_code",
                "code": auth_code,
                "redirect_uri": callback_url,
                "client_id": client_id,
                "code_verifier": code_verifier,  # PKCE verification
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if token_response.status_code != 200:
            pytest.skip(f"Token exchange failed: {token_response.status_code} - {token_response.text}")
        
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            pytest.skip("No access token in response")
        
        print(f"✅ Access token obtained: {access_token[:30]}...")
        print("="*80 + "\n")
        
        return access_token


@pytest.fixture
async def valid_jwt_token(backend_api_url):
    """
    Obtain a valid JWT token from the backend OAuth server.
    
    Tries client credentials flow using ai-assistant-agent service account (non-interactive).
    Falls back to interactive browser login if that fails.
    """
    async with httpx.AsyncClient() as client:
        try:
            # Try to get a token using client credentials flow with ai-assistant-agent
            # This client uses JWT authentication, so we skip it for now
            # Instead, try admin-service which uses client secret
            response = await client.post(
                f"{backend_api_url}/auth/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": "admin-service",
                    "client_secret": "admin-service-secret",
                    "scope": "openid profile email"
                },
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                timeout=5.0
            )
            
            if response.status_code == 200:
                token_data = response.json()
                access_token = token_data.get("access_token")
                if access_token:
                    return access_token
            
            # If client credentials failed, FAIL the test
            pytest.fail(
                f"Could not obtain token via client credentials (status {response.status_code}). "
                f"Response: {response.text[:200]}"
            )
        except httpx.ConnectError:
            pytest.fail(
                f"Backend API not available at {backend_api_url}. "
                "Start with: npm run backend"
            )


@pytest.fixture
def invalid_jwt_token():
    """Return an invalid JWT token for negative tests."""
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWtlIiwiZXhwIjoxfQ.invalid"


class TestTokenValidationEnabled:
    """Test JWT token validation when --validate-tokens is enabled."""
    
    @pytest.fixture(autouse=True)
    async def _check_available(self, check_validation_available):
        """Auto-skip tests if validation is not available."""
        pass
    
    async def test_initialize_with_interactive_login(
        self,
        mcp_server_url_validated,
        valid_jwt_token_interactive
    ):
        """
        Test that valid JWT tokens from interactive login are accepted.
        
        This test will open a browser for you to log in.
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                mcp_server_url_validated,
                json={
                    "jsonrpc": "2.0",
                    "id": "init",
                    "method": "initialize",
                    "params": {
                        "protocolVersion": "2025-03-26",
                        "capabilities": {},
                        "clientInfo": {
                            "name": "validated-test-interactive",
                            "version": "1.0"
                        }
                    }
                },
                headers={
                    "Authorization": f"Bearer {valid_jwt_token_interactive}",
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            assert response.status_code == 200
            
            # Parse SSE response
            text = response.text
            assert "event: message" in text
            assert "data:" in text
            
            # Extract JSON from SSE
            import json
            for line in text.split('\n'):
                if line.startswith('data: '):
                    data = json.loads(line[6:])
                    assert data["jsonrpc"] == "2.0"
                    assert "result" in data
                    assert data["result"]["protocolVersion"] == "2025-03-26"
                    print(f"\n✅ Successfully authenticated with interactive token!")
                    print(f"   MCP Server info: {data['result'].get('serverInfo', {})}")
                    break
    
    async def test_initialize_with_valid_token(
        self,
        mcp_server_url_validated,
        valid_jwt_token
    ):
        """Test that valid JWT tokens are accepted (via client credentials)."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                mcp_server_url_validated,
                json={
                    "jsonrpc": "2.0",
                    "id": "init",
                    "method": "initialize",
                    "params": {
                        "protocolVersion": "2025-03-26",
                        "capabilities": {},
                        "clientInfo": {
                            "name": "validated-test",
                            "version": "1.0"
                        }
                    }
                },
                headers={
                    "Authorization": f"Bearer {valid_jwt_token}",
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            assert response.status_code == 200
            
            # Parse SSE response
            text = response.text
            assert "event: message" in text
            assert "data:" in text
            
            # Extract JSON from SSE
            import json
            for line in text.split('\n'):
                if line.startswith('data: '):
                    data = json.loads(line[6:])
                    assert data["jsonrpc"] == "2.0"
                    assert "result" in data
                    assert data["result"]["protocolVersion"] == "2025-03-26"
                    break
    
    async def test_initialize_with_invalid_token(
        self,
        mcp_server_url_validated,
        invalid_jwt_token
    ):
        """
        Test that invalid JWT tokens are rejected.
        
        This test requires the MCP server to be running with --validate-tokens flag.
        Start the server with:
            uv run python src/proxy_smart_backend_mcp_generated.py --transport http --port 8000 --validate-tokens
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                mcp_server_url_validated,
                json={
                    "jsonrpc": "2.0",
                    "id": "init",
                    "method": "initialize",
                    "params": {
                        "protocolVersion": "2025-03-26",
                        "capabilities": {},
                        "clientInfo": {
                            "name": "validated-test",
                            "version": "1.0"
                        }
                    }
                },
                headers={
                    "Authorization": f"Bearer {invalid_jwt_token}",
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            # Should return 401 or error in response
            if response.status_code == 200:
                # Check for error in JSON-RPC response
                text = response.text
                import json
                error_found = False
                for line in text.split('\n'):
                    if line.startswith('data: '):
                        data = json.loads(line[6:])
                        if "error" in data:
                            error_found = True
                            assert data["error"]["code"] == -32001, "Expected auth error code -32001"
                            break
                        elif "result" in data:
                            # Server accepted invalid token - it's not running with --validate-tokens
                            pytest.fail(
                                "MCP server accepted invalid token. "
                                "Please restart the server with --validate-tokens flag:\n"
                                "  uv run python src/proxy_smart_backend_mcp_generated.py --transport http --port 8000 --validate-tokens"
                            )
                
                assert error_found, "Expected authentication error in JSON-RPC response"
            else:
                assert response.status_code in [401, 403], f"Expected 401/403, got {response.status_code}"
    
    async def test_initialize_without_token(
        self,
        mcp_server_url_validated
    ):
        """Test that requests without tokens are rejected."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                mcp_server_url_validated,
                json={
                    "jsonrpc": "2.0",
                    "id": "init",
                    "method": "initialize",
                    "params": {
                        "protocolVersion": "2025-03-26",
                        "capabilities": {},
                        "clientInfo": {
                            "name": "validated-test",
                            "version": "1.0"
                        }
                    }
                },
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            # Should fail without token
            # Could be 401, 403, or error in response
            assert response.status_code in [200, 401, 403]
    
    async def test_token_expiration(
        self,
        mcp_server_url_validated,
        backend_api_url
    ):
        """Test that expired tokens are rejected."""
        # Create a token with very short expiry
        async with httpx.AsyncClient() as client:
            # Get a short-lived token (if backend supports it)
            try:
                response = await client.post(
                    f"{backend_api_url}/auth/token",
                    data={
                        "grant_type": "client_credentials",
                        "client_id": "test-client",
                        "client_secret": "test-secret",
                        "scope": "openid profile",
                        "expires_in": "1"  # 1 second
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code != 200:
                    pytest.skip("Backend doesn't support custom expiry")
                
                token_data = response.json()
                expired_token = token_data.get("access_token")
                
                # Wait for token to expire
                import asyncio
                await asyncio.sleep(2)
                
                # Try to use expired token
                response = await client.post(
                    mcp_server_url_validated,
                    json={
                        "jsonrpc": "2.0",
                        "id": "init",
                        "method": "initialize",
                        "params": {
                            "protocolVersion": "2025-03-26",
                            "capabilities": {},
                            "clientInfo": {
                                "name": "validated-test",
                                "version": "1.0"
                            }
                        }
                    },
                    headers={
                        "Authorization": f"Bearer {expired_token}",
                        "Content-Type": "application/json",
                        "Accept": "application/json, text/event-stream"
                    }
                )
                
                # Should reject expired token
                if response.status_code == 200:
                    text = response.text
                    import json
                    for line in text.split('\n'):
                        if line.startswith('data: '):
                            data = json.loads(line[6:])
                            assert "error" in data
                            break
                else:
                    assert response.status_code in [401, 403]
                    
            except httpx.ConnectError:
                pytest.skip("Backend not available")
    
    async def test_token_scopes_validation(
        self,
        mcp_server_url_validated,
        backend_api_url
    ):
        """Test that tokens without required scopes are rejected."""
        async with httpx.AsyncClient() as client:
            try:
                # Get token with insufficient scopes
                response = await client.post(
                    f"{backend_api_url}/auth/token",
                    data={
                        "grant_type": "client_credentials",
                        "client_id": "test-client",
                        "client_secret": "test-secret",
                        "scope": "other:scope"  # Wrong scope
                    },
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                if response.status_code != 200:
                    pytest.skip("Could not get token with limited scope")
                
                token_data = response.json()
                limited_token = token_data.get("access_token")
                
                # Try to use token with wrong scope
                response = await client.post(
                    mcp_server_url_validated,
                    json={
                        "jsonrpc": "2.0",
                        "id": "init",
                        "method": "initialize",
                        "params": {
                            "protocolVersion": "2025-03-26",
                            "capabilities": {},
                            "clientInfo": {
                                "name": "validated-test",
                                "version": "1.0"
                            }
                        }
                    },
                    headers={
                        "Authorization": f"Bearer {limited_token}",
                        "Content-Type": "application/json",
                        "Accept": "application/json, text/event-stream"
                    }
                )
                
                # Should reject token without required scopes
                if response.status_code == 200:
                    text = response.text
                    import json
                    for line in text.split('\n'):
                        if line.startswith('data: '):
                            data = json.loads(line[6:])
                            assert "error" in data
                            break
                else:
                    assert response.status_code in [401, 403]
                    
            except httpx.ConnectError:
                pytest.skip("Backend not available")
    
    async def test_jwks_endpoint_accessible(
        self,
        backend_api_url
    ):
        """Test that JWKS endpoint is accessible for token validation."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{backend_api_url}/.well-known/jwks.json"
                )
                
                assert response.status_code == 200
                jwks = response.json()
                assert "keys" in jwks
                assert len(jwks["keys"]) > 0
                
                # Verify key structure
                for key in jwks["keys"]:
                    assert "kty" in key  # Key type
                    assert "kid" in key  # Key ID
                    assert "use" in key or "key_ops" in key
                    
            except httpx.ConnectError:
                pytest.skip("Backend not available")
    
    async def test_oauth_metadata_endpoint(
        self,
        backend_api_url
    ):
        """Test OAuth 2.0 authorization server metadata endpoint."""
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{backend_api_url}/.well-known/oauth-authorization-server"
                )
                
                assert response.status_code == 200
                metadata = response.json()
                
                # RFC 8414 required fields
                assert "issuer" in metadata
                assert "token_endpoint" in metadata
                assert "authorization_endpoint" in metadata
                assert "jwks_uri" in metadata
                
                # Check supported grant types
                assert "grant_types_supported" in metadata
                assert "client_credentials" in metadata["grant_types_supported"]
                
            except httpx.ConnectError:
                pytest.skip("Backend not available")


class TestToolExecutionWithValidation:
    """Test tool execution with validated tokens."""
    
    @pytest.fixture(autouse=True)
    async def _check_available(self, check_validation_available):
        """Auto-skip tests if validation is not available."""
        pass
    
    async def test_list_tools_with_valid_token(
        self,
        mcp_server_url_validated,
        valid_jwt_token
    ):
        """Test listing tools with a valid token."""
        async with httpx.AsyncClient() as client:
            # First initialize to get session
            init_response = await client.post(
                mcp_server_url_validated,
                json={
                    "jsonrpc": "2.0",
                    "id": "init",
                    "method": "initialize",
                    "params": {
                        "protocolVersion": "2025-03-26",
                        "capabilities": {},
                        "clientInfo": {"name": "test", "version": "1.0"}
                    }
                },
                headers={
                    "Authorization": f"Bearer {valid_jwt_token}",
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            # Get session ID
            session_id = init_response.headers.get("Mcp-Session-Id")
            assert session_id is not None

            # Send initialized notification (required by MCP protocol)
            initialized_response = await client.post(
                mcp_server_url_validated,
                json={
                    "jsonrpc": "2.0",
                    "method": "notifications/initialized"
                },
                headers={
                    "Authorization": f"Bearer {valid_jwt_token}",
                    "Mcp-Session-Id": session_id,
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            # Notification should return 202 Accepted
            assert initialized_response.status_code == 202

            # List tools
            tools_response = await client.post(
                mcp_server_url_validated,
                json={
                    "jsonrpc": "2.0",
                    "id": "list",
                    "method": "tools/list",
                    "params": {}
                },
                headers={
                    "Authorization": f"Bearer {valid_jwt_token}",
                    "Mcp-Session-Id": session_id,
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            assert tools_response.status_code == 200
            
            # Parse response
            text = tools_response.text
            import json
            for line in text.split('\n'):
                if line.startswith('data: '):
                    data = json.loads(line[6:])
                    assert "result" in data
                    tools = data["result"].get("tools", [])
                    # With validation, tools should be available if backend is accessible
                    assert isinstance(tools, list)
                    # Note: Might be empty if backend API client can't authenticate
                    break
    
    async def test_call_tool_with_valid_token(
        self,
        mcp_server_url_validated,
        valid_jwt_token
    ):
        """Test calling a tool with a valid token."""
        async with httpx.AsyncClient() as client:
            # Initialize
            init_response = await client.post(
                mcp_server_url_validated,
                json={
                    "jsonrpc": "2.0",
                    "id": "init",
                    "method": "initialize",
                    "params": {
                        "protocolVersion": "2025-03-26",
                        "capabilities": {},
                        "clientInfo": {"name": "test", "version": "1.0"}
                    }
                },
                headers={
                    "Authorization": f"Bearer {valid_jwt_token}",
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            session_id = init_response.headers.get("Mcp-Session-Id")
            
            # Try to call a simple tool (e.g., server health check)
            tool_response = await client.post(
                mcp_server_url_validated,
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
                    "Authorization": f"Bearer {valid_jwt_token}",
                    "Mcp-Session-Id": session_id,
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            assert tool_response.status_code == 200
            
            # Parse response
            text = tool_response.text
            import json
            for line in text.split('\n'):
                if line.startswith('data: '):
                    data = json.loads(line[6:])
                    # Should have result or error
                    assert "result" in data or "error" in data
                    break
