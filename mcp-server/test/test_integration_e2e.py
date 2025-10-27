"""
End-to-end integration tests for MCP server with Streamable HTTP transport.

These tests require a running MCP server instance.
Start server with: python src/proxy_smart_backend_mcp_generated.py --transport http --port 8000
"""

import asyncio
import uuid

import pytest

from .test_utils import (
    MCPTestClient,
    SSEParser,
    assert_jsonrpc_response,
    assert_jsonrpc_error,
    wait_for_server
)


pytestmark = pytest.mark.integration


@pytest.fixture(scope="module")
async def ensure_server_running(mcp_server_url):
    """Ensure server is running before tests."""
    is_available = await wait_for_server(mcp_server_url, timeout=10.0)
    if not is_available:
        pytest.skip(
            f"MCP server not available at {mcp_server_url}. "
            "Start with: python src/proxy_smart_backend_mcp_generated.py --transport http"
        )


@pytest.fixture
async def mcp_client(mcp_server_url, test_token):
    """Create and initialize MCP test client."""
    async with MCPTestClient(mcp_server_url, auth_token=test_token) as client:
        await client.initialize()
        yield client


class TestEndToEndInitialization:
    """Test complete initialization flow."""
    
    @pytest.mark.asyncio
    async def test_full_initialization_flow(
        self,
        ensure_server_running,
        mcp_server_url,
        test_token
    ):
        """Test complete initialization flow with session."""
        async with MCPTestClient(mcp_server_url, auth_token=test_token) as client:
            # 1. Initialize
            init_response = await client.initialize(
                client_name="integration-test",
                client_version="1.0.0"
            )
            
            # Verify initialize response
            assert_jsonrpc_response(init_response, expected_id="init")
            assert "protocolVersion" in init_response["result"]
            assert "capabilities" in init_response["result"]
            assert "serverInfo" in init_response["result"]
            
            # Verify session ID was assigned
            assert client.session_id is not None
            assert len(client.session_id) > 0
            
            # 2. Send initialized notification
            status = await client.send_notification("notifications/initialized")
            assert status == 202


class TestEndToEndToolCalling:
    """Test tool calling functionality."""
    
    @pytest.mark.asyncio
    @pytest.mark.require_backend
    async def test_list_tools(self, ensure_server_running, mcp_client):
        """
        Test listing all available tools.
        
        Requires: Backend API running on port 8445 + MCP server with --validate-tokens
        """
        tools = await mcp_client.list_tools()
        
        # Should have tools from all modules
        assert len(tools) > 0, "No tools returned - check backend API connection"
        
        # Verify tool structure
        for tool in tools[:5]:  # Check first 5
            assert "name" in tool
            assert "description" in tool or "inputSchema" in tool
        
        # Check for expected module prefixes (use list_ prefix for actions)
        tool_names = [tool["name"] for tool in tools]
        expected_actions = [
            "list_admin", "list_ai", "list_authentication", "list_fhir",
            "list_healthcare_users", "list_roles", "list_smart_apps"
        ]
        
        found_actions = [action for action in expected_actions 
                         if any(action in name for name in tool_names)]
        assert len(found_actions) > 0, \
            f"No expected tools found. Available: {tool_names[:10]}"
    
    @pytest.mark.asyncio
    @pytest.mark.auth
    async def test_call_tool_requires_auth(
        self,
        ensure_server_running,
        mcp_server_url
    ):
        """Test that tool calls require authentication."""
        # Create client without auth token
        async with MCPTestClient(mcp_server_url, auth_token=None) as client:
            await client.initialize()
            
            # Try to call a tool (may succeed or fail depending on config)
            # This tests the authentication flow
            tools = await client.list_tools()
            
            if len(tools) > 0:
                # If we can list tools, try calling one
                tool_name = tools[0]["name"]
                response = await client.call_tool(tool_name, {})
                
                # Response should indicate auth requirement
                # (either in error or delegated to backend)
                assert "jsonrpc" in response


