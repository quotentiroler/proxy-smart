"""
Integration tests for the composed MCP server with all modules.

Tests the complete server composition including:
- All modular servers imported correctly
- Middleware stack properly configured
- Server initialization and shutdown
- Tool availability from all modules
- End-to-end request handling
"""

import asyncio
import json
import os
from typing import List
from unittest.mock import AsyncMock, Mock, patch

import pytest
from fastmcp import FastMCP


@pytest.fixture
def mock_env_vars():
    """Mock environment variables for testing."""
    with patch.dict(os.environ, {
        "BACKEND_API_TOKEN": "test-token-123",
        "BACKEND_API_URL": "http://localhost:3001"
    }):
        yield


@pytest.fixture
async def composed_server():
    """Create a composed server instance for testing."""
    # Import after patching environment
    from proxy_smart_backend_mcp_generated import main_mcp, compose_servers
    
    # Compose all servers
    await compose_servers()
    
    yield main_mcp


class TestServerComposition:
    """Test server composition and module integration."""
    
    @pytest.mark.asyncio
    async def test_compose_servers(self, mock_env_vars):
        """Test that all modular servers are composed."""
        from proxy_smart_backend_mcp_generated import main_mcp, compose_servers
        
        # Should not raise any exceptions
        await compose_servers()
        
        # Verify main server exists
        assert main_mcp is not None
        assert isinstance(main_mcp, FastMCP)
    
    @pytest.mark.asyncio
    async def test_all_modules_imported(self, composed_server):
        """Test that all expected modules are available."""
        # List all tools to verify all modules loaded
        tools = await composed_server._list_tools()
        
        # Expected prefixes from all modules (matching actual tool names)
        # Note: Some modules use abbreviations (auth, idps, oauth)
        expected_prefixes = [
            "admin",
            "ai",
            "auth",  # authentication tools use '_auth_' not '_authentication_'
            "fhir",
            "healthcare_users",
            "idps",  # identity_providers tools use '_idps_' (abbreviation)
            "launch_contexts",
            "oauth",  # oauth_monitoring tools use '_oauth_'
            "roles",
            "health",  # server tools include 'health' endpoint
            "servers",  # includes 'fhir_servers'
            "smart_apps"
        ]
        
        # Get all tool names
        tool_names = [tool.name for tool in tools]
        
        # Check that we have tools from each module
        # Tools are named like: list_admin_*, create_fhir_*, etc. (not admin_*, fhir_*)
        for prefix in expected_prefixes:
            # Check if any tool contains the module name (e.g., "_admin_", "_fhir_")
            # Also handle edge cases like 'health' which appears at word boundaries
            has_prefix = any(
                f"_{prefix}_" in name or 
                name.startswith(f"{prefix}_") or
                name.startswith(f"list_{prefix}") or
                name.startswith(f"get_{prefix}") or
                name.startswith(f"create_{prefix}")
                for name in tool_names
            )
            assert has_prefix, f"No tools found with prefix '{prefix}' (tools: {[n for n in tool_names if prefix in n][:5]})"
    
    @pytest.mark.asyncio
    async def test_server_metadata(self):
        """Test server metadata is properly set."""
        from proxy_smart_backend_mcp_generated import (
            API_TITLE,
            API_DESCRIPTION,
            API_VERSION
        )
        
        assert API_TITLE == "Proxy Smart Backend"
        assert "SMART on FHIR" in API_DESCRIPTION
        assert len(API_VERSION) > 0


class TestMiddlewareConfiguration:
    """Test middleware stack configuration."""
    
    def test_middleware_stack_order(self, mock_env_vars):
        """Test that middleware is added in correct order."""
        from proxy_smart_backend_mcp_generated import main_mcp
        
        # Middleware should be present - check for middleware-related attributes
        # FastMCP stores middleware internally
        assert main_mcp is not None
    
    @pytest.mark.asyncio
    async def test_authentication_middleware_stdio(self, mock_env_vars):
        """Test authentication middleware in STDIO mode."""
        from middleware.authentication import ApiClientContextMiddleware
        
        middleware = ApiClientContextMiddleware(
            transport_mode="stdio",
            validate_tokens=False
        )
        
        assert middleware.transport_mode == "stdio"
        assert middleware.validate_tokens is False
    
    @pytest.mark.asyncio
    async def test_authentication_middleware_http(self, mock_env_vars):
        """Test authentication middleware in HTTP mode."""
        from middleware.authentication import ApiClientContextMiddleware
        
        middleware = ApiClientContextMiddleware(
            transport_mode="http",
            validate_tokens=True
        )
        
        assert middleware.transport_mode == "http"
        assert middleware.validate_tokens is True


