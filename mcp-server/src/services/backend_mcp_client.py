"""
MCP Client for connecting to backend tools server.

This client connects to the FastMCP backend server and provides
a simple interface for the AI assistant to call backend tools.
"""

import asyncio
import json
import logging
from contextlib import asynccontextmanager
from typing import Any, AsyncIterator

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from mcp.types import CallToolResult, TextContent

from config import settings

logger = logging.getLogger(__name__)


class BackendMCPClient:
    """MCP client for backend API tools."""

    def __init__(self):
        """Initialize the MCP client."""
        self.session: ClientSession | None = None
        self._read_stream = None
        self._write_stream = None
        self._client_manager = None

    async def connect(self) -> None:
        """Connect to the backend MCP server."""
        if self.session is not None:
            logger.warning("Already connected to backend MCP server")
            return

        try:
            # Configure server parameters for stdio connection
            server_params = StdioServerParameters(
                command="uv",
                args=["run", "python", "src/backend_mcp_server.py"],
                env={
                    "BACKEND_API_URL": settings.backend_api_url,
                    "BACKEND_API_TOKEN": settings.backend_api_token,
                },
            )

            logger.info("Connecting to backend MCP server...")
            
            # Create stdio client
            self._client_manager = stdio_client(server_params)
            self._read_stream, self._write_stream = await self._client_manager.__aenter__()
            
            # Create session
            self.session = ClientSession(self._read_stream, self._write_stream)
            await self.session.__aenter__()
            
            # Initialize the connection
            await self.session.initialize()
            
            logger.info("Successfully connected to backend MCP server")
            
            # List available tools for debugging
            tools = await self.session.list_tools()
            logger.info(f"Available backend tools: {[t.name for t in tools.tools]}")
            
        except Exception as e:
            logger.error(f"Failed to connect to backend MCP server: {e}", exc_info=True)
            await self.disconnect()
            raise

    async def disconnect(self) -> None:
        """Disconnect from the backend MCP server."""
        if self.session is not None:
            try:
                await self.session.__aexit__(None, None, None)
            except Exception as e:
                logger.error(f"Error closing session: {e}")
            self.session = None

        if self._client_manager is not None:
            try:
                await self._client_manager.__aexit__(None, None, None)
            except Exception as e:
                logger.error(f"Error closing client manager: {e}")
            self._client_manager = None

        self._read_stream = None
        self._write_stream = None
        logger.info("Disconnected from backend MCP server")

    async def call_tool(self, tool_name: str, arguments: dict[str, Any]) -> dict[str, Any]:
        """
        Call a backend tool via MCP.

        Args:
            tool_name: Name of the tool to call
            arguments: Tool arguments

        Returns:
            Tool result as a dictionary

        Raises:
            RuntimeError: If not connected to server
            Exception: If tool call fails
        """
        if self.session is None:
            raise RuntimeError("Not connected to backend MCP server. Call connect() first.")

        try:
            logger.info(f"Calling backend tool: {tool_name} with args: {arguments}")
            
            result: CallToolResult = await self.session.call_tool(tool_name, arguments=arguments)
            
            # Parse the result
            if result.isError:
                logger.error(f"Tool {tool_name} returned an error")
                error_text = "Unknown error"
                for content in result.content:
                    if isinstance(content, TextContent):
                        error_text = content.text
                        break
                return {"error": error_text, "tool": tool_name}
            
            # Extract structured content if available
            if hasattr(result, "structuredContent") and result.structuredContent:
                logger.info(f"Tool {tool_name} returned structured content")
                return result.structuredContent
            
            # Fall back to text content
            for content in result.content:
                if isinstance(content, TextContent):
                    try:
                        # Try to parse as JSON
                        return json.loads(content.text)
                    except json.JSONDecodeError:
                        # Return as text
                        return {"result": content.text}
            
            logger.warning(f"Tool {tool_name} returned unexpected content format")
            return {"result": str(result.content)}
            
        except Exception as e:
            logger.error(f"Error calling tool {tool_name}: {e}", exc_info=True)
            return {"error": str(e), "tool": tool_name}

    async def list_tools(self) -> list[dict[str, Any]]:
        """
        List available backend tools.

        Returns:
            List of tool definitions
        """
        if self.session is None:
            raise RuntimeError("Not connected to backend MCP server")

        tools_response = await self.session.list_tools()
        return [
            {
                "name": tool.name,
                "description": tool.description,
                "inputSchema": tool.inputSchema,
            }
            for tool in tools_response.tools
        ]

    @asynccontextmanager
    async def connection(self) -> AsyncIterator["BackendMCPClient"]:
        """
        Context manager for backend MCP client connection.

        Usage:
            async with client.connection() as mcp:
                result = await mcp.call_tool("list_users", {})
        """
        await self.connect()
        try:
            yield self
        finally:
            await self.disconnect()


# Global client instance (lazy initialization)
_backend_client: BackendMCPClient | None = None
_client_lock = asyncio.Lock()


async def get_backend_client() -> BackendMCPClient:
    """
    Get or create the global backend MCP client.

    Returns:
        Connected BackendMCPClient instance
    """
    global _backend_client
    
    async with _client_lock:
        if _backend_client is None:
            _backend_client = BackendMCPClient()
            await _backend_client.connect()
        elif _backend_client.session is None:
            # Reconnect if disconnected
            await _backend_client.connect()
    
    return _backend_client


async def close_backend_client() -> None:
    """Close the global backend MCP client."""
    global _backend_client
    
    async with _client_lock:
        if _backend_client is not None:
            await _backend_client.disconnect()
            _backend_client = None