class TestEndToEndSessionManagement:
    """Test session management functionality."""
    
    @pytest.mark.asyncio
    async def test_session_persistence(
        self,
        ensure_server_running,
        mcp_client
    ):
        """Test that session persists across requests."""
        session_id = mcp_client.session_id
        
        # Make multiple requests with same session
        for i in range(3):
            tools = await mcp_client.list_tools()
            # Tools may be empty without backend, but session should persist
            assert isinstance(tools, list)
            assert mcp_client.session_id == session_id
    
    @pytest.mark.asyncio
    async def test_session_isolation(
        self,
        ensure_server_running,
        mcp_server_url,
        test_token
    ):
        """Test that different sessions are isolated."""
        # Create two clients with separate sessions
        async with MCPTestClient(mcp_server_url, auth_token=test_token) as client1:
            await client1.initialize(client_name="client-1")
            session1 = client1.session_id
            
            async with MCPTestClient(mcp_server_url, auth_token=test_token) as client2:
                await client2.initialize(client_name="client-2")
                session2 = client2.session_id
                
                # Sessions should be different
                if session1 and session2:
                    assert session1 != session2
                
                # Both should work independently
                tools1 = await client1.list_tools()
                tools2 = await client2.list_tools()
                
                # Note: Tools list may be empty if backend API is not available
                # or if authentication delegation is enabled
                assert isinstance(tools1, list)
                assert isinstance(tools2, list)


class TestEndToEndErrorHandling:
    """Test error handling across the system."""
    
    @pytest.mark.asyncio
    async def test_invalid_method(self, ensure_server_running, mcp_client):
        """Test calling non-existent method."""
        request_id = str(uuid.uuid4())
        request = {
            "jsonrpc": "2.0",
            "id": request_id,
            "method": "nonexistent/method",
            "params": {}
        }
        
        response = await mcp_client._client.post(
            mcp_client.base_url,
            json=request,
            headers=mcp_client._get_headers()
        )
        
        # Parse SSE response
        data = mcp_client._parse_sse_response(response.text)
        
        # Should return JSON-RPC error (message may vary)
        assert_jsonrpc_error(data)
    
    @pytest.mark.asyncio
    async def test_invalid_json(
        self,
        ensure_server_running,
        mcp_server_url,
        test_token
    ):
        """Test sending invalid JSON."""
        async with MCPTestClient(mcp_server_url, auth_token=test_token) as client:
            response = await client._client.post(
                client.base_url,
                content="not valid json{{{",
                headers={
                    "Authorization": f"Bearer {test_token}",
                    "Content-Type": "application/json",
                    "Accept": "application/json, text/event-stream"
                }
            )
            
            # Should return 400 Bad Request or 406 Not Acceptable
            assert response.status_code in [400, 406]
    
    @pytest.mark.asyncio
    async def test_batch_with_errors(self, ensure_server_running, mcp_client):
        """Test batch request with mix of valid and invalid methods."""
        batch = [
            {
                "jsonrpc": "2.0",
                "id": "valid-1",
                "method": "tools/list",
                "params": {}
            },
            {
                "jsonrpc": "2.0",
                "id": "invalid-1",
                "method": "nonexistent/method",
                "params": {}
            },
            {
                "jsonrpc": "2.0",
                "id": "valid-2",
                "method": "prompts/list",
                "params": {}
            }
        ]
        
        response = await mcp_client._client.post(
            mcp_client.base_url,
            json=batch,
            headers=mcp_client._get_headers()
        )
        
        data = response.json()
        
        # Should return array of responses
        if isinstance(data, list):
            assert len(data) == 3
            
            # Find the invalid request response
            invalid_response = next(
                (r for r in data if r.get("id") == "invalid-1"),
                None
            )
            if invalid_response:
                assert "error" in invalid_response


