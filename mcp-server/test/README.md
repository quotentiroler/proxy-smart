# MCP Server Test Suite

Comprehensive test suite for the generated MCP server with Streamable HTTP transport support.

## Overview

This test suite validates the complete MCP server implementation including:

- **Streamable HTTP Transport** (MCP Protocol 2025-03-26)
- **Authentication Middleware** (JWT validation with OAuth2)
- **Server Composition** (12 modular servers)
- **Protocol Compliance** (JSON-RPC 2.0, SSE streaming)

## Test Files

### `test_streamable_http_transport.py`

Tests the Streamable HTTP transport implementation according to MCP Protocol 2025-03-26:

- **Basic HTTP Operations**
  - POST requests for client messages
  - GET requests for SSE streams
  - Proper Content-Type negotiation
  - Accept header handling

- **Session Management**
  - `Mcp-Session-Id` header lifecycle
  - Session creation and termination
  - Invalid session handling
  - Multiple concurrent sessions

- **SSE Streaming**
  - Server-Sent Events parsing
  - Event ID tracking
  - Stream resumability with `Last-Event-ID`
  - Multiple concurrent streams

- **JSON-RPC Compliance**
  - Request/response handling
  - Notification handling (202 Accepted)
  - Batch requests
  - Error responses

- **Authentication**
  - Bearer token authentication
  - Token validation
  - Missing token handling

### `test_authentication_middleware.py`

Tests the `SMARTAuthenticationMiddleware` implementation:

- **Middleware Initialization**
  - STDIO mode configuration
  - HTTP mode configuration
  - Token validation enable/disable

- **Token Validation**
  - JWT verification with JWTVerifier
  - Access token claims extraction
  - Token expiration handling
  - Validation error handling

- **Client Creation**
  - STDIO client with environment token
  - HTTP client with Bearer token
  - Client reuse patterns
  - Token extraction from headers

- **Request Handling**
  - Context state management
  - API client injection
  - Token validation flow
  - Error propagation

### `test_server_composition.py`

Tests the complete server composition and integration:

- **Server Composition**
  - All 12 modules imported
  - Tool availability from each module
  - Server metadata configuration

- **Middleware Stack**
  - Middleware order verification
  - Error handling middleware
  - Authentication middleware
  - Timing and logging middleware

- **CLI Arguments**
  - Transport mode selection
  - Host and port configuration
  - Token validation flags

- **Module Imports**
  - Individual server imports
  - Module initialization
  - No import errors

## Running Tests

### Prerequisites

```bash
# Install dependencies
cd mcp-server
uv sync --dev

# Set environment variables
export BACKEND_API_TOKEN="your-test-token"
export MCP_SERVER_URL="http://localhost:8000"
```

### Run All Tests

```bash
# Run all tests
pytest test/

# Run with coverage
pytest test/ --cov=src --cov-report=html

# Run with verbose output
pytest test/ -v
```

### Run Specific Test Files

```bash
# Test Streamable HTTP transport
pytest test/test_streamable_http_transport.py -v

# Test authentication middleware
pytest test/test_authentication_middleware.py -v

# Test server composition
pytest test/test_server_composition.py -v
```

### Run Specific Test Classes

```bash
# Test basic HTTP operations
pytest test/test_streamable_http_transport.py::TestStreamableHTTPBasics -v

# Test SSE streaming
pytest test/test_streamable_http_transport.py::TestSSEStreaming -v

# Test session management
pytest test/test_streamable_http_transport.py::TestSessionManagement -v
```

### Run with Server

For integration tests that require a running server:

```bash
# Terminal 1: Start the MCP server
cd mcp-server
python src/proxy_smart_backend_mcp_generated.py --transport http --port 8000

# Terminal 2: Run tests
pytest test/test_streamable_http_transport.py -v
```

## Test Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BACKEND_API_TOKEN` | Authentication token for testing | `test-token` |
| `MCP_SERVER_URL` | MCP server endpoint URL | `http://localhost:8000` |
| `BACKEND_API_URL` | Backend API base URL | `http://localhost:3001` |

## Protocol Compliance Testing

The test suite validates compliance with:

