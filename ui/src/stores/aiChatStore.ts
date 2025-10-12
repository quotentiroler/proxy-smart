import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ChatMessage } from '../lib/ai-assistant';

interface AIChatState {
  // Chat state
  messages: ChatMessage[];
  conversationId: string | null;
  isMinimized: boolean;
  isOpen: boolean;
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  clearMessages: () => void;
  setConversationId: (id: string | null) => void;
  setIsMinimized: (minimized: boolean) => void;
  setIsOpen: (open: boolean) => void;
  resetChat: () => void;
}

const getInitialMessage = (): ChatMessage => ({
  id: crypto.randomUUID(),
  type: 'agent',
  content: `👋 Hello! I'm your SMART on FHIR platform assistant. I can help you with:

📊 **Dashboard** - System overview and monitoring
👥 **User Management** - Healthcare users and FHIR associations  
📱 **SMART Apps** - Application registration and management
🏥 **FHIR Servers** - Server configuration and health
🔑 **Identity Providers** - Authentication setup
🎯 **Scope Management** - Permissions and access control
🚀 **Launch Context** - Clinical workflow contexts
📈 **OAuth Monitoring** - Real-time flow analytics

What would you like to know more about?`,
  timestamp: new Date(),
  sources: []
});

export const useAIChatStore = create<AIChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      messages: [getInitialMessage()],
      conversationId: null,
      isMinimized: false,
      isOpen: false,

      // Actions
      addMessage: (message) => {
        const { messages } = get();
        set({ messages: [...messages, message] });
      },

      updateMessage: (id, updates) => {
        const { messages } = get();
        set({
          messages: messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        });
      },

      clearMessages: () => {
        set({ messages: [getInitialMessage()] });
      },

      setConversationId: (id) => {
        set({ conversationId: id });
      },

      setIsMinimized: (minimized) => {
        set({ isMinimized: minimized });
      },

      setIsOpen: (open) => {
        set({ isOpen: open });
      },

      resetChat: () => {
        set({
          messages: [getInitialMessage()],
          conversationId: null,
          isMinimized: false,
        });
      },
    }),
    {
      name: 'ai-chat-store',
      storage: createJSONStorage(() => localStorage),
      // Serialize dates properly
      partialize: (state) => ({
        messages: state.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        })),
        conversationId: state.conversationId,
        isMinimized: state.isMinimized,
        isOpen: state.isOpen,
      }),
      // Deserialize dates back to Date objects
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.messages = state.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp as unknown as string),
          }));
        }
      },
    }
  )
);
