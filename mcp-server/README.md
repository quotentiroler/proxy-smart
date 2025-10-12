# SMART on FHIR AI Assistant MCP Server

A Python-based Model Context Protocol (MCP) server that provides AI-powered assistance for the SMART on FHIR platform administration.

## 🏗️ Architecture

This MCP server implements an AI assistant with RAG (Retrieval Augmented Generation) capabilities:

- **OpenAI Integration**: Uses GPT-4 for intelligent responses
- **RAG Knowledge Base**: Pre-loaded documentation about SMART on FHIR platform
- **Semantic Search**: Vector embeddings for context-aware document retrieval
- **MCP Protocol**: Standard protocol for AI agent communication

## 📁 Structure

```
mcp-server/
├── src/
│   ├── __init__.py
│   ├── main.py              # MCP server entry point
│   ├── config.py            # Configuration management
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py       # Pydantic models for requests/responses
│   └── services/
│       ├── __init__.py
│       ├── ai_assistant.py  # Core AI assistant logic with RAG
│       └── knowledge_base.py # Documentation chunks and search
├── tests/
│   └── test_ai_assistant.py
├── requirements.txt
├── pyproject.toml
└── README.md
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
UI → Elysia Backend (/api/ai/chat) → MCP Server (localhost:8081) → OpenAI
```

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

### GET /health

Health check endpoint.

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
```

## 📝 License

AGPL-3.0-or-later (same as parent project)
