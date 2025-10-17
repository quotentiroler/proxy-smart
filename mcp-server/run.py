"""
Simple runner script for the MCP server.
"""
import sys
from pathlib import Path

# Add src to path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

if __name__ == "__main__":
    import uvicorn
    from config import settings
    
    uvicorn.run(
        "main:app",
        host=settings.mcp_server_host,
        port=settings.mcp_server_port,
        reload=True,
        reload_dirs=[str(src_path)],
        log_level=settings.log_level.lower(),
    )
