# SMART on FHIR AI Assistant MCP Server

A Python-based **Model Context Protocol (MCP)** server that provides AI-powered assistance for the SMART on FHIR platform administration. This server implements a RAG (Retrieval Augmented Generation) system with function calling capabilities to provide intelligent, context-aware assistance.

## 🎯 What is MCP?

**Model Context Protocol (MCP)** is an open protocol that standardizes how applications provide context to AI models. In this implementation, the MCP server:

1. **Exposes Tools**: Backend API functions (list users, apps, servers, etc.)
2. **Manages Context**: Maintains conversation state and documentation knowledge
3. **Orchestrates AI**: Coordinates between RAG retrieval, function calls, and LLM generation
4. **Streams Responses**: Provides real-time updates via Server-Sent Events (SSE)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         UI (React)                              │
│  AIChatOverlay.tsx - Streaming chat interface with SSE         │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Elysia/Node.js)                     │
│  - Authentication (validates user tokens)                       │
│  - Request proxying to MCP server                               │
│  - /api/ai/chat/stream → forwards to :8081                      │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                 MCP Server (Python/FastAPI)                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Services Layer                                           │   │
│  │  • ai_assistant.py - Core RAG + function calling         │   │
│  │  • knowledge_base.py - Documentation chunks              │   │
│  │  • keycloak_auth.py - Backend API authentication         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             ↓                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ AI Pipeline                                              │   │
│  │  1. Query Understanding                                  │   │
│  │  2. RAG Retrieval (semantic search)                      │   │
│  │  3. Function Calling (backend API calls)                 │   │
│  │  4. Response Generation (streaming)                      │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────┬─────────────────────┬───────────────────────┘
                    │                     │
                    ↓                     ↓
        ┌─────────────────────┐  ┌──────────────────┐
        │  OpenAI GPT-4       │  │  Backend APIs    │
        │  (LLM Generation)   │  │  (Live Data)     │
        └─────────────────────┘  └──────────────────┘
```

### Key Components

- **OpenAI Integration**: Uses GPT-4 for intelligent responses with function calling
- **RAG Knowledge Base**: Pre-loaded documentation chunks with vector embeddings
- **Semantic Search**: Cosine similarity-based retrieval for relevant context
- **Function Calling**: Dynamic backend API invocation for live data
- **Keycloak Auth**: SMART Backend Services (JWT) for API authentication
- **SSE Streaming**: Real-time response generation with progress updates

## 📁 Structure

```
mcp-server/
├── src/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app, SSE endpoints
│   ├── config.py                  # Environment configuration
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py             # Request/Response Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_assistant.py        # RAG + function calling engine
│   │   ├── knowledge_base.py      # Documentation chunks + search
│   │   └── keycloak_auth.py       # SMART Backend Services auth
│   └── api_client/                # Generated backend API client
│       └── backend_mcp_server_generated.py
├── keys/
│   └── ai_assistant_private.pem   # Private key for JWT signing
├── tests/
│   ├── test_ai_assistant.py
│   └── test_mcp_integration.py
├── requirements.txt               # Pip dependencies
├── pyproject.toml                 # UV project config
└── README.md
```

### 🔄 Request Flow Example

```
1. User: "Show me all healthcare users"
   ↓
2. UI sends POST /api/ai/chat/stream
   ↓
3. Backend authenticates user, forwards to MCP :8081
   ↓
4. MCP receives request, starts processing:
   
   Stream: {"type":"sources","sources":[...]} → UI shows sources
   ↓
   Stream: {"type":"reasoning","content":"User wants to list users..."}
   ↓
   Stream: {"type":"function_calling","name":"list_healthcare_users"}
   ↓
   MCP calls backend: GET /api/healthcare-users (with Keycloak token)
   ↓
   Backend returns: [{id: 1, name: "Dr. Smith"}, ...]
   ↓
   Stream: {"type":"content","content":"Here are the healthcare users:\n\n"}
   ↓
   Stream: {"type":"content","content":"1. **Dr. Smith** (ID: 1)\n"}
   ↓
   Stream: {"type":"done","confidence":0.95}
   ↓
5. UI displays complete response with sources
```

## 🚀 Setup

### Prerequisites

- Python 3.11+
- [uv](https://github.com/astral-sh/uv) (modern Python package manager)
- OpenAI API key

### Installation

```bash
cd mcp-server

# Install uv if you haven't already
# Windows (PowerShell):
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# Create virtual environment and install dependencies
uv venv
uv pip install -e ".[dev]"

