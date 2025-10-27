import { t, type Static } from 'elysia'

/**
 * AI Assistant schemas for chat and documentation assistance
 * 
 * Aligned with v2 function calling schemas
 */

export const ChatRequest = t.Object({
  message: t.String({ 
    minLength: 1, 
    description: 'User message/question' 
  }),
  conversationId: t.Optional(t.String({ 
    description: 'Conversation ID for multi-turn context' 
  })),
  pageContext: t.Optional(t.String({ 
    description: 'Current page/UI context (e.g., "Healthcare Users Page")' 
  })),
  maxTools: t.Optional(t.Number({ 
    minimum: 0, 
    maximum: 10,
    default: 5,
    description: 'Maximum number of tool calls per request' 
  })),
  model: t.Optional(t.String({ 
    description: 'AI model to use (e.g., gpt-4o, gpt-5-nano)',
    default: 'gpt-5-nano'
  })),
  streaming: t.Optional(t.Boolean({ 
    description: 'Enable streaming mode for real-time responses',
    default: true
  }))
}, { title: 'ChatRequest' })

export const DocumentChunk = t.Object({
  id: t.String({ description: 'Document chunk ID' }),
  content: t.String({ description: 'Document content' }),
  source: t.String({ description: 'Source document/file' }),
  title: t.String({ description: 'Document title' }),
  category: t.String({ description: 'Document category' }),
  relevance_score: t.Optional(t.Number({ description: 'Relevance score (0-1)' }))
}, { title: 'DocumentChunk' })

export const ToolExecution = t.Object({
  toolName: t.String({ description: 'Name of the tool that was called' }),
  toolCallId: t.String({ description: 'Unique ID for this tool call' }),
  status: t.Union([
    t.Literal('started'),
    t.Literal('completed'),
    t.Literal('failed')
  ], { description: 'Tool execution status' }),
  duration: t.Optional(t.Number({ 
    description: 'Execution time in milliseconds' 
  })),
  error: t.Optional(t.String({ 
    description: 'Error message if tool execution failed' 
  }))
}, { title: 'ToolExecution' })

export const ChatResponse = t.Object({
  answer: t.String({ description: 'AI-generated response' }),
  conversationId: t.String({ description: 'Conversation ID for follow-up' }),
  model: t.String({ description: 'Model used (e.g., gpt-5-mini)' }),
  sources: t.Optional(t.Array(DocumentChunk, { 
    description: 'RAG source documents used (optional for internal AI)' 
  })),
  toolsUsed: t.Optional(t.Array(ToolExecution, { 
    description: 'Details of all tools called during this request' 
  })),
  totalDuration: t.Optional(t.Number({ 
    description: 'Total request duration in milliseconds' 
  })),
  tokensUsed: t.Optional(t.Object({
    inputTokens: t.Number({ description: 'Input/prompt tokens' }),
    outputTokens: t.Number({ description: 'Output/completion tokens' }),
    reasoningTokens: t.Optional(t.Number({ description: 'Reasoning tokens (for o1 models)' })),
    totalTokens: t.Number({ description: 'Total tokens' })
  }, { description: 'Token usage statistics (AI SDK format)' })),
  timestamp: t.String({ description: 'Response timestamp (ISO 8601)' })
}, { title: 'ChatResponse' })

/**
 * AI health endpoint response
 */
export const AiHealthResponse = t.Object({}, { 
  additionalProperties: true,
  title: 'AiHealthResponse',
  description: 'AI assistant health status including OpenAI availability'
})

/**
 * AI health error response
 */
export const AiHealthErrorResponse = t.Object({
  error: t.String({ description: 'Error message' })
}, { title: 'AiHealthErrorResponse' })

/**
 * SSE stream chunk types for AI chat streaming
 * 
 * Aligned with v2 while maintaining RAG-specific events
 */
export const StreamChunk = t.Union([
  // Content chunk - streaming text response
  t.Object({
    type: t.Literal('content'),
    content: t.String({ description: 'Partial text content' })
  }),
  
  // Sources event - provides relevant RAG documents (v1 specific)
  t.Object({
    type: t.Literal('sources'),
    sources: t.Array(DocumentChunk, { description: 'RAG source documents' })
  }),
  
  // Tool call started
  t.Object({
    type: t.Literal('tool_call_started'),
    toolName: t.String({ description: 'Tool being called' }),
    toolCallId: t.String({ description: 'Tool call ID' }),
    timestamp: t.String({ description: 'When tool call started' })
  }),
  
  // Tool call completed
  t.Object({
    type: t.Literal('tool_call_completed'),
    toolName: t.String({ description: 'Tool that completed' }),
    toolCallId: t.String({ description: 'Tool call ID' }),
    success: t.Boolean({ description: 'Whether tool call succeeded' }),
    duration: t.Optional(t.Number({ description: 'Execution time in ms' })),
    error: t.Optional(t.String({ description: 'Error message if failed' }))
  }),
  
  // Reasoning chunk (for o1 models with reasoning tokens)
  t.Object({
    type: t.Literal('reasoning'),
    content: t.String({ description: 'AI reasoning/thinking process' })
  }),
  
  // Reasoning done event - marks end of reasoning phase
  t.Object({
    type: t.Literal('reasoning_done')
  }),
  
  // Token usage update
  t.Object({
    type: t.Literal('usage'),
    tokensUsed: t.Object({
      inputTokens: t.Number(),
      outputTokens: t.Number(),
      reasoningTokens: t.Optional(t.Number()),
      totalTokens: t.Number()
    })
  }),
  
  // Done event - marks end of stream
  t.Object({
    type: t.Literal('done'),
    conversationId: t.String({ description: 'Conversation ID' }),
    totalDuration: t.Optional(t.Number({ description: 'Total request time in ms' })),
    toolsUsed: t.Optional(t.Number({ description: 'Number of tools called' }))
  }),
  
  // Error event - indicates an error occurred
  t.Object({
    type: t.Literal('error'),
    error: t.String({ description: 'Error message' }),
    code: t.Optional(t.String({ description: 'Error code' }))
  })
], { 
  title: 'StreamChunk',
  description: 'Individual chunk in the SSE stream - supports both RAG sources and function calling'
})

/**
 * SSE stream response (generic container for streaming endpoints)
 */
export const AiStreamResponse = t.Object({}, { 
  additionalProperties: true,
  title: 'AiStreamResponse',
  description: 'Server-sent events stream response containing StreamChunk events'
})

// TypeScript type inference helpers
export type ChatRequestType = Static<typeof ChatRequest>
export type DocumentChunkType = Static<typeof DocumentChunk>
export type ToolExecutionType = Static<typeof ToolExecution>
export type ChatResponseType = Static<typeof ChatResponse>
export type StreamChunkType = Static<typeof StreamChunk>
export type AiHealthResponseType = Static<typeof AiHealthResponse>
export type AiHealthErrorResponseType = Static<typeof AiHealthErrorResponse>
export type AiStreamResponseType = Static<typeof AiStreamResponse>
