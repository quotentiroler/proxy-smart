"""
Quick test script for function calling.
Run with: cd mcp-server && python test_function_calling.py
"""

import asyncio
import httpx

async def test_function_calling():
    """Test the AI assistant with function calling."""
    
    url = "http://localhost:8081/v1/chat/stream"
    
    # Test query that should trigger create_healthcare_user function
    query = "Add a new user named Jane Doe with email jane.doe@example.com"
    
    print(f"Testing query: {query}\n")
    print("=" * 80)
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        async with client.stream(
            "POST",
            url,
            json={"message": query}
        ) as response:
            print(f"Response status: {response.status_code}\n")
            
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data = line[6:]  # Remove "data: " prefix
                    print(data)
    
    print("\n" + "=" * 80)
    print("Test complete!")

if __name__ == "__main__":
    asyncio.run(test_function_calling())