# Or simply sync all dependencies
uv sync
```

### Environment Variables

Create a `.env` file:

```bash
OPENAI_API_KEY=your-openai-api-key-here
MCP_SERVER_HOST=0.0.0.0
MCP_SERVER_PORT=8081
LOG_LEVEL=INFO
```

### Running the Server

```bash
# Activate virtual environment
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Run with Python
python src/main.py

# Or with uvicorn directly
uv run uvicorn src.main:app --host 0.0.0.0 --port 8081 --reload

# Or use uv to run without activating venv
uv run python src/main.py
```

## 🔌 Integration

The backend Elysia server proxies AI requests to this MCP server:

```
UI → Elysia Backend (/api/ai/chat/stream) → MCP Server (localhost:8081) → OpenAI
```

### Authentication Flow

The MCP server uses **SMART Backend Services** (OAuth 2.0 client credentials with JWT assertion):

1. On startup, MCP server generates a JWT signed with private key
2. Exchanges JWT with Keycloak for access token
3. Uses access token to call backend APIs (list users, apps, etc.)
4. Token auto-refreshes when expired

**Configuration:**
```env
KEYCLOAK_SERVER_URL=http://localhost:8080
KEYCLOAK_CLIENT_ID=ai_assistant
KEYCLOAK_PRIVATE_KEY_PATH=./keys/ai_assistant_private.pem
```

## 🌊 Streaming Response Format

The MCP server uses **Server-Sent Events (SSE)** to stream responses in real-time. Each event is a JSON object with a `type` field:

### Stream Event Types

| Type | Description | Data |
|------|-------------|------|
| `sources` | Retrieved documentation chunks | `{sources: DocumentChunk[], mode?: string, confidence?: number}` |
| `reasoning` | AI's internal reasoning process | `{content: string}` |
| `reasoning_done` | Reasoning phase complete | `{}` |
| `function_calling` | Function being executed | `{name: string}` |
| `content` | Response text chunk | `{content: string}` |
| `done` | Stream complete | `{mode?: string, confidence?: number}` |
| `error` | Error occurred | `{error: string}` |

### Example Stream

```
data: {"type":"sources","sources":[{"id":"smart-app-launch","title":"SMART App Launch","content":"...","category":"core"}],"confidence":0.95}

data: {"type":"reasoning","content":"The user is asking about app registration..."}

data: {"type":"reasoning_done"}

data: {"type":"function_calling","name":"list_smart_apps"}

data: {"type":"content","content":"Here are the"}

data: {"type":"content","content":" registered SMART apps:\n\n"}

data: {"type":"content","content":"1. **MyChart** - Patient portal\n"}

data: {"type":"done","mode":"openai","confidence":0.92}
```

### Client-Side Handling

The UI (`AIChatOverlay.tsx`) handles each event type:
- **sources**: Displays document references
- **reasoning**: Shows "thinking" indicator
- **function_calling**: Shows "🔧 Executing: Function Name"
- **content**: Streams response text in real-time
- **done**: Marks response complete, hides indicators

## 📡 API Endpoints

### POST /ai/chat

Generate AI response with RAG context.

**Request:**
```json
{
  "message": "How do I configure FHIR servers?",
  "conversation_id": "optional-session-id"
}
```

**Response:**
```json
{
  "answer": "To configure FHIR servers...",
  "sources": [
    {
      "id": "fhir-servers-management",
      "title": "FHIR Servers Management",
      "content": "...",
      "relevance_score": 0.95
    }
  ],
  "confidence": 0.9,
  "mode": "openai"
}
```

### POST /ai/chat/stream

Stream AI response with SSE (Server-Sent Events).

**Request:**
```json
{
  "message": "Show me all healthcare users",
  "conversation_id": "optional-session-id"
}
```

**Response:** SSE stream (see [Streaming Response Format](#-streaming-response-format))

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "openai": true,
  "knowledge_base_loaded": true,
  "backend_authenticated": true
}
```

## 🛠️ Available Functions

The MCP server can call these backend API functions dynamically based on user queries:

| Function | Description | Example Query |
|----------|-------------|---------------|
| `list_healthcare_users` | Get all users with FHIR associations | "Show me all healthcare users" |
| `list_smart_apps` | Get registered SMART applications | "What apps are registered?" |
| `list_fhir_servers` | Get configured FHIR servers | "Show FHIR servers" |
| `list_identity_providers` | Get IdP configurations | "What identity providers are configured?" |
| `list_scopes` | Get available OAuth scopes | "What scopes can I use?" |
| `list_launch_contexts` | Get launch context definitions | "Show me launch contexts" |

### How Function Calling Works

1. **User Query**: "Show me all healthcare users"
2. **AI Analysis**: GPT-4 determines `list_healthcare_users` should be called
3. **Stream Event**: `{"type":"function_calling","name":"list_healthcare_users"}`
4. **API Call**: MCP server calls `GET /api/healthcare-users` with Keycloak token
5. **Response Integration**: AI incorporates live data into response
6. **Stream Content**: Real-time streaming of formatted response

