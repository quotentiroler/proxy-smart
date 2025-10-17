"""Main FastAPI application for MCP server."""

import logging
import time
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

from config import settings
from models import ChatRequest, ChatResponse, HealthResponse
from services import ai_assistant

# Configure logging
logging.basicConfig(
    level=settings.log_level,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan handler."""
    logger.info("Starting MCP server...")
    logger.info(f"OpenAI available: {ai_assistant.is_openai_available()}")
    logger.info(
        f"Knowledge base stats: {ai_assistant.knowledge_base.get_stats()['total_documents']} documents"
    )
    
    # Initialize embeddings for semantic search
    if ai_assistant.is_openai_available():
        logger.info("Initializing document embeddings for semantic search...")
        await ai_assistant.knowledge_base.initialize_embeddings()
        logger.info("Embeddings initialized successfully")
    
    # Fetch Keycloak token for backend API access
    if not settings.backend_api_token:
        try:
            logger.info("Fetching Keycloak access token for backend API...")
            from services.keycloak_auth import get_keycloak_auth
            keycloak_auth = get_keycloak_auth()
            token = await keycloak_auth.get_access_token()
            settings.backend_api_token = token
            logger.info("Successfully obtained backend API token")
        except Exception as e:
            logger.warning(f"Failed to get backend API token: {e}")
            logger.warning("Backend API tools may fail with 401 errors")
    
    # Initialize MCP backend client asynchronously (don't block startup)
    async def init_backend_client():
        try:
            from services.backend_mcp_client import get_backend_client
            backend_client = await get_backend_client()
            logger.info("Backend MCP client initialized successfully")
        except Exception as e:
            logger.warning(f"Failed to initialize backend MCP client: {e}")
            logger.warning("Backend API tools will not be available")
    
    # Start backend client initialization in background
    import asyncio
    asyncio.create_task(init_backend_client())
    
    yield
    
    # Cleanup: disconnect MCP client
    try:
        from services.backend_mcp_client import get_backend_client
        backend_client = await get_backend_client()
        await backend_client.disconnect()
        logger.info("Backend MCP client disconnected")
    except Exception as e:
        logger.debug(f"Error disconnecting backend MCP client: {e}")
    
    logger.info("Shutting down MCP server...")


# Create FastAPI application
app = FastAPI(
    title="SMART on FHIR AI Assistant MCP Server",
    description="Model Context Protocol server for AI-powered SMART on FHIR platform assistance",
    version="0.0.1",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint - responds immediately without blocking.
    
    Returns basic health status without waiting for background tasks.
    """
    # Check if backend API is authenticated
    backend_authenticated = bool(settings.backend_api_token)
    
    # Don't call knowledge_base.get_stats() as it might be slow
    # Just return a simple response
    return HealthResponse(
        status="healthy",
        openai_available=settings.is_openai_configured(),
        knowledge_base_loaded=True,  # Assume loaded, don't check synchronously
        backend_authenticated=backend_authenticated,
    )


@app.post("/ai/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Generate AI response with RAG context.

    Args:
        request: ChatRequest with user message and optional conversation_id

    Returns:
        ChatResponse with answer, sources, confidence, and mode

    Raises:
        HTTPException: If there's an error generating the response
    """
    start_time = time.time()
    try:
        logger.info(f"Received chat request: {request.message[:100]}... (conversation_id: {request.conversation_id})")
        response = await ai_assistant.generate_response(
            request.message, 
            request.conversation_id
        )
        
        elapsed_time = time.time() - start_time
        logger.info(f"Generated response in {response.mode} mode - took {elapsed_time:.2f}s")
        
        return response
    except Exception as e:
        logger.error(f"Error generating response: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@app.post("/ai/chat/stream")
async def chat_stream(request: Request) -> StreamingResponse:
    """
    Generate AI response with streaming (Server-Sent Events).

    Args:
        request: ChatRequest with user message and optional conversation_id

    Returns:
        StreamingResponse with SSE-formatted incremental data

    Raises:
        HTTPException: If there's an error generating the response
    """
    try:
        # Parse raw body first to debug
        raw_body = await request.body()
        logger.info(f"Raw request body: {raw_body.decode('utf-8')[:500]}")
        
        # Parse into Pydantic model
        import json
        body_dict = json.loads(raw_body)
        chat_request = ChatRequest(**body_dict)
        
        logger.info(f"Received streaming chat request: {chat_request.message[:100]}... (conversation_id: {chat_request.conversation_id})")
        
        # Debug: Log the entire request object
        logger.info(f"Request fields - message: {bool(chat_request.message)}, conversation_id: {chat_request.conversation_id}, page_context: {bool(chat_request.page_context)}")
        
        # Log page context if provided
        if chat_request.page_context:
            logger.info(f"Page context received: {chat_request.page_context[:200]}...")
        else:
            logger.warning(f"No page context provided in request. Parsed dict keys: {body_dict.keys()}, page_context value: {body_dict.get('page_context')}")
        
        return StreamingResponse(
            ai_assistant.generate_response_stream(
                chat_request.message,
                chat_request.conversation_id,
                chat_request.page_context
            ),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",  # Disable nginx buffering
            }
        )
    except Exception as e:
        logger.error(f"Error generating streaming response: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error generating streaming response: {str(e)}")


@app.get("/")
async def root() -> JSONResponse:
    """Root endpoint with server information."""
    return JSONResponse(
        content={
            "name": "SMART on FHIR AI Assistant MCP Server",
            "version": "0.0.1",
            "status": "running",
            "endpoints": {
                "health": "/health",
                "chat": "/ai/chat (POST)",
                "chat_stream": "/ai/chat/stream (POST)",
                "conversation_stats": "/ai/conversations/stats (GET)",
                "docs": "/docs",
            },
        }
    )


@app.get("/ai/conversations/stats")
async def conversation_stats() -> JSONResponse:
    """
    Get statistics about stored conversations.
    
    Returns:
        JSON with conversation statistics
    """
    try:
        from services.conversation_store import conversation_store
        stats = conversation_store.get_stats()
        return JSONResponse(content=stats)
    except Exception as e:
        logger.error(f"Error getting conversation stats: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.mcp_server_host,
        port=settings.mcp_server_port,
        reload=True,
        log_level=settings.log_level.lower(),
    )
