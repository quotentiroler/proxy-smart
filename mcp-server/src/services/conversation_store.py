"""Conversation history storage for context-aware AI assistant."""

import logging
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


@dataclass
class ConversationMessage:
    """A single message in a conversation."""
    
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime = field(default_factory=datetime.utcnow)


@dataclass
class Conversation:
    """A conversation thread with history."""
    
    id: str
    messages: List[ConversationMessage] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)
    last_activity: datetime = field(default_factory=datetime.utcnow)
    
    def add_message(self, role: str, content: str) -> None:
        """Add a message to the conversation."""
        self.messages.append(ConversationMessage(role=role, content=content))
        self.last_activity = datetime.utcnow()
    
    def get_recent_messages(self, max_messages: int = 10) -> List[ConversationMessage]:
        """Get the most recent messages."""
        return self.messages[-max_messages:]
    
    def get_context_summary(self, max_pairs: int = 3) -> str:
        """
        Get a summary of recent conversation for RAG context.
        
        Returns formatted conversation history with recent exchanges.
        """
        if not self.messages:
            return ""
        
        # Get recent message pairs (user + assistant)
        recent = self.get_recent_messages(max_messages=max_pairs * 2)
        
        context_parts = []
        for i in range(0, len(recent), 2):
            if i + 1 < len(recent):
                user_msg = recent[i]
                assistant_msg = recent[i + 1]
                context_parts.append(f"User: {user_msg.content}\nAssistant: {assistant_msg.content}")
        
        if context_parts:
            return "## Recent Conversation History\n\n" + "\n\n".join(context_parts)
        return ""


class ConversationStore:
    """Manages conversation history for all users/sessions."""
    
    def __init__(self, max_age_hours: int = 24, cleanup_interval_hours: int = 1):
        """
        Initialize the conversation store.
        
        Args:
            max_age_hours: Maximum age of conversations before cleanup (default 24 hours)
            cleanup_interval_hours: How often to run cleanup (default 1 hour)
        """
        self._conversations: Dict[str, Conversation] = {}
        self._max_age = timedelta(hours=max_age_hours)
        self._last_cleanup = datetime.utcnow()
        self._cleanup_interval = timedelta(hours=cleanup_interval_hours)
        logger.info(f"ConversationStore initialized (max_age={max_age_hours}h)")
    
    def get_or_create_conversation(self, conversation_id: str) -> Conversation:
        """
        Get existing conversation or create new one.
        
        Args:
            conversation_id: Unique conversation identifier
            
        Returns:
            Conversation object
        """
        # Run periodic cleanup
        self._maybe_cleanup()
        
        if conversation_id not in self._conversations:
            logger.info(f"Creating new conversation: {conversation_id}")
            self._conversations[conversation_id] = Conversation(id=conversation_id)
        else:
            logger.debug(f"Retrieved existing conversation: {conversation_id}")
        
        return self._conversations[conversation_id]
    
    def add_message(
        self, 
        conversation_id: str, 
        role: str, 
        content: str
    ) -> None:
        """
        Add a message to a conversation.
        
        Args:
            conversation_id: Unique conversation identifier
            role: 'user' or 'assistant'
            content: Message content
        """
        conversation = self.get_or_create_conversation(conversation_id)
        conversation.add_message(role, content)
        logger.debug(
            f"Added {role} message to conversation {conversation_id} "
            f"(total messages: {len(conversation.messages)})"
        )
    
    def get_conversation_context(
        self, 
        conversation_id: Optional[str],
        max_pairs: int = 3
    ) -> str:
        """
        Get conversation context for RAG.
        
        Args:
            conversation_id: Conversation identifier (None for no context)
            max_pairs: Maximum number of message pairs to include
            
        Returns:
            Formatted conversation context string
        """
        if not conversation_id or conversation_id not in self._conversations:
            return ""
        
        conversation = self._conversations[conversation_id]
        context = conversation.get_context_summary(max_pairs=max_pairs)
        
        if context:
            logger.info(
                f"Retrieved context for conversation {conversation_id} "
                f"({len(conversation.messages)} total messages)"
            )
        
        return context
    
    def _maybe_cleanup(self) -> None:
        """Run cleanup if enough time has passed since last cleanup."""
        now = datetime.utcnow()
        if now - self._last_cleanup > self._cleanup_interval:
            self._cleanup_old_conversations()
            self._last_cleanup = now
    
    def _cleanup_old_conversations(self) -> None:
        """Remove conversations that are too old."""
        now = datetime.utcnow()
        before_count = len(self._conversations)
        
        # Find expired conversations
        expired_ids = [
            conv_id
            for conv_id, conv in self._conversations.items()
            if now - conv.last_activity > self._max_age
        ]
        
        # Remove them
        for conv_id in expired_ids:
            del self._conversations[conv_id]
        
        if expired_ids:
            logger.info(
                f"Cleaned up {len(expired_ids)} old conversations "
                f"(before: {before_count}, after: {len(self._conversations)})"
            )
    
    def get_stats(self) -> Dict[str, int]:
        """Get statistics about stored conversations."""
        return {
            "total_conversations": len(self._conversations),
            "total_messages": sum(len(conv.messages) for conv in self._conversations.values()),
        }


# Singleton instance
conversation_store = ConversationStore()
