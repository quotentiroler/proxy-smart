# AI Chat Conversation History & Context-Aware Responses

## Overview
The AI Assistant now maintains conversation history to provide **context-aware responses**. This enables the AI to:
- Remember previous exchanges in a conversation
- Understand follow-up questions without repeating context
- Provide more coherent and relevant answers across multiple messages
- Build upon previous responses naturally

## Architecture

### Backend (MCP Server)
```
┌─────────────────────────────────────────────────────┐
│                   MCP Server                         │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────┐    ┌──────────────────────┐  │
│  │  AI Assistant    │◄───┤ Conversation Store  │  │
│  │                  │    │                      │  │
│  │ - RAG Context    │    │ - History Storage   │  │
│  │ - OpenAI API     │    │ - Auto-Cleanup      │  │
│  │ - Streaming      │    │ - Context Summary   │  │
│  └──────────────────┘    └──────────────────────┘  │
│           ▲                        ▲                │
│           │                        │                │
│  ┌────────┴────────────────────────┴──────────┐    │
│  │         Knowledge Base (Semantic Search)   │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Frontend (UI)
```
┌─────────────────────────────────────────────────────┐
│                   React UI                           │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────┐    ┌──────────────────────┐  │
│  │  AIChatOverlay   │◄───┤  useAIChatStore     │  │
│  │  Component       │    │  (Zustand)          │  │
│  │                  │    │                      │  │
│  │ - UI State       │    │ - Messages          │  │
│  │ - Message Input  │    │ - Conversation ID   │  │
│  │ - Streaming      │    │ - Persistence       │  │
│  └──────────────────┘    └──────────────────────┘  │
│           │                        │                │
│           └────────────┬───────────┘                │
│                        ▼                            │
│              ┌──────────────────┐                   │
│              │  AI Assistant    │                   │
│              │  Client Library  │                   │
│              └──────────────────┘                   │
│                        │                            │
└────────────────────────┼────────────────────────────┘
                         │
                         ▼ HTTP/SSE
                    MCP Server
```

## Implementation Details

### 1. Conversation Store (Backend)

**File**: `mcp-server/src/services/conversation_store.py`

#### Features:
- **In-Memory Storage**: Fast access to conversation history
- **Automatic Cleanup**: Removes conversations older than 24 hours (configurable)
- **Context Summarization**: Extracts recent exchanges for RAG context
- **Thread-Safe**: Handles concurrent access

#### Data Structure:
```python
@dataclass
class ConversationMessage:
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime

@dataclass
class Conversation:
    id: str
    messages: List[ConversationMessage]
    created_at: datetime
    last_activity: datetime
```

#### Key Methods:
```python
# Get or create conversation
conversation = conversation_store.get_or_create_conversation(conversation_id)

# Add message
conversation_store.add_message(conversation_id, "user", "What is SMART on FHIR?")

# Get context for RAG
context = conversation_store.get_conversation_context(
    conversation_id, 
    max_pairs=3  # Last 3 user-assistant exchanges
)

# Get statistics
stats = conversation_store.get_stats()
# Returns: {"total_conversations": 5, "total_messages": 42}
```

### 2. AI Assistant Integration (Backend)

**File**: `mcp-server/src/services/ai_assistant.py`

#### Context Building:
The AI assistant now builds RAG context from **two sources**:

1. **Knowledge Base** (semantic search results)
2. **Conversation History** (recent exchanges)

```python
def _build_rag_context(
    self, 
    relevant_docs: list[DocumentChunk],
    conversation_id: Optional[str] = None
) -> str:
    context_parts = []
    
    # Add conversation history
    if conversation_id:
        conversation_context = self.conversation_store.get_conversation_context(
            conversation_id, 
            max_pairs=3
        )
        if conversation_context:
            context_parts.append(conversation_context)
    
    # Add knowledge base documents
    for doc in relevant_docs:
        context_parts.append(doc.content)
    
    return "\n\n".join(context_parts)