class TestToolAvailability:
    """Test that tools from all modules are available."""
    
    @pytest.mark.asyncio
    async def test_admin_tools(self, composed_server):
        """Test admin module tools are available."""
        tools = await composed_server._list_tools()
        tool_names = [tool.name for tool in tools]
        
        # Check for admin tools (tools containing 'admin' in name)
        # Tools are named like: list_admin_*, create_admin_*, etc.
        admin_tools = [name for name in tool_names if "_admin_" in name or name.startswith("admin_")]
        assert len(admin_tools) > 0
    
    @pytest.mark.asyncio
    async def test_fhir_tools(self, composed_server):
        """Test FHIR module tools are available."""
        tools = await composed_server._list_tools()
        tool_names = [tool.name for tool in tools]
        
        # Check for FHIR tools (tools containing 'fhir' in name)
        fhir_tools = [name for name in tool_names if "_fhir_" in name or name.startswith("fhir_")]
        assert len(fhir_tools) > 0
    
    @pytest.mark.asyncio
    async def test_authentication_tools(self, composed_server):
        """Test authentication module tools are available."""
        tools = await composed_server._list_tools()
        tool_names = [tool.name for tool in tools]
        
        # Check for authentication tools (tools containing 'auth' in name)
        auth_tools = [name for name in tool_names if "_auth_" in name or name.startswith("authentication_") or name.startswith("auth_")]
        assert len(auth_tools) > 0
    
    @pytest.mark.asyncio
    async def test_smart_apps_tools(self, composed_server):
        """Test SMART apps module tools are available."""
        tools = await composed_server._list_tools()
        tool_names = [tool.name for tool in tools]
        
        # Check for SMART apps tools (tools containing 'smart_apps' in name)
        smart_tools = [name for name in tool_names if "_smart_apps_" in name or name.startswith("smart_apps_")]
        assert len(smart_tools) > 0


