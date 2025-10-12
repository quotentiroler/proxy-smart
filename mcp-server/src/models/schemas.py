"""Pydantic models for MCP server requests and responses."""

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


class DocumentChunk(BaseModel):
    """Represents a chunk of documentation in the knowledge base."""

    id: str = Field(..., description="Unique identifier for the document chunk")
    content: str = Field(..., description="The text content of the document")
    source: str = Field(..., description="Source file or reference")
    title: str = Field(..., description="Title of the document")
    category: str = Field(..., description="Category (e.g., admin-ui, smart-on-fhir)")
    relevance_score: Optional[float] = Field(None, description="Relevance score from search")


class ChatRequest(BaseModel):
    """Request model for AI chat endpoint."""

    message: str = Field(..., description="User message/question", min_length=1)
    conversation_id: Optional[str] = Field(
        None, description="Optional conversation ID for context"
    )


class ChatResponse(BaseModel):
    """Response model for AI chat endpoint."""

    answer: str = Field(..., description="AI-generated response")
    sources: list[DocumentChunk] = Field(
        default_factory=list, description="Relevant source documents"
    )
    confidence: float = Field(..., description="Confidence score (0-1)", ge=0, le=1)
    mode: Literal["openai", "rule-based"] = Field(
        ..., description="Mode used for generation"
    )
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")


class HealthResponse(BaseModel):
    """Health check response."""

    status: Literal["healthy", "degraded", "unhealthy"] = Field(..., description="Service status")
    openai_available: bool = Field(..., description="Whether OpenAI API is configured")
    knowledge_base_loaded: bool = Field(..., description="Whether knowledge base is loaded")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Check timestamp")
