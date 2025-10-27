import { Elysia } from 'elysia'
import { logger } from '../../lib/logger'
import { ErrorResponse } from '../../schemas'
import { 
  AiHealthResponse, 
  AiHealthErrorResponse, 
  AiStreamResponse, 
  ChatRequest, 
  ChatResponse,
  type AiHealthResponseType,
  type AiHealthErrorResponseType,
  type DocumentChunkType,
  type ChatResponseType,
  type ChatRequestType
} from '@/schemas/ai-assistant'
import { validateToken } from '@/lib/auth'
import type { JwtPayload } from 'jsonwebtoken'
import { config } from '../../config'

type ChatRouteContext = {
  body: ChatRequestType
  set: { status?: number | string }
  headers: Record<string, string | undefined>
}

// Keycloak-flavored OIDC JWT payload shape (subset)
type KeycloakJwtPayload = JwtPayload & {
  scope?: string | string[]
  scp?: string | string[]
  email?: string
  realm_access?: { roles?: string[] }
  resource_access?: Record<string, { roles?: string[] }>
}

// Public AI health check routes (no authentication required)
export const aiPublicRoutes = new Elysia({ prefix: '/ai', tags: ['ai'] })
  .get('/health', async ({ set }): Promise<AiHealthResponseType | AiHealthErrorResponseType> => {
    try {
      // Probe MCP server health
      const base = config.ai.baseUrl
      if (!base) {
        set.status = 503
        return { error: 'MCP server URL not configured' }
      }
      const res = await fetch(`${base.replace(/\/$/, '')}/health`, { method: 'GET', signal: AbortSignal.timeout(3000) })
      if (!res.ok) {
        set.status = 503
        return { error: `MCP server health check failed (${res.status})` }
      }
      // Pass-through minimal shape; schema allows additional properties
      const json = await res.json().catch(() => ({}))
      set.status = 200
      return json as AiHealthResponseType
    } catch (error) {
      logger.server.warn('AI assistant health check failed', {
        error: error instanceof Error ? { message: error.message, name: error.name } : String(error)
      })
      set.status = 503
      return { error: 'AI assistant health check failed' }
    }
  }, {
    response: {
      200: AiHealthResponse,
      503: AiHealthErrorResponse
    },
    detail: {
      summary: 'Get AI assistant health status',
      description: 'Returns health status of the MCP server.'
    }
  })
  .head('/chat', async ({ set }): Promise<void> => {
    try {
      const base = config.ai.baseUrl
      if (!base) { set.status = 503; return }
      const res = await fetch(`${base.replace(/\/$/, '')}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) })
      set.status = res.ok ? 200 : 503
    } catch (error) {
      logger.server.warn('AI assistant HEAD /chat failed', {
        error: error instanceof Error ? { message: error.message, name: error.name } : String(error)
      })
      set.status = 503
    }
  }, {
    detail: {
      summary: 'Check AI assistant availability',
      description: 'Returns 200 when the AI assistant backend is reachable.'
    }
  })

// Protected AI routes (authentication required)
export const aiRoutes = new Elysia({ prefix: '/ai', tags: ['ai'] })
  .post('/chat', async ({ body, set, headers }: ChatRouteContext): Promise<ChatResponseType | { error: string }> => {
    // Ensure MCP base URL
    const base = config.ai.baseUrl
    if (!base) { set.status = 503; return { error: 'MCP server URL not configured' } }

    try {
      // Debug: log what we received
      logger.server.info('[External AI Proxy] Received POST /admin/ai/chat request', {
        hasMessage: typeof body?.message === 'string',
        hasConversationId: typeof body?.conversationId === 'string',
        hasModel: typeof body?.model === 'string',
        hasStreaming: typeof body?.streaming === 'boolean',
        authHeader: headers.authorization ? 'present' : 'missing'
      })
      
      // Authenticate via Authorization header (Bearer token)
      const authHeader = headers.authorization || headers.Authorization
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
      if (!token) { set.status = 401; return { error: 'Authentication required' } }

      // Validate token minimally (we forward it to MCP as user_token)
      const payload = (await validateToken(token)) as KeycloakJwtPayload
      // Use sub if available, fallback to preferred_username (common in Keycloak admin tokens)
      const userId = (payload.sub || payload.preferred_username) as string | undefined
      if (!userId) { set.status = 401; return { error: 'Invalid token: subject missing' } }

      // Build MCP ChatRequest (snake_case + user_token)
      const mcpBody = {
        message: body.message,
        conversation_id: body.conversationId,
        page_context: body.pageContext,
        user_token: token,
        max_tools: body.maxTools ?? 5,
        model: body.model,
        streaming: body.streaming
      }

      const res = await fetch(`${base.replace(/\/$/, '')}/ai/chat`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify(mcpBody),
        signal: AbortSignal.timeout(config.ai.timeoutMs)
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        logger.server.error(`MCP /ai/chat failed: ${res.status} ${text}`)
        set.status = 502
        return { error: `Upstream MCP error (${res.status})` }
      }

      type UpstreamTool = { tool_name?: string; tool_call_id?: string; status?: 'started'|'completed'|'failed'; duration?: number; error?: string }
      type UpstreamTokens = { 
        inputTokens: number;
        outputTokens: number;
        reasoningTokens?: number;
        totalTokens: number;
      }
      type UpstreamChatResponse = {
        answer?: string
        conversation_id?: string
        model?: string
        sources?: unknown
        tools_used?: unknown
        total_duration?: number
        tokens_used?: UpstreamTokens
        timestamp?: string
      }

      const jsonUnknown: unknown = await res.json().catch(() => null)
      if (!jsonUnknown || typeof jsonUnknown !== 'object') { set.status = 502; return { error: 'Invalid MCP response' } }
      const json = jsonUnknown as UpstreamChatResponse

      logger.server.debug('[External AI Proxy] Upstream /ai/chat payload', {
        answerLength: typeof json.answer === 'string' ? json.answer.length : undefined,
        conversationId: json.conversation_id,
        model: json.model,
        totalDuration: json.total_duration,
        tokensUsed: json.tokens_used,
        sourcesCount: Array.isArray(json.sources) ? json.sources.length : undefined,
        toolsUsedCount: Array.isArray(json.tools_used) ? json.tools_used.length : undefined,
      })

      // Helpers
  const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
      const isDoc = (v: unknown): v is DocumentChunkType => {
        if (!isRecord(v)) return false
        return typeof v.id === 'string' && typeof v.content === 'string' && typeof v.source === 'string' && typeof v.title === 'string' && typeof v.category === 'string'
      }

      // Map snake_case -> camelCase ChatResponse
      const mapped: ChatResponseType = {
        answer: json.answer ?? '',
        conversationId: json.conversation_id || body.conversationId || crypto.randomUUID(),
        model: json.model || 'unknown',
        sources: Array.isArray(json.sources) ? (json.sources as unknown[]).filter(isDoc) : [],
        toolsUsed: Array.isArray(json.tools_used)
          ? (json.tools_used as UpstreamTool[]).map((t) => ({
              toolName: t.tool_name ?? '',
              toolCallId: t.tool_call_id ?? crypto.randomUUID(),
              status: (t.status ?? 'completed') as 'started'|'completed'|'failed',
              duration: typeof t.duration === 'number' ? t.duration : undefined,
              error: t.error,
            }))
          : undefined,
        totalDuration: typeof json.total_duration === 'number' ? json.total_duration : undefined,
        tokensUsed: json.tokens_used && typeof json.tokens_used === 'object'
          ? {
              inputTokens: json.tokens_used.inputTokens || 0,
              outputTokens: json.tokens_used.outputTokens || 0,
              reasoningTokens: json.tokens_used.reasoningTokens,
              totalTokens: json.tokens_used.totalTokens || 0,
            }
          : undefined,
        timestamp: json.timestamp ? new Date(json.timestamp).toISOString() : new Date().toISOString(),
      }

      return mapped
    } catch (error) {
      logger.server.error('Failed to proxy AI v1 chat request to MCP', {
        error: error instanceof Error ? { message: error.message, stack: error.stack, name: error.name } : String(error)
      })
      set.status = 500
      return { error: error instanceof Error ? error.message : 'Unknown error while processing AI request' }
    }
  }, {
    body: ChatRequest,
    response: {
      200: ChatResponse,
      400: ErrorResponse,
      401: ErrorResponse,
      500: ErrorResponse,
      503: ErrorResponse
    },
    detail: {
      summary: 'AI assistant chat request (proxy)',
      description: 'Proxies to the Python MCP server /ai/chat and maps response to backend schema.',
      tags: ['ai']
    }
  })
  .post('/chat/stream', async ({ body, set, headers }): Promise<Response | { error: string }> => {
    const reqId = crypto.randomUUID()
    // Ensure MCP base URL
    const base = config.ai.baseUrl
    if (!base) {
      logger.server.error('[External AI Proxy] MCP server URL not configured', { reqId })
      set.status = 503
      return { error: 'MCP server URL not configured' }
    }

    try {
      // Authenticate via Authorization header (Bearer token)
      const authHeader = headers.authorization || headers.Authorization
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
      if (!token) {
        logger.server.warn('[External AI Proxy] No auth token provided', { reqId })
        set.status = 401
        return { error: 'Authentication required' }
      }

      // Validate token minimally
      const payload = (await validateToken(token)) as KeycloakJwtPayload
      // Use sub if available, fallback to preferred_username (common in Keycloak admin tokens)
      const userId = (payload.sub || payload.preferred_username) as string | undefined
      if (!userId) {
        logger.server.warn('[External AI Proxy] Token has no userId', { reqId })
        set.status = 401
        return { error: 'Invalid token: subject missing' }
      }

      // Build MCP ChatRequest (snake_case + user_token)
      const mcpBody = {
        message: body.message,
        conversation_id: body.conversationId,
        page_context: body.pageContext,
        user_token: token,
        max_tools: body.maxTools ?? 5,
        model: body.model,
        streaming: body.streaming
      }

      // Call MCP streaming endpoint
      // Use longer timeout for streaming with tools (multi-turn function calling can take time)
      // Minimum 90 seconds to accommodate:
      // - TURN 1: Initial response + tool calls (5-15s)
      // - Tool execution (5-30s depending on complexity)
      // - TURN 2: Final response with reasoning (10-45s)
      const streamTimeout = Math.max(90_000, config.ai.timeoutMs * 3)
      logger.server.debug('[External AI Proxy] Starting MCP stream', { reqId, timeout: streamTimeout })
      
      const upstream = await fetch(`${base.replace(/\/$/, '')}/ai/chat/stream`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
        body: JSON.stringify(mcpBody),
        signal: AbortSignal.timeout(streamTimeout)
      })

      if (!upstream.ok || !upstream.body) {
        const text = await upstream.text().catch(() => '')
        logger.server.error(`[External AI Proxy] MCP /ai/chat/stream failed: ${upstream.status} ${text}`, { reqId })
        set.status = 502
        return { error: `Upstream MCP error (${upstream.status})` }
      }

      // Transform MCP SSE events -> AI SDK UI stream events for the UI
      const readable = new ReadableStream<Uint8Array>({
        async start(controller) {
          const reader = upstream.body!.getReader()
          const decoder = new TextDecoder()
          const encoder = new TextEncoder()
          let buffer = ''
          let chunkCount = 0
          let eventCount = 0
          const send = (obj: unknown) => {
            try {
              eventCount++
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
            } catch (err) {
              logger.server.error('[External AI Proxy] Error sending event', { reqId, error: err })
            }
          }
          const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
          const getStr = (o: Record<string, unknown>, k: string): string | undefined => typeof o[k] === 'string' ? (o[k] as string) : undefined
          try {
            while (true) {
              const { done, value } = await reader.read()
              chunkCount++
              if (done) {
                logger.server.info('[External AI Proxy] MCP stream ended', { reqId, totalChunks: chunkCount, totalEvents: eventCount })
                break
              }
              buffer += decoder.decode(value, { stream: true })
              let idx: number
              while ((idx = buffer.indexOf('\n\n')) !== -1) {
                const raw = buffer.slice(0, idx)
                buffer = buffer.slice(idx + 2)
                // Extract data payload
                let dataStr = ''
                for (const line of raw.split('\n')) {
                  if (line.startsWith('data:')) {
                    dataStr += (dataStr ? '\n' : '') + line.slice(5).trimStart()
                  }
                }
                if (!dataStr) continue
                let obj: unknown
                try { obj = JSON.parse(dataStr) } catch {
                  logger.server.warn('[External AI Proxy] Failed to parse SSE data', { reqId, dataStr: dataStr.slice(0, 100) })
                  continue
                }
                if (!isRecord(obj)) continue
                const t = typeof obj.type === 'string' ? (obj.type as string) : undefined
                let out: { type: string; [k: string]: unknown } | null = null
                // If Python already sends AI SDK format (text-delta, finish, error, etc.), pass through
                if (t === 'text-delta' || t === 'reasoning' || t === 'tool-call' || t === 'finish' || t === 'error') {
                  out = obj as { type: string; [k: string]: unknown }
                } else if (t === 'content') {
                  // Legacy format: convert 'content' to 'text-delta'
                  const text = getStr(obj, 'content')
                  if (text) out = { type: 'text-delta', delta: text }
                } else if (t === 'function_calling' || t === 'tool_call_started') {
                  const toolName = getStr(obj, 'name') ?? getStr(obj, 'toolName')
                  if (toolName) out = { type: 'tool-call', toolName }
                } else if (t === 'done') {
                  out = { type: 'finish' }
                } else if (typeof (obj as Record<string, unknown>).content === 'string') {
                  // Fallback: treat any event with 'content' field as text-delta
                  out = { type: 'text-delta', delta: (obj as Record<string, unknown>).content as string }
                }
                if (out) {
                  send(out)
                } else if (eventCount < 3) {
                  logger.server.debug('[External AI Proxy] Skipped event (no matching type)', { reqId, originalType: t, dataStr: dataStr.slice(0, 100) })
                }
              }
            }
          } catch (err) {
            logger.server.error('[External AI Proxy] Stream error', { reqId, error: err instanceof Error ? err.message : String(err) })
            send({ type: 'error', error: err instanceof Error ? err.message : String(err) })
          } finally {
            try { await reader.cancel() } catch { /* ignore cancel error */ }
            try { controller.close() } catch { /* ignore close error */ }
          }
        }
      })

      logger.server.info('[External AI Proxy] Returning stream response', { reqId })
      return new Response(readable, {
        headers: {
          'content-type': 'text/event-stream',
          'cache-control': 'no-cache',
          'connection': 'keep-alive'
        }
      })
    } catch (error) {
      logger.server.error('[External AI Proxy] Failed to proxy streaming request', {
        reqId,
        error: error instanceof Error ? { message: error.message, stack: error.stack, name: error.name } : String(error)
      })
      set.status = 500
      return { error: error instanceof Error ? error.message : 'Unknown error while initializing AI assistant' }
    }
  }, {
    body: ChatRequest,
    response: {
      200: AiStreamResponse,
      401: ErrorResponse,
      500: ErrorResponse,
      503: ErrorResponse
    },
    detail: {
      summary: 'Stream AI assistant chat responses (proxy)',
      description: `Proxies to MCP /ai/chat/stream and transforms events to AI SDK UI message stream for the UI.`,
      tags: ['ai']
    }
  })