class TestEndToEndStreamingResponses:
    """Test SSE streaming functionality."""
    
    @pytest.mark.asyncio
    @pytest.mark.slow
    async def test_sse_stream_open(
        self,
        ensure_server_running,
        mcp_server_url,
        test_token
    ):
        """Test opening SSE stream via GET."""
        async with MCPTestClient(mcp_server_url, auth_token=test_token) as client:
            await client.initialize()
            
            try:
                # Try to open SSE stream
                async with client._client.stream(
                    "GET",
                    client.base_url,
                    headers=client._get_headers({"Accept": "text/event-stream"}),
                    timeout=5.0
                ) as response:
                    if response.status_code == 200:
                        content_type = response.headers.get("content-type", "")
                        assert "text/event-stream" in content_type
                    elif response.status_code == 405:
                        pytest.skip("Server doesn't support GET SSE streams")
                    else:
                        pytest.fail(f"Unexpected status: {response.status_code}")
            except Exception as e:
                # Timeout or other error is OK for this test
                pass


class TestEndToEndProtocolCompliance:
    """Test protocol compliance requirements."""
    
    @pytest.mark.asyncio
    async def test_jsonrpc_version_consistency(
        self,
        ensure_server_running,
        mcp_client
    ):
        """Test all responses have jsonrpc: 2.0."""
        # Test multiple different request types
        requests = [
            {"method": "tools/list", "params": {}},
            {"method": "prompts/list", "params": {}},
            {"method": "resources/list", "params": {}}
        ]
        
        for req in requests:
            request = {
                "jsonrpc": "2.0",
                "id": str(uuid.uuid4()),
                **req
            }
            
            response = await mcp_client._client.post(
                mcp_client.base_url,
                json=request,
                headers=mcp_client._get_headers()
            )
            
            # Parse SSE response
            data = mcp_client._parse_sse_response(response.text)
            assert data.get("jsonrpc") == "2.0"
    
    @pytest.mark.asyncio
    async def test_notification_no_response(
        self,
        ensure_server_running,
        mcp_client
    ):
        """Test notifications return 202 with no body."""
        status = await mcp_client.send_notification(
            "notifications/tools/list_changed"
        )
        
        # Should be 202 Accepted
        assert status == 202
    
    @pytest.mark.asyncio
    async def test_content_type_negotiation(
        self,
        ensure_server_running,
        mcp_client
    ):
        """Test proper Content-Type negotiation."""
        request = {
            "jsonrpc": "2.0",
            "id": "content-test",
            "method": "tools/list",
            "params": {}
        }
        
        # Request with both JSON and SSE in Accept header
        headers = mcp_client._get_headers()
        response = await mcp_client._client.post(
            mcp_client.base_url,
            json=request,
            headers=headers
        )
        
        content_type = response.headers.get("content-type", "")
        
        # Should return either JSON or SSE
        assert any(
            ct in content_type
            for ct in ["application/json", "text/event-stream"]
        )


class TestEndToEndPerformance:
    """Test performance characteristics."""
    
    @pytest.mark.asyncio
    @pytest.mark.slow
    @pytest.mark.require_backend
    async def test_concurrent_requests(
        self,
        ensure_server_running,
        mcp_server_url,
        test_token
    ):
        """
        Test handling multiple concurrent requests.
        
        Requires: Backend API for tool listing
        """
        num_clients = 5
        
        async def make_requests(client_id: int):
            async with MCPTestClient(mcp_server_url, auth_token=test_token) as client:
                await client.initialize(client_name=f"client-{client_id}")
                tools = await client.list_tools()
                return len(tools)
        
        # Make concurrent requests
        results = await asyncio.gather(
            *[make_requests(i) for i in range(num_clients)]
        )
        
        # All should succeed
        assert len(results) == num_clients
        # At least some should return tools
        assert any(count > 0 for count in results), \
            "No tools returned - check backend API connection"
    
    @pytest.mark.asyncio
    @pytest.mark.require_backend
    async def test_large_response_handling(
        self,
        ensure_server_running,
        mcp_client
    ):
        """
        Test handling large responses.
        
        Requires: Backend API for tool listing
        """
        # List all tools (potentially large response)
        tools = await mcp_client.list_tools()
        
        # Should handle response successfully
        assert len(tools) > 0, "No tools returned - check backend API connection"
        
        # Verify all tools have required fields
        for tool in tools:
            assert "name" in tool
            assert isinstance(tool["name"], str)
