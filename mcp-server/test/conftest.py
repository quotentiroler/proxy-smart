"""
Test configuration and fixtures for MCP server tests.
"""

import os
import sys
from pathlib import Path

import pytest

# Add src directory to Python path
src_path = Path(__file__).parent.parent / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

# Add generated_mcp directory to Python path (new location after refactoring)
generated_mcp_path = Path(__file__).parent.parent / "generated_mcp"
if str(generated_mcp_path) not in sys.path:
    sys.path.insert(0, str(generated_mcp_path))


@pytest.fixture(scope="session")
def backend_api_url():
    """Backend API base URL."""
    return os.getenv("BACKEND_API_URL", "http://localhost:3001")


@pytest.fixture(scope="session")
def mcp_server_url():
    """MCP server endpoint URL."""
    return os.getenv("MCP_SERVER_URL", "http://localhost:8000/mcp")


@pytest.fixture(scope="session")
def test_token():
    """Test authentication token."""
    return os.getenv("BACKEND_API_TOKEN", "test-token")


@pytest.fixture
def mock_access_token():
    """Create a mock AccessToken for testing."""
    from fastmcp.server.auth import AccessToken
    
    return AccessToken(
        token="test-token",
        client_id="test-client",
        scopes=["openid", "profile", "email"],
        expires_at=9999999999,
        claims={
            "sub": "test-user-123",
            "aud": "http://localhost:8445/mcp",
            "iss": "http://localhost:8080/realms/proxy-smart",
            "iat": 1000000000
        }
    )


@pytest.fixture
def sample_jsonrpc_request():
    """Sample JSON-RPC 2.0 request."""
    return {
        "jsonrpc": "2.0",
        "id": "test-request-1",
        "method": "tools/list",
        "params": {}
    }


@pytest.fixture
def sample_initialize_request():
    """Sample MCP initialize request."""
    return {
        "jsonrpc": "2.0",
        "id": "init-1",
        "method": "initialize",
        "params": {
            "protocolVersion": "2025-03-26",
            "capabilities": {
                "roots": {"listChanged": True}
            },
            "clientInfo": {
                "name": "test-client",
                "version": "1.0.0"
            }
        }
    }


@pytest.fixture
def sample_notification():
    """Sample JSON-RPC notification (no id field)."""
    return {
        "jsonrpc": "2.0",
        "method": "notifications/initialized"
    }


# Configure pytest-asyncio
pytest_plugins = ['pytest_asyncio']


def pytest_configure(config):
    """Configure pytest with custom markers."""
    config.addinivalue_line(
        "markers",
        "integration: marks tests as integration tests (require running server)"
    )
    config.addinivalue_line(
        "markers",
        "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers",
        "auth: marks tests that require authentication"
    )
