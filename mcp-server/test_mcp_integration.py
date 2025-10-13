"""Test script for MCP integration."""

import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_mcp_client():
    """Test the MCP client connection and tool listing."""
    from src.services.backend_mcp_client import get_backend_client
    
    logger.info("Testing MCP client initialization...")
    
    try:
        # Get the client (this will connect automatically)
        client = await get_backend_client()
        logger.info("✅ MCP client connected successfully")
        
        # List available tools
        tools = await client.list_tools()
        logger.info(f"✅ Found {len(tools)} tools:")
        for tool in tools:
            logger.info(f"  - {tool.name}: {tool.description}")
        
        # Try calling a tool (expect auth error)
        logger.info("\nTesting tool call (expect auth error)...")
        try:
            result = await client.call_tool("list_healthcare_users", {})
            logger.info(f"❌ Unexpected success: {result}")
        except Exception as e:
            if "401" in str(e) or "unauthorized" in str(e).lower():
                logger.info(f"✅ Expected auth error: {e}")
            else:
                logger.warning(f"⚠️  Unexpected error: {e}")
        
        # Disconnect
        await client.disconnect()
        logger.info("✅ MCP client disconnected successfully")
        
    except Exception as e:
        logger.error(f"❌ Test failed: {e}", exc_info=True)


async def test_ai_assistant():
    """Test the AI assistant with MCP backend tools."""
    from src.services import ai_assistant
    
    logger.info("\n" + "="*60)
    logger.info("Testing AI assistant with MCP backend tools...")
    logger.info("="*60)
    
    try:
        # Test query that would trigger backend API call
        query = "List all healthcare users"
        
        logger.info(f"\nQuery: {query}")
        logger.info("\nStreaming response:")
        
        full_response = ""
        async for chunk in ai_assistant.chat_stream(query):
            if hasattr(chunk, 'text') and chunk.text:
                print(chunk.text, end='', flush=True)
                full_response += chunk.text
        
        print("\n")
        logger.info(f"\n✅ AI assistant test complete")
        logger.info(f"Response length: {len(full_response)} characters")
        
    except Exception as e:
        logger.error(f"❌ AI assistant test failed: {e}", exc_info=True)


async def main():
    """Run all tests."""
    logger.info("="*60)
    logger.info("MCP Integration Test Suite")
    logger.info("="*60)
    
    # Test 1: MCP client directly
    await test_mcp_client()
    
    # Test 2: AI assistant with MCP backend
    if input("\n\nTest AI assistant? (requires OpenAI API key) [y/N]: ").lower() == 'y':
        await test_ai_assistant()
    else:
        logger.info("Skipping AI assistant test")
    
    logger.info("\n" + "="*60)
    logger.info("All tests complete!")
    logger.info("="*60)


if __name__ == "__main__":
    asyncio.run(main())
