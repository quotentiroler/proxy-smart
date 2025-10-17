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
    index: Optional[int] = None  # Message index in conversation


@dataclass
class Conversation:
    """A conversation thread with history."""
    
    id: str
    messages: List[ConversationMessage] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)
    last_activity: datetime = field(default_factory=datetime.utcnow)
    summary: Optional[str] = None  # AI-generated summary of older messages
    summary_up_to_index: int = 0  # Index of last message included in summary
    
    def add_message(self, role: str, content: str) -> None:
        """Add a message to the conversation with automatic indexing."""
        index = len(self.messages) + 1
        
        message = ConversationMessage(
            role=role, 
            content=content, 
            index=index
        )
        self.messages.append(message)
        self.last_activity = datetime.utcnow()
    
    def get_message_by_index(self, index: int) -> Optional[ConversationMessage]:
        """Get full message by its index."""
        for msg in self.messages:
            if msg.index == index:
                return msg
        return None
    
    def get_recent_messages(self, max_messages: int = 10) -> List[ConversationMessage]:
        """Get the most recent messages."""
        return self.messages[-max_messages:]
    
    def get_context_summary(
        self, 
        max_context_chars: int = 8000,
        current_input_length: int = 0
    ) -> str:
        """
        Get conversation context for RAG with smart lazy summarization.
        
        Strategy:
        1. Normal mode: Show ALL messages until context pressure
        2. On context window pressure (total > max_context_chars):
           - Use AI-generated summary of older messages (if available)
           - Show all unsummarized messages in full
        3. Summarization is triggered lazily - only when needed
        
        Args:
            max_context_chars: Character budget triggering summarization
            current_input_length: Current user input length (for pressure calculation)
        
        Returns:
            Formatted conversation context optimized for token budget
        """
        if not self.messages:
            return ""
        
        # Calculate context window pressure with ALL messages
        all_messages_size = sum(len(msg.content) for msg in self.messages) + current_input_length
        has_pressure = all_messages_size > max_context_chars
        
        context_parts = []
        
        if has_pressure and self.summary and self.summary_up_to_index > 0:
            # PRESSURE MODE: Use AI summary for older messages
            context_parts.append(
                f"## Earlier Conversation (AI Summary)\n"
                f"Messages 1-{self.summary_up_to_index} summarized:\n{self.summary}\n"
            )
            
            # Show ALL unsummarized messages
            unsummarized = [
                msg for msg in self.messages 
                if msg.index and msg.index > self.summary_up_to_index
            ]
            messages_to_show = unsummarized
            
            context_parts.append("## Recent Messages (Full)\n")
            
        else:
            # NORMAL MODE: Show ALL messages (no pressure yet)
            messages_to_show = self.messages
            context_parts.append("## Full Conversation\n")
        
        # Format message pairs with indices
        for i in range(0, len(messages_to_show), 2):
            if i + 1 < len(messages_to_show):
                user_msg = messages_to_show[i]
                assistant_msg = messages_to_show[i + 1]
                
                context_parts.append(
                    f"[{user_msg.index}] User: {user_msg.content}\n"
                    f"[{assistant_msg.index}] Assistant: {assistant_msg.content}\n"
                )
        
        # Footer
        if messages_to_show:
            context_parts.append("(Full messages retrievable via get_full_message(conversation_id, index))")
        
        return "\n".join(context_parts)
    
    def needs_summarization(
        self, 
        max_context_chars: int = 8000,
        current_input_length: int = 0
    ) -> bool:
        """
        Check if conversation should be summarized based on context window pressure.
        
        Returns True when:
        - Context size exceeds threshold (pressure detected)
        - AND no summary exists yet OR summary is outdated
        
        Args:
            max_context_chars: Character budget for context window
            current_input_length: Current user input length
        
        Returns:
            True if summarization is needed
        """
        
        # Calculate total context size with ALL messages
        total_size = sum(len(msg.content) for msg in self.messages) + current_input_length
        
        # Check if we have context pressure
        has_pressure = total_size > max_context_chars
        
        if not has_pressure:
            return False  # No pressure = no need to summarize
        
        # We have pressure - check if we need a new/updated summary
        if not self.summary:
            return True  # No summary exists, need one
        
        # Check if summary is stale (many new messages since summary)
        new_messages_since_summary = len(self.messages) - self.summary_up_to_index
        return new_messages_since_summary > 20
    
    def set_summary(self, summary_text: str, up_to_index: int) -> None:
        """
        Store AI-generated summary of conversation history.
        Also adds the summary as an assistant message in the conversation.
        
        Args:
            summary_text: The AI-generated summary
            up_to_index: Last message index included in summary
        """
        self.summary = summary_text
        self.summary_up_to_index = up_to_index
        
        # Add summary as an assistant message for permanent record
        summary_message_content = (
            f"[CONVERSATION SUMMARY - Messages 1-{up_to_index}]\n\n{summary_text}"
        )
        self.add_message("assistant", summary_message_content)
        
        logger.info(
            f"Conversation summary stored (covers messages 1-{up_to_index}) "
            f"and added as message #{len(self.messages)}"
        )


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
        current_input: str = ""
    ) -> str:
        """
        Get conversation context for RAG with automatic summarization on pressure.
        
        Args:
            conversation_id: Conversation identifier (None for no context)
            current_input: Current user input (to calculate context pressure)
            
        Returns:
            Formatted conversation context string
        """
        if not conversation_id or conversation_id not in self._conversations:
            return ""
        
        conversation = self._conversations[conversation_id]
        context = conversation.get_context_summary(
            current_input_length=len(current_input)
        )
        
        if context:
            logger.info(
                f"Retrieved context for conversation {conversation_id} "
                f"({len(conversation.messages)} total messages)"
            )
        
        return context
    
    def get_full_message(
        self, 
        conversation_id: str, 
        message_index: int
    ) -> Optional[str]:
        """
        Retrieve the full content of a message by its index.
        
        Args:
            conversation_id: Conversation identifier
            message_index: Message index number
            
        Returns:
            Full message content or None if not found
        """
        if conversation_id not in self._conversations:
            logger.warning(f"Conversation {conversation_id} not found")
            return None
        
        conversation = self._conversations[conversation_id]
        message = conversation.get_message_by_index(message_index)
        
        if message:
            logger.debug(f"Retrieved full message {message_index} from {conversation_id}")
            return message.content
        else:
            logger.warning(
                f"Message index {message_index} not found in conversation {conversation_id}"
            )
            return None
    
    def check_needs_summarization(
        self, 
        conversation_id: str,
        current_input: str = ""
    ) -> bool:
        """
        Check if a conversation needs AI summarization based on context pressure.
        
        Args:
            conversation_id: Conversation to check
            current_input: Current user input (to calculate pressure)
            
        Returns:
            True if summarization would be beneficial
        """
        if conversation_id not in self._conversations:
            return False
        
        conversation = self._conversations[conversation_id]
        return conversation.needs_summarization(current_input_length=len(current_input))
    
    def get_messages_for_summarization(
        self, 
        conversation_id: str,
        up_to_index: Optional[int] = None
    ) -> List[ConversationMessage]:
        """
        Get messages that should be summarized.
        
        Args:
            conversation_id: Conversation identifier
            up_to_index: Summarize up to this index (None = all but last 4)
            
        Returns:
            List of messages to summarize
        """
        if conversation_id not in self._conversations:
            return []
        
        conversation = self._conversations[conversation_id]
        
        if up_to_index is None:
            # Summarize all except last 2 message pairs (4 messages)
            up_to_index = max(1, len(conversation.messages) - 4)
        
        # Exclude any previous summary messages (they start with "[CONVERSATION SUMMARY")
        return [
            msg for msg in conversation.messages
            if msg.index 
            and msg.index <= up_to_index
            and not msg.content.startswith("[CONVERSATION SUMMARY")
        ]
    
    def store_summary(
        self, 
        conversation_id: str, 
        summary_text: str, 
        up_to_index: int
    ) -> None:
        """
        Store AI-generated summary for a conversation.
        
        Args:
            conversation_id: Conversation identifier
            summary_text: The AI-generated summary
            up_to_index: Last message index included in summary
        """
        if conversation_id not in self._conversations:
            logger.warning(f"Cannot store summary: conversation {conversation_id} not found")
            return
        
        conversation = self._conversations[conversation_id]
        conversation.set_summary(summary_text, up_to_index)
        logger.info(f"Stored summary for conversation {conversation_id} (messages 1-{up_to_index})")
    
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
