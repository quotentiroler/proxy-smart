# AI Chat Persistence Implementation

## Overview
The AI Chat component now fully persists conversation history, state, and settings across page refreshes and browser sessions using Zustand with localStorage persistence. Additionally, the backend maintains conversation context to provide **context-aware AI responses**.

> **📚 Related Documentation**: See [AI_CONVERSATION_HISTORY.md](./AI_CONVERSATION_HISTORY.md) for details on backend conversation tracking and context-aware responses.

## Architecture

### Frontend Persistence (localStorage)
- Chat messages stored locally in the browser
- Survives page refreshes and browser restarts
- Managed by Zustand store with persist middleware

### Backend Context (In-Memory)
- Conversation history maintained on the server
- Enables context-aware AI responses
- Automatic cleanup of old conversations

## Changes Made

### 1. New Store: `aiChatStore.ts`
Created a new Zustand store at `ui/src/stores/aiChatStore.ts` that manages:

- **Chat Messages**: Full conversation history with proper date serialization
- **Conversation ID**: Unique identifier for each chat session
- **UI State**: Minimized/expanded state and open/closed state
- **Actions**: Methods to add, update, clear messages, and reset the chat

#### Key Features:
- ✅ **Persistent Storage**: Uses localStorage via Zustand's persist middleware
- ✅ **Date Handling**: Properly serializes/deserializes Date objects to/from ISO strings
- ✅ **Type Safety**: Full TypeScript support with proper ChatMessage types
- ✅ **State Management**: Centralized state accessible across components

### 2. Updated Component: `AIChatOverlay.tsx`
Refactored the AI chat overlay component to use the persistent store:

#### Changes:
- **Removed local state** for chat messages (previously in `useState`)
- **Integrated store hooks** from `useAIChatStore`
- **Added Clear Chat button** with reset functionality
- **Conversation ID management** - automatically generates and persists conversation IDs
- **Improved open/close handling** - supports both external and internal state control

#### New Features:
- 🔄 **Clear Chat Button**: Resets conversation history and generates new conversation ID
- 💾 **Persistent Messages**: All chat messages survive page refreshes
- 🆔 **Conversation Tracking**: Each chat session has a unique ID for backend tracking
- 🎨 **UI State Persistence**: Minimized/expanded state persists across sessions

### 3. Store Integration Pattern
The implementation follows the same pattern as other stores in the application:

```typescript
// Similar to authStore, appStore, smartStore
export const useAIChatStore = create<AIChatState>()(
  persist(
    (set, get) => ({
      // State and actions
    }),
    {
      name: 'ai-chat-store',
      storage: createJSONStorage(() => localStorage),
      // Custom serialization logic
    }
  )
);
```

## Benefits

### User Experience
- 📜 **Conversation History**: Users can close and reopen the chat without losing context
- 🔄 **Session Recovery**: Page refreshes don't interrupt ongoing conversations
- 🎯 **Consistency**: Chat state (minimized/expanded) persists as expected

### Development
- 🧩 **Modular**: Chat state is now decoupled from component lifecycle
- 🧪 **Testable**: Store can be tested independently from React components
- 🔍 **Debuggable**: Zustand DevTools support for state inspection

### Backend Integration
- 🆔 **Conversation Tracking**: Unique conversation IDs enable backend session management
- 📊 **Analytics**: Persistent IDs allow for better conversation analytics
- 🔗 **Context Preservation**: Backend can maintain context across user sessions
- 🧠 **Smart Responses**: AI remembers conversation history for better answers

> **💡 Tip**: The backend automatically stores and retrieves conversation context. You just need to ensure the `conversationId` is passed correctly from the frontend.

## Usage

### Accessing Chat State
```typescript
import { useAIChatStore } from '@/stores/aiChatStore';

// In any component
const { messages, addMessage, clearMessages } = useAIChatStore();
```

### Managing Conversations
```typescript
// Get current conversation ID
const { conversationId } = useAIChatStore();

// Reset chat (new conversation)
const { resetChat } = useAIChatStore();
resetChat(); // Clears messages and generates new ID
```

### UI State Control
```typescript
// Control chat open/close state
const { isOpen, setIsOpen } = useAIChatStore();
setIsOpen(true); // Open chat

// Control minimize state
const { isMinimized, setIsMinimized } = useAIChatStore();
setIsMinimized(true); // Minimize chat
```

## Technical Details

### Storage Structure
```json
{
  "state": {
    "messages": [
      {
        "id": "uuid",
        "type": "agent|user",
        "content": "message text",
        "timestamp": "2025-10-12T10:30:00.000Z",
        "sources": [...],
        "streaming": false
      }
    ],
    "conversationId": "uuid",
    "isMinimized": false,
    "isOpen": false
  },
  "version": 0
}
```

### Date Serialization
- **Serialization**: Converts Date objects to ISO strings before storing
- **Deserialization**: Converts ISO strings back to Date objects on load
- **Type Safety**: Maintains TypeScript types throughout the process

## Future Enhancements

Potential improvements for future iterations:

1. **Conversation History**: Store multiple conversation sessions
2. **Search**: Search through past conversations
3. **Export**: Export chat history as text/JSON
4. **Cloud Sync**: Sync conversations across devices (if backend supports it)
5. **Message Editing**: Edit or delete specific messages
6. **Favorites**: Mark and save important conversations

## Migration Notes

### Breaking Changes
- Chat messages are no longer lost on component unmount
- Conversation IDs are now persistent and tracked

### Backward Compatibility
- Old sessions without stored chat data will initialize with default welcome message
- No data migration needed - fresh state is created on first load

## Testing Recommendations

1. **Persistence Test**: 
   - Send messages
   - Refresh page
   - Verify messages persist

2. **Clear Chat Test**:
   - Send messages
   - Click clear button
   - Verify new conversation ID is generated

3. **Multi-Tab Test**:
   - Open chat in multiple tabs
   - Verify state synchronization

4. **Storage Limit Test**:
   - Send many messages
   - Verify localStorage doesn't exceed limits