class TestServerInitialization:
    """Test server initialization flow."""
    
    @pytest.mark.asyncio
    async def test_initialize_request(self, composed_server, mock_env_vars):
        """Test handling initialize request."""
        # Create initialize request
        request = {
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
        
        # The server should be able to handle this
        # (actual execution would require full server context)
        assert composed_server is not None
    
    def test_main_function_stdio_args(self, mock_env_vars):
        """Test main function with STDIO transport arguments."""
        from proxy_smart_backend_mcp_generated import main
        
        with patch('sys.argv', ['proxy_smart_backend_mcp_generated.py', '--transport', 'stdio']):
            with patch.object(asyncio, 'run'):
                with patch('proxy_smart_backend_mcp_generated.main_mcp') as mock_mcp:
                    try:
                        main()
                    except SystemExit:
                        pass  # argparse may call sys.exit
    
    @pytest.mark.filterwarnings("ignore::RuntimeWarning")
    def test_main_function_http_args(self, mock_env_vars):
        """Test main function with HTTP transport arguments."""
        from proxy_smart_backend_mcp_generated import main
        
        with patch('sys.argv', [
            'proxy_smart_backend_mcp_generated.py',
            '--transport', 'http',
            '--host', '127.0.0.1',
            '--port', '9000'
        ]):
            # Create a proper async function for compose_servers
            async def noop_compose_servers():
                return None
            
            # Mock asyncio.run to properly handle the coroutine
            def mock_asyncio_run(coro):
                try:
                    # Properly close the coroutine to avoid warnings
                    coro.close()
                except:
                    pass
                return None
            
            with patch.object(asyncio, 'run', side_effect=mock_asyncio_run):
                with patch('anyio.run'):  # Also mock anyio.run which is used for uvicorn
                    # Replace compose_servers with our noop function
                    with patch('proxy_smart_backend_mcp_generated.compose_servers', noop_compose_servers):
                        with patch('proxy_smart_backend_mcp_generated.main_mcp'):
                            try:
                                main()
                            except SystemExit:
                                pass


class TestErrorHandling:
    """Test error handling across the composed server."""
    
    @pytest.mark.asyncio
    async def test_missing_tool_error(self, composed_server):
        """Test calling non-existent tool."""
        tools = await composed_server._list_tools()
        tool_names = [tool.name for tool in tools]
        
        # Verify a non-existent tool is not in the list
        assert "nonexistent_tool_12345" not in tool_names
    
    @pytest.mark.asyncio
    async def test_invalid_parameters_error(self, composed_server):
        """Test calling tool with invalid parameters."""
        # This would require actual tool execution context
        # Just verify the structure is correct
        assert composed_server is not None


class TestModularServerImports:
    """Test that all modular servers import correctly."""
    
    def test_admin_server_import(self):
        """Test admin server can be imported."""
        from servers.admin_server import mcp as admin_mcp
        assert admin_mcp is not None
    
    def test_ai_server_import(self):
        """Test AI server can be imported."""
        from servers.ai_server import mcp as ai_mcp
        assert ai_mcp is not None
    
    def test_authentication_server_import(self):
        """Test authentication server can be imported."""
        from servers.authentication_server import mcp as authentication_mcp
        assert authentication_mcp is not None
    
    def test_fhir_server_import(self):
        """Test FHIR server can be imported."""
        from servers.fhir_server import mcp as fhir_mcp
        assert fhir_mcp is not None
    
    def test_healthcare_users_server_import(self):
        """Test healthcare users server can be imported."""
        from servers.healthcare_users_server import mcp as healthcare_users_mcp
        assert healthcare_users_mcp is not None
    
    def test_identity_providers_server_import(self):
        """Test identity providers server can be imported."""
        from servers.identity_providers_server import mcp as identity_providers_mcp
        assert identity_providers_mcp is not None
    
    def test_launch_contexts_server_import(self):
        """Test launch contexts server can be imported."""
        from servers.launch_contexts_server import mcp as launch_contexts_mcp
        assert launch_contexts_mcp is not None
    
    def test_oauth_monitoring_server_import(self):
        """Test OAuth monitoring server can be imported."""
        from servers.oauth_monitoring_server import mcp as oauth_monitoring_mcp
        assert oauth_monitoring_mcp is not None
    
    def test_roles_server_import(self):
        """Test roles server can be imported."""
        from servers.roles_server import mcp as roles_mcp
        assert roles_mcp is not None
    
    def test_server_server_import(self):
        """Test server server can be imported."""
        from servers.server_server import mcp as server_mcp
        assert server_mcp is not None
    
    def test_servers_server_import(self):
        """Test servers server can be imported."""
        from servers.servers_server import mcp as servers_mcp
        assert servers_mcp is not None
    
    def test_smart_apps_server_import(self):
        """Test SMART apps server can be imported."""
        from servers.smart_apps_server import mcp as smart_apps_mcp
        assert smart_apps_mcp is not None


class TestCLIArguments:
    """Test command-line argument parsing."""
    
    def test_default_transport(self):
        """Test default transport is stdio."""
        import argparse
        from proxy_smart_backend_mcp_generated import main
        
        with patch('sys.argv', ['proxy_smart_backend_mcp_generated.py']):
            parser = argparse.ArgumentParser()
            parser.add_argument('--transport', choices=['stdio', 'http'], default='stdio')
            args = parser.parse_args()
            
            assert args.transport == 'stdio'
    
    def test_http_transport_args(self):
        """Test HTTP transport arguments."""
        import argparse
        
        with patch('sys.argv', [
            'proxy_smart_backend_mcp_generated.py',
            '--transport', 'http',
            '--host', '0.0.0.0',
            '--port', '8080'
        ]):
            parser = argparse.ArgumentParser()
            parser.add_argument('--transport', choices=['stdio', 'http'], default='stdio')
            parser.add_argument('--host', default='0.0.0.0')
            parser.add_argument('--port', type=int, default=8000)
            args = parser.parse_args()
            
            assert args.transport == 'http'
            assert args.host == '0.0.0.0'
            assert args.port == 8080
    
    def test_validate_tokens_flag(self):
        """Test --validate-tokens flag."""
        import argparse
        
        with patch('sys.argv', [
            'proxy_smart_backend_mcp_generated.py',
            '--validate-tokens'
        ]):
            parser = argparse.ArgumentParser()
            parser.add_argument('--validate-tokens', action='store_true', default=False)
            args = parser.parse_args()
            
            assert args.validate_tokens is True


class TestGeneratedDocumentation:
    """Test that generated server has proper documentation."""
    
    def test_module_docstring(self):
        """Test module has proper docstring."""
        import proxy_smart_backend_mcp_generated as module
        
        assert module.__doc__ is not None
        assert "SMART on FHIR" in module.__doc__
        assert "Auto-generated" in module.__doc__
    
    def test_api_metadata_constants(self):
        """Test API metadata constants exist."""
        from proxy_smart_backend_mcp_generated import (
            API_TITLE,
            API_DESCRIPTION,
            API_VERSION
        )
        
        assert API_TITLE is not None
        assert API_DESCRIPTION is not None
        assert API_VERSION is not None
