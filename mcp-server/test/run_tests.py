"""
Test runner for Proxy Smart Backend

This script:
1. Starts the MCP server in HTTP mode
2. Waits for it to be ready
3. Runs the generated test suite
4. Cleans up and reports results
"""

import subprocess
import time
import sys
import os
import signal
from pathlib import Path
import httpx

# Ensure UTF-8 encoding for Windows console
if sys.platform == 'win32':
    try:
        # Set console to UTF-8 mode on Windows
        os.system('chcp 65001 > nul 2>&1')
        # Reconfigure stdout/stderr encoding if available (Python 3.7+)
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8')
        if hasattr(sys.stderr, 'reconfigure'):
            sys.stderr.reconfigure(encoding='utf-8')
    except (AttributeError, OSError):
        pass  # Not available or failed, continue anyway


def wait_for_server(url: str, timeout: int = 30) -> bool:
    """Wait for server to be ready."""
    print(f"Waiting for server at {url}...")
    start_time = time.time()

    while time.time() - start_time < timeout:
        try:
            with httpx.Client(timeout=2.0) as client:
                # Try health endpoint first (if it exists)
                try:
                    response = client.get(url.replace('/mcp', '/health'))
                    if response.status_code == 200:
                        print(f"✓ Server ready at {url} (via /health)")
                        return True
                except httpx.HTTPStatusError:
                    pass  # Health endpoint doesn't exist, try MCP endpoint

                # Fallback: Try MCP endpoint with a simple OPTIONS request
                # This checks if the server is listening without making a full request
                try:
                    response = client.options(url, timeout=2.0)
                    if response.status_code in (200, 405):  # 405 = Method Not Allowed is OK
                        print(f"✓ Server ready at {url}")
                        return True
                except httpx.HTTPStatusError:
                    pass  # Server responded but with an error

        except (httpx.ConnectError, httpx.TimeoutException, httpx.RemoteProtocolError):
            time.sleep(0.5)

    return False