### MCP Protocol 2025-03-26 - Streamable HTTP Transport

- ✅ HTTP POST for client messages
- ✅ HTTP GET for SSE streams
- ✅ `Accept` header negotiation
- ✅ `Content-Type` responses (JSON/SSE)
- ✅ `Mcp-Session-Id` header handling
- ✅ `Last-Event-ID` for resumability
- ✅ HTTP 202 for notifications
- ✅ HTTP 404 for invalid sessions
- ✅ HTTP 405 for unsupported methods

### JSON-RPC 2.0 Specification

- ✅ Request format validation
- ✅ Response format validation
- ✅ Notification handling (no id field)
- ✅ Batch request support
- ✅ Error response format
- ✅ UTF-8 encoding

### OAuth2 / JWT Authentication

- ✅ Bearer token extraction
- ✅ JWT signature validation
- ✅ Token expiration checking
- ✅ Scope validation
- ✅ Issuer and audience validation
- ✅ JWKS endpoint fetching

## Test Coverage

Target coverage: **>90%**

Key areas covered:
- Transport layer (HTTP, SSE, session management)
- Authentication middleware (JWT validation, client creation)
- Server composition (module imports, tool availability)
- Error handling (invalid requests, authentication failures)
- Protocol compliance (JSON-RPC, MCP specification)

## CI/CD Integration

### GitHub Actions Example

```yaml
name: MCP Server Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      backend:
        image: backend-api:latest
        ports:
          - 3001:3001
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install uv
        run: pip install uv
      
      - name: Install dependencies
        run: |
          cd mcp-server
          uv sync --dev
      
      - name: Start MCP server
        run: |
          cd mcp-server
          uv run python src/proxy_smart_backend_mcp_generated.py --transport http --port 8000 &
          sleep 5
        env:
          BACKEND_API_TOKEN: ${{ secrets.TEST_TOKEN }}
      
      - name: Run tests
        run: |
          cd mcp-server
          uv run pytest test/ -v --cov=src --cov-report=xml
        env:
          BACKEND_API_TOKEN: ${{ secrets.TEST_TOKEN }}
          MCP_SERVER_URL: http://localhost:8000
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./mcp-server/coverage.xml
```

## Troubleshooting

### Tests Fail with Connection Errors

```bash
# Ensure server is running
curl http://localhost:8000

# Check server logs
tail -f logs/mcp-server.log

# Verify environment variables
echo $BACKEND_API_TOKEN
echo $MCP_SERVER_URL
```

### Token Validation Failures

```bash
# Test JWT verification
python -c "
from fastmcp.server.auth import JWTVerifier
verifier = JWTVerifier(
    jwks_uri='http://localhost:3001/.well-known/jwks.json',
    issuer='http://localhost:8080',
    audience='backend-api'
)
import asyncio
token = 'your-token-here'
asyncio.run(verifier.verify_token(token))
"
```

### SSE Streaming Issues

```bash
# Test SSE endpoint manually
curl -N -H "Accept: text/event-stream" \
     -H "Authorization: Bearer $BACKEND_API_TOKEN" \
     http://localhost:8000
```

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Add docstrings explaining what is tested
4. Group related tests in classes
5. Mock external dependencies when possible
6. Use fixtures for common setup
7. Add integration tests for new features

### Test Naming Convention

```python
def test_<component>_<scenario>_<expected_result>():
    """Brief description of what is being tested."""
    pass
```

Examples:
- `test_http_post_initialize_request()` - Tests HTTP POST with initialize
- `test_session_id_lifecycle()` - Tests complete session management flow
- `test_token_validation_failure()` - Tests failed JWT validation

## References

- [MCP Specification 2025-03-26](https://spec.modelcontextprotocol.io/specification/2025-03-26/)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [Server-Sent Events (SSE)](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [OAuth 2.0 Bearer Token Usage (RFC 6750)](https://datatracker.ietf.org/doc/html/rfc6750)
- [JWT (RFC 7519)](https://datatracker.ietf.org/doc/html/rfc7519)
- [JWKS (RFC 7517)](https://datatracker.ietf.org/doc/html/rfc7517)

## License

Same as parent project (AGPL-3.0-or-later)
