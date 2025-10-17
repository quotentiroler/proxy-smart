"""
Test Claude Desktop integration with the MCP backend server.
Run this to verify your setup works before configuring Claude Desktop.
"""
import asyncio
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / 'src'))

from backend_mcp_server import mcp

async def test_mcp_tools():
    """Test that MCP server tools are properly defined"""
    print("🔍 Testing MCP Server Configuration...")
    print()
    
    # Get all registered tools
    tools = list(mcp.list_tools())
    
    print(f"✅ Found {len(tools)} tools:")
    for tool in tools:
        print(f"  - {tool.name}: {tool.description}")
    
    print()
    print("📋 Expected tools:")
    expected = [
        "list_healthcare_users",
        "get_healthcare_user", 
        "create_healthcare_user",
        "list_smart_apps",
        "list_fhir_servers",
        "list_roles"
    ]
    
    tool_names = [t.name for t in tools]
    for exp in expected:
        status = "✓" if exp in tool_names else "✗"
        print(f"  {status} {exp}")
    
    print()
    if len(tools) == len(expected):
        print("✅ All tools registered correctly!")
        print()
        print("Next steps:")
        print("1. Make sure backend is running: cd backend && npm run dev")
        print("2. Configure Claude Desktop with the config from README")
        print("3. Restart Claude Desktop")
        print("4. Ask Claude to 'list healthcare users' to test")
    else:
        print("⚠️  Tool count mismatch!")

if __name__ == "__main__":
    asyncio.run(test_mcp_tools())
