import { AiApi, Configuration } from './api-client';
import type { PostAiChatRequest, PostAiChat200Response } from './api-client';

// Types for the AI assistant
export interface DocumentChunk {
  id: string;
  content: string;
  source: string;
  title: string;
  category: string;
  relevanceScore?: number;
}

export interface RAGResponse {
  answer: string;
  sources: DocumentChunk[];
  confidence: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  sources?: DocumentChunk[];
  streaming?: boolean; // Indicates if message is still being streamed
}

export interface StreamChunk {
  type: 'sources' | 'content' | 'done' | 'error';
  sources?: DocumentChunk[];
  content?: string;
  mode?: string;
  confidence?: number;
  error?: string;
}

class SmartOnFHIRAIAssistant {
  private backendAvailable: boolean | null = null; // null = not checked, true = available, false = unavailable
  private aiApi: AiApi; // Generated API client for backend AI
  
  constructor() {
    // Initialize the AI API client with empty base path (uses relative URLs that Vite proxies to backend)
    const apiConfig = new Configuration({
      basePath: '', // Empty base path means relative URLs (e.g., /ai/chat)
    });
    this.aiApi = new AiApi(apiConfig);
  }

  /**
   * Check if backend AI API is available
   */
  private async checkBackendAvailability(): Promise<boolean> {
    // Use cached value if already checked
    if (this.backendAvailable !== null) {
      return this.backendAvailable;
    }

    try {
      // Try to reach the backend AI endpoint with a quick timeout
      const response = await fetch('/ai/chat', {
        method: 'HEAD',
        signal: AbortSignal.timeout(2000)
      });
      this.backendAvailable = response.ok || response.status === 503; // 503 means endpoint exists but MCP is down
      return this.backendAvailable;
    } catch (error) {
      console.warn('Backend AI API not available:', error);
      this.backendAvailable = false;
      return false;
    }
  }

  /**
   * Call backend AI API using generated client
   */
  private async callBackendAI(message: string, conversationId?: string): Promise<PostAiChat200Response> {
    const request: PostAiChatRequest = {
      message,
      conversationId
    };

    try {
      const response = await this.aiApi.postAiChat({ postAiChatRequest: request });
      return response;
    } catch (error) {
      // Re-throw with more context
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Backend AI API error: ${errorMessage}`);
    }
  }

  /**
   * Check if OpenAI is available (via backend)
   */
  async isOpenAIAvailable(): Promise<boolean> {
    return await this.checkBackendAvailability();
  }

  /**
   * Generate AI response using backend API
   */
  async generateResponse(userMessage: string, conversationId?: string): Promise<RAGResponse> {
    // Check if backend is available
    const isBackendAvailable = await this.checkBackendAvailability();
    
    if (!isBackendAvailable) {
      return {
        answer: "⚠️ AI Assistant service is currently unavailable. Please try again later or contact your administrator.",
        sources: [],
        confidence: 0.0
      };
    }

    try {
      // Call backend AI API
      const backendResponse = await this.callBackendAI(userMessage, conversationId);
      
      // Map backend response to RAGResponse format
      return {
        answer: backendResponse.answer,
        sources: backendResponse.sources,
        confidence: backendResponse.confidence
      };
    } catch (error) {
      console.error('Backend AI API call failed:', error);
      
      // Return error message
      return {
        answer: "❌ I'm sorry, I encountered an error processing your request. Please try again or contact your administrator if the problem persists.",
        sources: [],
        confidence: 0.0
      };
    }
  }

  /**
   * Generate AI response with streaming support
   */
  async *generateResponseStream(userMessage: string, conversationId?: string): AsyncGenerator<StreamChunk> {
    // Check if backend is available
    const isBackendAvailable = await this.checkBackendAvailability();
    
    if (!isBackendAvailable) {
      yield {
        type: 'content',
        content: "⚠️ AI Assistant service is currently unavailable. Please try again later or contact your administrator."
      };
      yield {
        type: 'done',
        mode: 'error',
        confidence: 0.0
      };
      return;
    }

    try {
      const response = await fetch('/ai/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream'
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId
        }),
        signal: AbortSignal.timeout(60000) // 60s timeout for streaming
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            
            if (data.trim()) {
              try {
                const chunk: StreamChunk = JSON.parse(data);
                yield chunk;
              } catch (e) {
                console.warn('Failed to parse SSE data:', data, e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming AI request failed:', error);
      
      // Provide user-friendly error message based on error type
      let errorMessage = 'I encountered an issue processing your request. Please try again.';
      
      if (error instanceof Error) {
        const errorStr = error.message.toLowerCase();
        
        if (errorStr.includes('timeout') || errorStr.includes('timed out')) {
          errorMessage = 'The request took too long to complete. Please try again with a shorter question.';
        } else if (errorStr.includes('network') || errorStr.includes('failed to fetch')) {
          errorMessage = 'Unable to connect to the AI service. Please check your connection and try again.';
        } else if (errorStr.includes('aborted')) {
          errorMessage = 'The request was cancelled. Please try again.';
        }
        
        // Log full error details for debugging (but don't show to user)
        console.error('Full error details:', {
          message: error.message,
          stack: error.stack
        });
      }
      
      yield {
        type: 'error',
        error: errorMessage
      };
    }
  }

  /**
   * Start a new conversation
   */
  async startConversation(): Promise<ChatMessage[]> {
    return [
      {
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
      }
    ];
  }

  /**
   * Add message to conversation and get AI response
   */
  async chat(
    messages: ChatMessage[],
    userMessage: string,
    conversationId?: string
  ): Promise<ChatMessage[]> {
    // Add user message
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    // Get AI response
    const response = await this.generateResponse(userMessage, conversationId);

    // Add AI response
    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'agent',
      content: response.answer,
      timestamp: new Date(),
      sources: response.sources
    };

    return [...messages, userMsg, aiMsg];
  }
}

// Export singleton instance
export const aiAssistant = new SmartOnFHIRAIAssistant();