```

#### Message Flow:
```
1. User sends message → Store in conversation history
2. Search knowledge base for relevant docs
3. Get recent conversation context (last 3 exchanges)
4. Combine: conversation history + knowledge base docs
5. Send to OpenAI with combined context
6. Store assistant response → Save in conversation history
7. Return response to user
```

### 3. API Endpoints (Backend)

#### POST `/ai/chat`
Generate AI response with conversation context.

**Request**:
```json
{
  "message": "How do I configure a FHIR server?",
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response**:
```json
{
  "answer": "To configure a FHIR server...",
  "sources": [...],
  "confidence": 0.9,
  "mode": "openai",
  "timestamp": "2025-10-12T10:30:00Z"
}
```

#### POST `/ai/chat/stream`
Streaming version with Server-Sent Events.

**Request**: Same as `/ai/chat`

**Response** (SSE stream):
```
data: {"type": "sources", "sources": [...]}

data: {"type": "content", "content": "To configure"}

data: {"type": "content", "content": " a FHIR server..."}

data: {"type": "done", "mode": "openai", "confidence": 0.9}
```

#### GET `/ai/conversations/stats`
Get conversation statistics (for monitoring/debugging).

**Response**:
```json
{
  "total_conversations": 15,
  "total_messages": 127
}
```

### 4. Frontend Store (UI)

**File**: `ui/src/stores/aiChatStore.ts`

#### Persistence:
- **localStorage**: Messages persist across browser sessions
- **Conversation ID**: Unique UUID for each conversation thread
- **Date Serialization**: Proper handling of Date objects

#### State:
```typescript
interface AIChatState {
  messages: ChatMessage[];          // Full conversation history
  conversationId: string | null;    // Current conversation UUID
  isMinimized: boolean;             // UI state
  isOpen: boolean;                  // UI state
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  resetChat: () => void;            // New conversation
}
```

### 5. Frontend Component (UI)

**File**: `ui/src/components/AIChatOverlay.tsx`

#### Key Features:
- **Automatic Conversation ID**: Generated on mount if not present
- **Message Persistence**: Uses Zustand store
- **Clear Chat Button**: Resets conversation and generates new ID
- **Streaming Support**: Real-time message updates

#### Conversation ID Lifecycle:
```typescript
useEffect(() => {
  // Initialize conversation ID if not set
  if (!conversationId) {
    setConversationId(crypto.randomUUID());
  }
}, [conversationId, setConversationId]);

const handleClearChat = () => {
  resetChat();                      // Clear messages
  setConversationId(crypto.randomUUID());  // New conversation
};
```

## Usage Examples

### Example 1: Follow-Up Questions

**User**: "What is SMART on FHIR?"
**Assistant**: "SMART on FHIR is a standard for integrating healthcare applications..."

**User**: "How do I use it in my app?" ← No need to repeat "SMART on FHIR"
**Assistant**: "To integrate SMART on FHIR in your application..." ← AI remembers context

### Example 2: Multi-Step Configuration

**User**: "I need to set up a FHIR server"
**Assistant**: "I can help you set up a FHIR server. Here are the steps..."

**User**: "What about authentication?"
**Assistant**: "For authentication with the FHIR server you're setting up..." ← Knows we're talking about the same server

### Example 3: Clarification

**User**: "How do I register an app?"
**Assistant**: "To register a SMART app, you need to..."

**User**: "What credentials do I need?"
**Assistant**: "For app registration, you'll need..." ← Understands "credentials" refers to app registration

## Configuration

### Backend Settings

**File**: `mcp-server/src/services/conversation_store.py`

```python
ConversationStore(
    max_age_hours=24,        # Keep conversations for 24 hours
    cleanup_interval_hours=1 # Run cleanup every hour
)
```

### Context Settings

**In `_build_rag_context` method**:
```python
max_pairs=3  # Include last 3 user-assistant exchanges
```

This means:
- **Last 3 exchanges** = 6 messages total (3 user + 3 assistant)
- Roughly **500-1000 tokens** of conversation context
- Leaves room for knowledge base documents

### Token Budget

Typical RAG context composition:
```
Total: ~4000 tokens (for OpenAI)
├── Conversation History: ~500-1000 tokens (3 exchanges)
├── Knowledge Base Docs: ~2000-2500 tokens (3-5 documents)
└── System Prompt: ~500 tokens
```

## Benefits

### For Users:
✅ **Natural Conversations**: No need to repeat context
✅ **Better Understanding**: AI remembers what you've discussed
✅ **Faster Responses**: Less explanation needed
✅ **Coherent Dialogue**: Responses build on previous answers

### For Developers:
✅ **Simple Integration**: Just pass `conversation_id`
✅ **Automatic Management**: History stored and cleaned up automatically
✅ **Debugging Support**: Stats endpoint for monitoring
✅ **Scalable**: In-memory with automatic cleanup

### For System:
✅ **Memory Efficient**: Only stores recent conversations
✅ **Auto-Cleanup**: Old conversations removed automatically
✅ **No Database**: Simple in-memory storage
✅ **Fast Access**: No DB queries needed

## Monitoring

### Check Conversation Stats:
```bash
curl http://localhost:8001/ai/conversations/stats
```

Response:
```json
{
  "total_conversations": 15,
  "total_messages": 127
}
```

### View Conversation in Logs:
```
INFO: Retrieved context for conversation 550e8400-e29b-41d4-a716-446655440000 (8 total messages)
INFO: Added conversation history to RAG context for 550e8400-e29b-41d4-a716-446655440000
```

## Limitations & Considerations

### Current Limitations:
- **In-Memory Only**: Conversations lost on server restart
- **No Persistence**: Not saved to database
- **Single Server**: Won't work with multiple server instances (no shared state)
- **Time-Based Cleanup**: Old conversations automatically deleted after 24 hours

### Future Enhancements:
1. **Database Persistence**: Store conversations in PostgreSQL
2. **Redis Cache**: Share state across multiple servers
3. **User Authentication**: Per-user conversation history
4. **Export/Import**: Save and restore conversations
5. **Search**: Find past conversations by content
6. **Analytics**: Track conversation patterns and quality

### Production Considerations:

**For Small Deployments** (current):
- ✅ In-memory storage is sufficient
- ✅ Fast and simple
- ✅ Auto-cleanup handles memory

**For Large Scale**:
- ❌ Need database persistence
- ❌ Need distributed cache (Redis)
- ❌ Need conversation archiving
- ❌ Need better analytics

## Testing

### Test Conversation Context:
```python
# Test conversation flow
conversation_id = "test-123"

# First message
response1 = await ai_assistant.generate_response(
    "What is SMART on FHIR?",
    conversation_id
)

# Follow-up (should have context from first message)
response2 = await ai_assistant.generate_response(
    "How do I use it?",  # "it" refers to SMART on FHIR
    conversation_id
)

# Check stats
stats = conversation_store.get_stats()
assert stats["total_conversations"] >= 1
assert stats["total_messages"] >= 4  # 2 user + 2 assistant
```

### Test Context Retrieval:
```python
# Add messages
conversation_store.add_message("test-123", "user", "Question 1")
conversation_store.add_message("test-123", "assistant", "Answer 1")
conversation_store.add_message("test-123", "user", "Question 2")
conversation_store.add_message("test-123", "assistant", "Answer 2")

# Get context
context = conversation_store.get_conversation_context("test-123", max_pairs=2)

# Should contain both exchanges
assert "Question 1" in context
assert "Answer 1" in context
assert "Question 2" in context
assert "Answer 2" in context
```

## Troubleshooting

### Conversation Not Remembered?
- Check if `conversation_id` is being passed correctly
- Verify conversation ID is consistent across requests
- Check logs for context retrieval messages

### Memory Issues?
- Reduce `max_age_hours` for more aggressive cleanup
- Reduce `max_pairs` in context building
- Monitor with `/ai/conversations/stats`

### Context Too Long?
- Reduce `max_pairs` from 3 to 2 or 1
- Conversation history consumes token budget
- Balance between context and document space

## Summary

The conversation history feature transforms the AI assistant from a **stateless Q&A system** into a **context-aware conversational agent**. By maintaining conversation history and integrating it with the RAG knowledge base, users can have natural, multi-turn conversations without constantly repeating context.

**Key Points**:
- 🔄 **Automatic**: Conversations tracked automatically by ID
- 💾 **Persistent**: Frontend messages saved in localStorage
- 🧠 **Intelligent**: Backend combines conversation + knowledge base
- 🧹 **Self-Cleaning**: Old conversations auto-deleted
- 📊 **Monitorable**: Stats endpoint for debugging

The implementation is production-ready for **small to medium deployments** and provides a solid foundation for scaling to database-backed persistence when needed.
