import { t, type Static } from 'elysia'

/**
 * AI Assistant schemas for chat and documentation assistance
 */

export const ChatRequest = t.Object({
  message: t.String({ minLength: 1, description: 'User message/question' }),
  conversationId: t.Optional(t.String({ description: 'Conversation ID for context' })),
  pageContext: t.Optional(t.String({ description: 'Current page context' }))
}, { title: 'ChatRequest' })

export const DocumentChunk = t.Object({
  id: t.String({ description: 'Document chunk ID' }),
  content: t.String({ description: 'Document content' }),
  source: t.String({ description: 'Source document/file' }),
  title: t.String({ description: 'Document title' }),
  category: t.String({ description: 'Document category' }),
  relevance_score: t.Optional(t.Number({ description: 'Relevance score (0-1)' }))
}, { title: 'DocumentChunk' })

export const ChatResponse = t.Object({
  answer: t.String({ description: 'AI-generated answer' }),
  sources: t.Array(DocumentChunk, { description: 'Source documents used' }),
  confidence: t.Number({ description: 'Confidence score (0-1)' }),
  mode: t.Union([
    t.Literal('openai'),
    t.Literal('rule-based')
  ], { description: 'Response generation mode' }),
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
 */
export const StreamChunk = t.Union([
  // Sources event - provides relevant documents
  t.Object({
    type: t.Literal('sources'),
    sources: t.Array(DocumentChunk),
    mode: t.Optional(t.String()),
    confidence: t.Optional(t.Number())
  }),
  // Content event - streams response text
  t.Object({
    type: t.Literal('content'),
    content: t.String()
  }),
  // Reasoning event - streams AI reasoning/thinking process
  t.Object({
    type: t.Literal('reasoning'),
    content: t.String()
  }),
  // Reasoning done event - marks end of reasoning phase
  t.Object({
    type: t.Literal('reasoning_done')
  }),
  // Function calling event - indicates function being called
  t.Object({
    type: t.Literal('function_calling'),
    name: t.String()
  }),
  // Done event - marks end of stream
  t.Object({
    type: t.Literal('done'),
    mode: t.Optional(t.String()),
    confidence: t.Optional(t.Number())
  }),
  // Error event - indicates an error occurred
  t.Object({
    type: t.Literal('error'),
    error: t.String()
  })
], { 
  title: 'StreamChunk',
  description: 'Individual chunk in the SSE stream - can be sources, content, reasoning, function call, done, or error'
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
export type ChatResponseType = Static<typeof ChatResponse>
export type StreamChunkType = Static<typeof StreamChunk>
export type AiHealthResponseType = Static<typeof AiHealthResponse>
export type AiHealthErrorResponseType = Static<typeof AiHealthErrorResponse>
export type AiStreamResponseType = Static<typeof AiStreamResponse>
