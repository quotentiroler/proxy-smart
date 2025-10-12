"""Main FastAPI application for MCP server."""

import logging
import time
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, HTTPException
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
    
    yield
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
    """Health check endpoint."""
    kb_stats = ai_assistant.knowledge_base.get_stats()

    return HealthResponse(
        status="healthy",
        openai_available=ai_assistant.is_openai_available(),
        knowledge_base_loaded=kb_stats["total_documents"] > 0,
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
async def chat_stream(request: ChatRequest) -> StreamingResponse:
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
        logger.info(f"Received streaming chat request: {request.message[:100]}... (conversation_id: {request.conversation_id})")
        
        return StreamingResponse(
            ai_assistant.generate_response_stream(
                request.message,
                request.conversation_id
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