## 📚 RAG Knowledge Base

The MCP server includes a comprehensive knowledge base about the SMART on FHIR platform:

### Document Categories

- **Core Concepts**: OAuth, SMART App Launch, FHIR basics
- **User Management**: Healthcare users, FHIR associations, lifecycle
- **SMART Apps**: Registration, configuration, scope management
- **FHIR Servers**: Setup, health monitoring, proxy configuration
- **Identity Providers**: Keycloak, SAML, OpenID Connect
- **Scopes & Permissions**: OAuth scopes, SMART scopes, custom scopes
- **Launch Contexts**: EHR launch, standalone launch, context injection
- **OAuth Monitoring**: Real-time analytics, WebSocket integration
- **Troubleshooting**: Common issues, debugging, best practices

### RAG Pipeline

```
User Query
    ↓
Semantic Search (cosine similarity)
    ↓
Top K Documents (k=3, threshold=0.7)
    ↓
Context Injection into GPT-4 Prompt
    ↓
Response Generation
```

**How it works:**
1. User query is embedded using OpenAI embeddings
2. Cosine similarity computed against all knowledge base chunks
3. Top 3 most relevant chunks retrieved (if similarity > 0.7)
4. Chunks injected as context in GPT-4 system prompt
5. GPT-4 generates response grounded in documentation
6. Sources cited in response for transparency

## 🧪 Testing

```bash
# Run tests
uv run pytest tests/

# With coverage
uv run pytest tests/ --cov=src --cov-report=html

# Run linting
uv run ruff check src/

# Format code
uv run ruff format src/

# Type checking
uv run mypy src/

# Test the AI assistant directly
uv run python test_mcp_integration.py
```

## 🖥️ Claude Desktop Integration

The MCP server can be used with [Claude Desktop](https://claude.ai/desktop) for local AI interactions:

### Configuration

Add to your Claude Desktop config (`%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "smart-on-fhir-assistant": {
      "command": "uv",
      "args": [
        "run",
        "python",
        "C:\\path\\to\\smart-on-fhir-proxy\\mcp-server\\src\\main.py"
      ],
      "env": {
        "OPENAI_API_KEY": "your-key-here",
        "KEYCLOAK_SERVER_URL": "http://localhost:8080",
        "KEYCLOAK_CLIENT_ID": "ai_assistant"
      }
    }
  }
}
```

### Usage

Once configured, Claude Desktop can:
- Access the platform knowledge base
- Call backend API functions
- Provide intelligent platform assistance
- Stream responses in real-time

**Note:** Claude Desktop integration is experimental and requires the MCP protocol to be fully standardized.

## 🔧 Troubleshooting

### MCP Server Won't Start

**Issue:** `ModuleNotFoundError` or import errors

**Solution:**
```bash
cd mcp-server
uv sync  # Reinstall dependencies
uv run python src/main.py
```

### OpenAI API Errors

**Issue:** `AuthenticationError` or `RateLimitError`

**Solution:**
- Check `OPENAI_API_KEY` in `.env`
- Verify API key has sufficient credits
- Check rate limits on OpenAI dashboard

### Keycloak Authentication Failed

**Issue:** `401 Unauthorized` when calling backend APIs

**Solution:**
- Verify Keycloak server is running (`http://localhost:8080`)
- Check `ai_assistant` client exists in Keycloak
- Verify private key path in `.env`
- Ensure client has Backend Services enabled

### Empty AI Responses

**Issue:** AI returns empty messages or only function call notifications

**Solution:**
- Check logs for warnings about empty content
- Verify OpenAI API is responding (check `/health` endpoint)
- Ensure knowledge base is loaded (check startup logs)
- Try simpler queries to test basic functionality

### Streaming Not Working

**Issue:** UI shows loading but no content streams

**Solution:**
- Check browser console for SSE errors
- Verify backend is proxying to correct MCP port (8081)
- Test MCP server directly: `curl http://localhost:8081/health`
- Check firewall isn't blocking local connections

## 📊 Performance

**Typical Response Times:**
- RAG retrieval: 50-100ms
- Backend API calls: 100-200ms
- OpenAI generation: 1-3s (streaming starts immediately)
- Total time to first token: ~200ms

**Scaling Recommendations:**
- Use Redis for conversation state (not yet implemented)
- Cache OpenAI embeddings for common queries
- Implement request queuing for high concurrency
- Consider running multiple MCP server instances behind a load balancer

## 📝 License

AGPL-3.0-or-later (same as parent project)
