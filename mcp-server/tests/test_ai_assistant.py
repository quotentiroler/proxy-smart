"""Tests for AI Assistant service."""

import pytest
from src.services.ai_assistant import AIAssistant


@pytest.fixture
def ai_assistant():
    """Create AI Assistant instance for testing."""
    return AIAssistant()


def test_ai_assistant_initialization(ai_assistant):
    """Test AI Assistant initialization."""
    assert ai_assistant.knowledge_base is not None
    assert ai_assistant.knowledge_base.get_stats()["total_documents"] > 0


def test_knowledge_base_search(ai_assistant):
    """Test knowledge base search functionality."""
    results = ai_assistant.knowledge_base.search_by_keyword("user management", max_results=3)
    assert len(results) > 0
    assert all(result.relevance_score is not None for result in results)
    assert all(result.relevance_score > 0 for result in results)


def test_knowledge_base_categories(ai_assistant):
    """Test knowledge base categories."""
    categories = ai_assistant.knowledge_base.get_all_categories()
    assert "admin-ui" in categories
    assert "smart-on-fhir" in categories
    assert "tutorials" in categories


@pytest.mark.asyncio
async def test_generate_response_general(ai_assistant):
    """Test general response generation."""
    response = await ai_assistant.generate_response("What can you help me with?")
    assert response.answer is not None
    assert len(response.answer) > 0
    assert response.confidence > 0
    assert response.mode in ["openai", "rule-based"]


@pytest.mark.asyncio
async def test_generate_response_specific_topic(ai_assistant):
    """Test response generation for specific topic."""
    response = await ai_assistant.generate_response("How do I manage users?")
    assert response.answer is not None
    assert "user" in response.answer.lower() or "User" in response.answer
    assert len(response.sources) > 0


@pytest.mark.asyncio
async def test_generate_response_no_results(ai_assistant):
    """Test response when no relevant documents found."""
    response = await ai_assistant.generate_response("xyzabc nonsense query 123")
    assert response.answer is not None
    assert response.mode == "rule-based"
    assert response.confidence <= 0.6
