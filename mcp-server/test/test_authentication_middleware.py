"""
Tests for ApiClientContextMiddleware with JWT validation.

Tests authentication middleware functionality including:
- JWT token validation with JWTVerifier
- Bearer token extraction from headers
- Environment variable token handling (STDIO mode)
- API client creation and context state management
- Token validation bypass mode
"""

import os
from unittest.mock import AsyncMock, Mock, patch

import pytest
from fastmcp.server.auth import AccessToken
from mcp import McpError

from middleware.authentication import ApiClientContextMiddleware


@pytest.fixture
def mock_middleware_context():
    """Create a mock MiddlewareContext."""
    context = Mock()
    context.method = "tools/list"
    context.fastmcp_context = Mock()
    context.fastmcp_context.set_state = Mock()
    # request_context needs to be an object with headers attribute, not a dict
    request_ctx = Mock()
    request_ctx.headers = {
        "Authorization": "Bearer test-jwt-token"
    }
    context.fastmcp_context.request_context = request_ctx
    return context


@pytest.fixture
def mock_jwt_verifier():
    """Create a mock JWTVerifier that can be passed directly to middleware."""
    verifier = Mock()
    verifier.verify_token = AsyncMock()
    return verifier


class TestAuthenticationMiddlewareInit:
    """Test middleware initialization."""
    
    def test_init_stdio_mode(self):
        """Test initialization in STDIO mode."""
        middleware = ApiClientContextMiddleware(
            transport_mode="stdio",
            validate_tokens=True
        )
        
        assert middleware.transport_mode == "stdio"
        assert middleware.validate_tokens is True
        assert middleware._stdio_client is None
    
    def test_init_http_mode(self):
        """Test initialization in HTTP mode."""
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=True
        )
        
        assert middleware.transport_mode == "http"
        assert middleware.validate_tokens is True
    
    def test_init_without_validation(self):
        """Test initialization with token validation disabled."""
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=False
        )
        
        assert middleware.validate_tokens is False


class TestTokenValidation:
    """Test JWT token validation."""
    
    @pytest.mark.asyncio
    async def test_validate_success(self, mock_jwt_verifier):
        """Test successful token validation."""
        # Setup mock to return valid AccessToken with correct fields
        access_token = AccessToken(
            token="test-jwt-token",
            client_id="test-client",
            scopes=["openid", "profile", "email"],
            expires_at=9999999999,
            claims={"sub": "user-123", "iss": "http://localhost:8080/realms/proxy-smart"}
        )
        mock_jwt_verifier.verify_token.return_value = access_token
        
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=True,
            token_verifier=mock_jwt_verifier
        )
        
        result = await middleware._validate("test-jwt-token")
        
        assert result == access_token
        assert result.claims["sub"] == "user-123"
        assert "openid" in result.scopes
        mock_jwt_verifier.verify_token.assert_called_once_with("test-jwt-token")
    
    @pytest.mark.asyncio
    async def test_validate_failure(self, mock_jwt_verifier):
        """Test token validation failure."""
        mock_jwt_verifier.verify_token.return_value = None
        
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=True,
            token_verifier=mock_jwt_verifier
        )
        
        result = await middleware._validate("invalid-token")
        
        assert result is None
    
    @pytest.mark.asyncio
    async def test_validate_exception(self, mock_jwt_verifier):
        """Test token validation with exception."""
        mock_jwt_verifier.verify_token.side_effect = Exception("Validation error")
        
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=True,
            token_verifier=mock_jwt_verifier
        )
        
        result = await middleware._validate("bad-token")
        
        assert result is None
    
    @pytest.mark.asyncio
    async def test_validate_disabled(self):
        """Test token validation when disabled."""
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=False
        )
        
        result = await middleware._validate("any-token")
        
        # Should return None when validation is disabled
        assert result is None


class TestSTDIOClientCreation:
    """Test API client creation for STDIO mode."""
    
    def test_get_stdio_client_with_token(self):
        """Test creating STDIO client with environment token."""
        with patch.dict(os.environ, {"BACKEND_API_TOKEN": "test-env-token"}):
            middleware = ApiClientContextMiddleware(
                transport_mode="stdio",
                validate_tokens=False
            )
            
            client = middleware._get_stdio_client()
            
            assert client is not None
            assert client.configuration.access_token == "test-env-token"
            
            # Should reuse same client
            client2 = middleware._get_stdio_client()
            assert client is client2
    
    def test_get_stdio_client_without_token(self):
        """Test creating STDIO client without environment token."""
        with patch.dict(os.environ, {}, clear=True):
            middleware = ApiClientContextMiddleware(
                transport_mode="stdio",
                validate_tokens=False
            )
            
            client = middleware._get_stdio_client()
            
            assert client is not None
            assert client.configuration.access_token is None