def run_tests():
    """Run the MCP server and execute tests."""
    # Paths
    project_root = Path(__file__).parent.parent
    generated_mcp_dir = project_root / "generated_mcp"
    test_dir = project_root / "test"

    # Server configuration
    server_script = generated_mcp_dir / "proxy_smart_backend_mcp_generated.py"
    server_url = os.getenv("MCP_SERVER_URL", "http://localhost:8000/mcp")
    server_port = os.getenv("MCP_SERVER_PORT", "8000")

    if not server_script.exists():
        print(f"❌ Server script not found: {server_script}")
        print(f"   Make sure you've generated the MCP server first.")
        return 1

    if not test_dir.exists():
        print(f"❌ Test directory not found: {test_dir}")
        print(f"   Make sure you've generated the tests first.")
        return 1

    # Check if port is already in use and kill the process
    import socket
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = sock.connect_ex(('localhost', int(server_port)))
        sock.close()
        if result == 0:
            print(f"⚠️  Port {server_port} is already in use. Attempting to free it...")
            if sys.platform == 'win32':
                # On Windows, try to find and kill the process using the port
                try:
                    netstat_result = subprocess.run(['netstat', '-ano'], capture_output=True, text=True)
                    for line in netstat_result.stdout.split('\n'):
                        if f':{server_port}' in line and 'LISTENING' in line:
                            pid = line.split()[-1]
                            subprocess.run(['taskkill', '/F', '/PID', pid], capture_output=True)
                            print(f"   ✓ Killed process {pid} using port {server_port}")
                            time.sleep(1)  # Give it a moment to release
                            break
                except Exception as e:
                    print(f"   ⚠️  Could not automatically free port: {e}")
            else:
                # On Unix-like systems
                try:
                    lsof_result = subprocess.run(['lsof', '-ti', f':{server_port}'], capture_output=True, text=True)
                    if lsof_result.stdout.strip():
                        pid = lsof_result.stdout.strip()
                        subprocess.run(['kill', '-9', pid], capture_output=True)
                        print(f"   ✓ Killed process {pid} using port {server_port}")
                        time.sleep(1)  # Give it a moment to release
                except Exception as e:
                    print(f"   ⚠️  Could not automatically free port: {e}")
    except Exception as e:
        pass  # Port check failed, continue anyway

    # Start server
    print("\n" + "="*60)
    print(f"Starting MCP Server")
    print(f"Server: {server_script.name}")
    print(f"Transport: HTTP, Port: {server_port}")
    print(f"Working directory: {generated_mcp_dir}")
    print("="*60)

    server_env = os.environ.copy()

    # Add any required environment variables
    # For authenticated APIs, you might need:
    # server_env["BACKEND_API_TOKEN"] = "your-token-here"

    # Start the server directly with Python
    # Use PIPE to capture output for debugging when startup fails
    server_process = subprocess.Popen(
        ["uv", "run", "python", server_script.name, "--transport", "http", "--port", str(server_port)],
        cwd=str(generated_mcp_dir),
        env=server_env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        encoding="utf-8",
        errors="replace"
    )

    # Give the process a moment to fail fast if there's an immediate error
    time.sleep(2)  # Increased to account for uv startup time
    if server_process.poll() is not None:
        # Server failed to start - capture and show the output
        stdout, _ = server_process.communicate(timeout=5)
        print(f"❌ Server process exited immediately with code {server_process.returncode}")
        print(f"   Check that the server is properly configured.")
        if stdout:
            print(f"\n📋 Server output:")
            print("   " + "\n   ".join(stdout.strip().split("\n")))
        print(f"\n💡 Try running manually:")
        print(f"   cd {generated_mcp_dir}")
        print(f"   uv run python {server_script.name} --transport http --port {server_port}")
        return 1

    print(f"✓ Server process started (PID: {server_process.pid})")

    # Create a background thread to consume server output to prevent blocking
    # but keep it available for debugging if needed
    import threading
    import queue

    output_queue = queue.Queue()

    def consume_output():
        """Consume server output in background to prevent pipe blocking."""
        try:
            for line in iter(server_process.stdout.readline, ''):
                if line:
                    output_queue.put(line.strip())
            server_process.stdout.close()
        except Exception:
            pass  # Server stopped or closed

    output_thread = threading.Thread(target=consume_output, daemon=True)
    output_thread.start()

    try:
        # Wait for server to be ready
        if not wait_for_server(server_url, timeout=30):
            print(f"❌ Server failed to start within 30 seconds")
            print(f"   Server process status: {'running' if server_process.poll() is None else f'exited with code {server_process.returncode}'}")

            # Show recent server output for debugging
            recent_output = []
            try:
                while not output_queue.empty():
                    recent_output.append(output_queue.get_nowait())
            except:
                pass

            if recent_output:
                print(f"\n📋 Recent server output:")
                for line in recent_output[-10:]:  # Show last 10 lines
                    print(f"   {line}")

            print(f"\n💡 Try running manually:")
            print(f"   cd {generated_mcp_dir}")
            print(f"   uv run python {server_script.name} --transport http --port {server_port}")
            server_process.terminate()
            server_process.wait(timeout=5)
            return 1

        # Run tests
        print("\n" + "="*60)
        print("Running Test Suite")
        print("="*60 + "\n")

        test_env = os.environ.copy()
        test_env["MCP_SERVER_URL"] = server_url

        # Use uv run to execute pytest with the correct environment
        result = subprocess.run(
            ["uv", "run", "pytest", str(test_dir), "-v", "--tb=short"],
            cwd=str(project_root),
            env=test_env
        )

        print("\n" + "="*60)
        if result.returncode == 0:
            print("✓ All tests passed!")
        else:
            print("❌ Some tests failed")
        print("="*60 + "\n")

        return result.returncode

    except KeyboardInterrupt:
        print("\n\n⚠️  Test run interrupted by user")
        return 130

    finally:
        # Cleanup
        print("\nShutting down server...")
        server_process.terminate()

        try:
            server_process.wait(timeout=5)
            print("✓ Server stopped gracefully")
        except subprocess.TimeoutExpired:
            print("⚠️  Server didn't stop gracefully, forcing...")
            server_process.kill()
            server_process.wait()
            print("✓ Server stopped (forced)")


def main():
    """Main entry point."""
    print("""
+--------------------------------------------------------------+
|          MCP Server Test Runner                              |
|          Proxy Smart Backend                                     |
+--------------------------------------------------------------+
""")

    # Check dependencies
    try:
        import pytest
        import httpx
    except ImportError as e:
        print(f"❌ Missing required dependency: {e.name}")
        print("\nInstall test dependencies:")
        print("   pip install pytest httpx")
        return 1

    return run_tests()


if __name__ == "__main__":
    sys.exit(main())
