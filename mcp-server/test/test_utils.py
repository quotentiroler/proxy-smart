"""
Test utilities and helper functions.
"""

import asyncio
import json
from typing import Any, AsyncIterator, Dict, List, Optional

import httpx


class MCPTestClient:
    """Test client for MCP server with Streamable HTTP transport."""
    
    def __init__(
        self,
        base_url: str,
        auth_token: Optional[str] = None,
        timeout: float = 30.0
    ):
        """
        Initialize MCP test client.
        
        Args:
            base_url: MCP server endpoint URL
            auth_token: Optional Bearer authentication token
            timeout: Request timeout in seconds
        """
        self.base_url = base_url
        self.auth_token = auth_token
        self.timeout = timeout
        self.session_id: Optional[str] = None
        self._client = httpx.AsyncClient(timeout=timeout)
    
    async def __aenter__(self):
        """Async context manager entry."""
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()
    
    async def close(self):
        """Close the HTTP client."""
        await self._client.aclose()
    
    def _get_headers(self, extra_headers: Optional[Dict[str, str]] = None) -> Dict[str, str]:
        """Build request headers."""
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream"
        }
        
        if self.auth_token:
            headers["Authorization"] = f"Bearer {self.auth_token}"
        
        if self.session_id:
            headers["Mcp-Session-Id"] = self.session_id
        
        if extra_headers:
            headers.update(extra_headers)
        
        return headers
    
    def _parse_sse_response(self, sse_text: str) -> Dict[str, Any]:
        """Parse SSE formatted response and extract JSON data.
        
        SSE format is:
        event: message
        data: {"jsonrpc":"2.0",...}
        
        """
        import json
        lines = sse_text.strip().split('\n')
        for line in lines:
            if line.startswith('data: '):
                json_str = line[6:]  # Remove 'data: ' prefix
                return json.loads(json_str)
        # If no data line found, try parsing as plain JSON
        return json.loads(sse_text)
    
    async def initialize(
        self,
        client_name: str = "test-client",
        client_version: str = "1.0.0"
    ) -> Dict[str, Any]:
        """
        Send initialize request and store session ID.
        
        Args:
            client_name: Client name for initialization
            client_version: Client version
            
        Returns:
            Initialize response data
        """
        request = {
            "jsonrpc": "2.0",
            "id": "init",
            "method": "initialize",
            "params": {
                "protocolVersion": "2025-03-26",
                "capabilities": {},
                "clientInfo": {
                    "name": client_name,
                    "version": client_version
                }
            }
        }
        
        response = await self._client.post(
            self.base_url,
            json=request,
            headers=self._get_headers()
        )
        
        # Store session ID if provided
        session_id = response.headers.get("Mcp-Session-Id")
        if session_id:
            self.session_id = session_id
        
        # Parse SSE response (Streamable HTTP returns SSE format)
        result = self._parse_sse_response(response.text)
        
        # Send initialized notification to complete the handshake
        await self.send_notification("notifications/initialized")
        
        return result
    
    async def send_notification(
        self,
        method: str,
        params: Optional[Dict[str, Any]] = None
    ) -> int:
        """
        Send JSON-RPC notification (no response expected).
        
        Args:
            method: Notification method name
            params: Optional notification parameters
            
        Returns:
            HTTP status code (should be 202)
        """
        notification = {
            "jsonrpc": "2.0",
            "method": method
        }
        
        if params is not None:
            notification["params"] = params
        
        response = await self._client.post(
            self.base_url,
            json=notification,
            headers=self._get_headers()
        )
        
        return response.status_code
    
    async def call_tool(
        self,
        tool_name: str,
        arguments: Optional[Dict[str, Any]] = None,
        request_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Call an MCP tool.
        
        Args:
            tool_name: Name of the tool to call
            arguments: Optional tool arguments
            request_id: Optional request ID (generated if not provided)
            
        Returns:
            Tool response data
        """
        if request_id is None:
            request_id = f"tool-{tool_name}"
        
        request = {
            "jsonrpc": "2.0",
            "id": request_id,
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments or {}
            }
        }
        
        response = await self._client.post(
            self.base_url,
            json=request,
            headers=self._get_headers()
        )
        
        return self._parse_sse_response(response.text)
    
    async def list_tools(self) -> List[Dict[str, Any]]:
        """
        List available tools.
        
        Returns:
            List of tool definitions
        """
        request = {
            "jsonrpc": "2.0",
            "id": "list-tools",
            "method": "tools/list",
            "params": {}
        }
        
        response = await self._client.post(
            self.base_url,
            json=request,
            headers=self._get_headers()
        )
        
        data = self._parse_sse_response(response.text)
        # Handle different response structures
        if "result" in data:
            result = data["result"]
            # Check if tools is directly in result or nested
            if isinstance(result, dict):
                return result.get("tools", [])
            elif isinstance(result, list):
                return result
        return []
    
    async def open_sse_stream(
        self,
        last_event_id: Optional[str] = None
    ) -> httpx.Response:
        """
        Open an SSE stream via HTTP GET.
        
        Args:
            last_event_id: Optional Last-Event-ID for resuming stream
            
        Returns:
            Streaming response
        """
        headers = self._get_headers({
            "Accept": "text/event-stream"
        })
        
        if last_event_id:
            headers["Last-Event-ID"] = last_event_id
        
        return await self._client.get(
            self.base_url,
            headers=headers
        ).__aenter__()
    
    async def delete_session(self) -> int:
        """
        Terminate the current session.
        
        Returns:
            HTTP status code
        """
        if not self.session_id:
            raise ValueError("No active session")
        
        response = await self._client.delete(
            self.base_url,
            headers=self._get_headers()
        )
        
        return response.status_code


class SSEParser:
    """Parser for Server-Sent Events streams."""
    
    @staticmethod
    async def parse_stream(response: httpx.Response) -> AsyncIterator[Dict[str, Any]]:
        """
        Parse SSE events from response stream.
        
        Args:
            response: HTTP response with SSE stream
            
        Yields:
            Parsed SSE events with id, event, and data fields
        """
        event_id: Optional[str] = None
        event_type: str = "message"
        data_lines: List[str] = []
        
        async for line in response.aiter_lines():
            # Empty line marks end of event
            if not line.strip():
                if data_lines:
                    data = "\n".join(data_lines)
                    yield {
                        "id": event_id,
                        "event": event_type,
                        "data": data,
                        "parsed_data": SSEParser._try_parse_json(data)
                    }
                    # Reset for next event
                    event_id = None
                    event_type = "message"
                    data_lines = []
                continue
            
            # Parse SSE field
            if line.startswith("id:"):
                event_id = line[3:].strip()
            elif line.startswith("event:"):
                event_type = line[6:].strip()
            elif line.startswith("data:"):
                data_lines.append(line[5:].strip())
            elif line.startswith(":"):
                # Comment, ignore
                pass
    
    @staticmethod
    def _try_parse_json(data: str) -> Optional[Any]:
        """Try to parse data as JSON."""
        try:
            return json.loads(data)
        except (json.JSONDecodeError, ValueError):
            return None


def assert_jsonrpc_response(
    response: Dict[str, Any],
    expected_id: Optional[str] = None,
    has_result: bool = True,
    has_error: bool = False
):
    """
    Assert that response is valid JSON-RPC 2.0 response.
    
    Args:
        response: Response data to validate
        expected_id: Expected request ID
        has_result: Whether response should have result field
        has_error: Whether response should have error field
    """
    assert "jsonrpc" in response
    assert response["jsonrpc"] == "2.0"
    assert "id" in response
    
    if expected_id is not None:
        assert response["id"] == expected_id
    
    if has_result:
        assert "result" in response
        assert "error" not in response
    
    if has_error:
        assert "error" in response
        assert "result" not in response
        assert "code" in response["error"]
        assert "message" in response["error"]


def assert_jsonrpc_error(
    response: Dict[str, Any],
    expected_code: Optional[int] = None,
    message_contains: Optional[str] = None
):
    """
    Assert that response is valid JSON-RPC error.
    
    Args:
        response: Response data to validate
        expected_code: Expected error code
        message_contains: Substring that should be in error message
    """
    assert_jsonrpc_response(response, has_result=False, has_error=True)
    
    if expected_code is not None:
        assert response["error"]["code"] == expected_code
    
    if message_contains is not None:
        assert message_contains in response["error"]["message"]


async def wait_for_server(
    url: str,
    timeout: float = 30.0,
    interval: float = 1.0
) -> bool:
    """
    Wait for server to become available.
    
    Args:
        url: Server URL to check
        timeout: Maximum time to wait in seconds
        interval: Polling interval in seconds
        
    Returns:
        True if server is available, False if timeout
    """
    start_time = asyncio.get_event_loop().time()
    
    async with httpx.AsyncClient() as client:
        while asyncio.get_event_loop().time() - start_time < timeout:
            try:
                response = await client.get(url, timeout=5.0)
                if response.status_code < 500:
                    return True
            except (httpx.ConnectError, httpx.TimeoutException):
                pass
            
            await asyncio.sleep(interval)
    
    return False
