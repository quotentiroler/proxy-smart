import { Elysia } from 'elysia'
import { config } from '../../config'
import { logger } from '../../lib/logger'
import { ErrorResponse, ChatRequestSchema, ChatResponseSchema } from '../../schemas/common'

type ChatRequestPayload = {
  message: string
  conversationId?: string
  pageContext?: string
}

type McpChatRequest = {
  message: string
  conversation_id?: string
  page_context?: string
}

type McpDocumentChunk = {
  id: string
  content: string
  source: string
  title: string
  category: string
  relevance_score?: number
}

type McpChatResponse = {
  answer: string
  sources: McpDocumentChunk[]
  confidence: number
  mode: 'openai' | 'rule-based'
  timestamp: string
}

async function callMcpChatApi(payload: ChatRequestPayload): Promise<McpChatResponse> {
  const mcpRequest: McpChatRequest = {
    message: payload.message,
    conversation_id: payload.conversationId,
    page_context: payload.pageContext
  }

  const response = await fetch(config.ai.chatEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(mcpRequest),
    signal: AbortSignal.timeout(config.ai.timeoutMs)
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unable to read MCP error body')
    throw new Error(`MCP server responded with ${response.status}: ${errorBody}`)
  }

  return await response.json() as McpChatResponse
}

type ChatRouteContext = {
  body: ChatRequestPayload
  set: { status?: number | string }
}

export const aiRoutes = new Elysia({ prefix: '/ai', tags: ['ai'] })
  .head('/chat', async ({ set }) => {
    try {
      if (!config.ai.baseUrl) {
        set.status = 503
        return
      }

      const response = await fetch(config.ai.healthEndpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json'
        },
        signal: AbortSignal.timeout(Math.min(config.ai.timeoutMs, 5000))
      })

      if (response.ok) {
        set.status = 200
      } else {
        logger.server.warn('AI assistant health check failed', {
          status: response.status,
          statusText: response.statusText
        })
        set.status = response.status === 404 ? 503 : response.status
      }
    } catch (error) {
      logger.server.warn('Failed to reach AI assistant health endpoint', {
        error: error instanceof Error ? {
          message: error.message,
          name: error.name
        } : String(error)
      })
      set.status = 503
    }
  }, {
    detail: {
      summary: 'Check AI assistant availability',
      description: 'Returns 200 when the AI assistant backend is reachable.'
    }
  })
  .post('/chat', async ({ body, set }: ChatRouteContext): Promise<McpChatResponse | { error: string }> => {
    if (!config.ai.baseUrl) {
      set.status = 503
      return { error: 'AI assistant service is not configured' }
    }

    try {
      const result = await callMcpChatApi(body)
      return result
    } catch (error) {
      logger.server.error('Failed to proxy AI chat request', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : String(error)
      })
      set.status = 502
      return { error: error instanceof Error ? error.message : 'Unknown error while contacting AI assistant' }
    }
  }, {
    body: ChatRequestSchema,
    response: {
      200: ChatResponseSchema,
      400: ErrorResponse,
      502: ErrorResponse,
      503: ErrorResponse
    },
    detail: {
      summary: 'Proxy AI assistant chat request',
      description: 'Forwards chat prompts to the MCP AI assistant server and returns enriched responses.',
      tags: ['ai']
    }
  })
  .post('/chat/stream', async ({ body, set }) => {
    if (!config.ai.baseUrl) {
      set.status = 503
      return { error: 'AI assistant service is not configured' }
    }

    try {
      const mcpRequest: McpChatRequest = {
        message: body.message,
        conversation_id: body.conversationId,
        page_context: body.pageContext
      }

      const streamEndpoint = `${config.ai.baseUrl}/ai/chat/stream`
      
      const response = await fetch(streamEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream'
        },
        body: JSON.stringify(mcpRequest),
        signal: AbortSignal.timeout(config.ai.timeoutMs)
      })

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Unable to read MCP error body')
        throw new Error(`MCP server responded with ${response.status}: ${errorBody}`)
      }

      // Set headers for SSE streaming
      set.headers = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
      }

      // Return the stream directly
      return response.body
    } catch (error) {
      logger.server.error('Failed to proxy AI streaming chat request', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : String(error)
      })
      set.status = 502
      return { error: error instanceof Error ? error.message : 'Unknown error while contacting AI assistant' }
    }
  }, {
    body: ChatRequestSchema,
    detail: {
      summary: 'Proxy AI assistant streaming chat request',
      description: 'Forwards chat prompts to the MCP AI assistant server and streams the response using Server-Sent Events (SSE).',
      tags: ['ai']
    }
  })