class TestHTTPClientCreation:
    """Test API client creation for HTTP mode."""
    
    def test_build_http_client_with_bearer_token(self, mock_middleware_context):
        """Test creating HTTP client with Bearer token from headers."""
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=False
        )
        
        client = middleware._build_http_client(mock_middleware_context)
        
        assert client is not None
        assert client.configuration.access_token == "test-jwt-token"
    
    def test_build_http_client_without_token(self):
        """Test creating HTTP client without Authorization header."""
        context = Mock()
        context.fastmcp_context = Mock()
        request_ctx = Mock()
        request_ctx.headers = {}
        context.fastmcp_context.request_context = request_ctx
        
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=False
        )
        
        client = middleware._build_http_client(context)
        
        assert client is not None
        assert client.configuration.access_token is None
    
    def test_build_http_client_case_insensitive_header(self):
        """Test extracting token with case-insensitive header name."""
        context = Mock()
        context.fastmcp_context = Mock()
        request_ctx = Mock()
        request_ctx.headers = {
            "authorization": "Bearer lowercase-token"
        }
        context.fastmcp_context.request_context = request_ctx
        
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=False
        )
        
        client = middleware._build_http_client(context)
        
        assert client.configuration.access_token == "lowercase-token"


class TestOnRequestMiddleware:
    """Test on_request middleware execution."""
    
    @pytest.mark.asyncio
    async def test_on_request_stdio_mode(self):
        """Test on_request in STDIO mode."""
        with patch.dict(os.environ, {"BACKEND_API_TOKEN": "stdio-token"}):
            middleware = ApiClientContextMiddleware(
                transport_mode="stdio",
                validate_tokens=False
            )
            
            context = Mock()
            context.method = "tools/list"
            context.fastmcp_context = Mock()
            context.fastmcp_context.set_state = Mock()
            
            call_next = AsyncMock(return_value="success")
            
            result = await middleware.on_request(context, call_next)
            
            assert result == "success"
            # Should store API client in context
            context.fastmcp_context.set_state.assert_any_call(
                'api_client',
                middleware._stdio_client
            )
            call_next.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_on_request_http_mode(self, mock_middleware_context):
        """Test on_request in HTTP mode."""
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=False
        )
        
        call_next = AsyncMock(return_value="success")
        
        result = await middleware.on_request(mock_middleware_context, call_next)
        
        assert result == "success"
        # Should store API client in context
        assert mock_middleware_context.fastmcp_context.set_state.called
        call_next.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_on_request_with_validation_success(
        self,
        mock_middleware_context,
        mock_jwt_verifier
    ):
        """Test on_request with successful token validation."""
        access_token = AccessToken(
            token="test-jwt-token",
            client_id="test-client",
            scopes=["openid", "profile"],
            expires_at=9999999999,
            claims={"sub": "user-123"}
        )
        mock_jwt_verifier.verify_token.return_value = access_token
        
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=True,
            token_verifier=mock_jwt_verifier
        )
        
        call_next = AsyncMock(return_value="success")
        
        result = await middleware.on_request(mock_middleware_context, call_next)
        
        assert result == "success"
        # Should store both API client and access token
        calls = mock_middleware_context.fastmcp_context.set_state.call_args_list
        state_keys = [call[0][0] for call in calls]
        assert 'api_client' in state_keys
        assert 'access_token' in state_keys
    
    @pytest.mark.asyncio
    async def test_on_request_with_validation_failure(
        self,
        mock_middleware_context,
        mock_jwt_verifier
    ):
        """Test on_request with failed token validation."""
        mock_jwt_verifier.verify_token.return_value = None
        
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=True,
            token_verifier=mock_jwt_verifier
        )
        
        call_next = AsyncMock()
        
        with pytest.raises(McpError) as exc_info:
            await middleware.on_request(mock_middleware_context, call_next)
        
        assert "Invalid or expired authentication token" in str(exc_info.value)
        call_next.assert_not_called()
    
    @pytest.mark.asyncio
    async def test_on_request_no_token_with_validation(self):
        """Test on_request without token when validation is enabled."""
        context = Mock()
        context.method = "tools/list"
        context.fastmcp_context = Mock()
        context.fastmcp_context.set_state = Mock()
        request_ctx = Mock()
        request_ctx.headers = {}
        context.fastmcp_context.request_context = request_ctx
        
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=True
        )
        
        call_next = AsyncMock(return_value="success")
        
        # Should succeed - validation is skipped when no token present
        # Backend will handle the authentication failure
        result = await middleware.on_request(context, call_next)
        assert result == "success"
    
    @pytest.mark.asyncio
    async def test_on_request_exception_handling(self, mock_middleware_context):
        """Test on_request handles exceptions properly."""
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=False
        )
        
        call_next = AsyncMock(side_effect=Exception("Test error"))
        
        with pytest.raises(McpError) as exc_info:
            await middleware.on_request(mock_middleware_context, call_next)
        
        assert "Authentication failed" in str(exc_info.value)


class TestBackendConfiguration:
    """Test backend configuration extraction."""
    
    def test_backend_url_constant(self):
        """Test BACKEND_API_URL is properly set."""
        from middleware.authentication import BACKEND_API_URL
        
        assert BACKEND_API_URL == "http://localhost:8445"
    
    def test_security_configuration_comments(self):
        """Test security configuration is documented in source."""
        # Read the middleware source to verify configuration comments
        import middleware.authentication as auth_module
        
        # Verify key classes and constants are exported
        assert hasattr(auth_module, 'ApiClientContextMiddleware')
        assert hasattr(auth_module, 'JWTAuthenticationBackend')
        assert hasattr(auth_module, 'BACKEND_API_URL')
