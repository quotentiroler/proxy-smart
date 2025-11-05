import { Elysia } from 'elysia'
import { logger } from '../../lib/logger'
import { ErrorResponse, CommonErrorResponses } from '../../schemas'
import { 
  AiHealthResponse, 
  AiHealthErrorResponse, 
  AiStreamResponse, 
  ChatRequest, 
  ChatResponse,
  type AiHealthResponseType,
  type AiHealthErrorResponseType,
  type ChatResponseType,
  type ChatRequestType
} from '@/schemas/ai-assistant'
import { validateToken } from '@/lib/auth'
import type { JwtPayload } from 'jsonwebtoken'
import { config } from '../../config'
import { McpClient, McpConnectionManager } from '@/lib/ai/mcp-client'
import { openai } from '@ai-sdk/openai'
import { streamText, type CoreMessage } from 'ai'

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
    try {
      // Authenticate via Authorization header (Bearer token)
      const authHeader = headers.authorization || headers.Authorization
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
      if (!token) { set.status = 401; return { error: 'Authentication required' } }

      // Validate token
      const payload = (await validateToken(token)) as KeycloakJwtPayload
      const userId = (payload.sub || payload.preferred_username) as string | undefined
      if (!userId) { set.status = 401; return { error: 'Invalid token: subject missing' } }

      logger.server.info('AI chat request received', {
        userId,
        message: body.message.substring(0, 100),
        model: body.model
      })

      // Ensure OpenAI API key is configured
      if (!config.ai.openaiApiKey) {
        logger.server.error('OpenAI API key not configured')
        set.status = 503
        return { error: 'OpenAI API key not configured. Set OPENAI_API_KEY environment variable.' }
      }

      // Setup MCP connection manager
      const mcpManager = new McpConnectionManager()
      
      // Add internal backend tools
      const internalClient = McpClient.createInternalClient(token)
      mcpManager.addServer('internal-backend', internalClient)
      
      // Optionally add external MCP servers (if configured)
      if (config.ai.baseUrl) {
        const externalClient = McpClient.createExternalClient(
          config.ai.baseUrl,
          'external-mcp',
          { token }
        )
        mcpManager.addServer('external-mcp', externalClient)
      }

      // Get all available tools
      const toolsList = await mcpManager.getAllTools()
      
      logger.server.info('MCP tools loaded', {
        toolCount: toolsList.length,
        toolNames: toolsList.map(t => t.function.name)
      })

      // Convert message history to CoreMessage format
      const messages: CoreMessage[] = [
        {
          role: 'user',
          content: body.message
        }
      ]

      // Add page context as system message if provided
      if (body.pageContext) {
        messages.unshift({
          role: 'system',
          content: `Current page context: ${JSON.stringify(body.pageContext)}`
        })
      }

      // Build tools object for AI SDK
      const tools: Record<string, { description: string; parameters: unknown; execute: (args: Record<string, unknown>) => Promise<string> }> = {}
      
      for (const tool of toolsList) {
        tools[tool.function.name] = {
          description: tool.function.description,
          parameters: tool.function.parameters,
          execute: async (args: Record<string, unknown>) => {
            logger.server.info('Executing MCP tool', {
              tool: tool.function.name,
              args
            })
            const toolStart = Date.now()
            try {
              const result = await mcpManager.callTool(tool.function.name, args)
              const duration = Date.now() - toolStart
              logger.server.info('Tool execution completed', {
                tool: tool.function.name,
                duration,
                resultLength: JSON.stringify(result).length
              })
              return result.content[0]?.text || ''
            } catch (error) {
              const duration = Date.now() - toolStart
              logger.server.error('Tool execution failed', {
                tool: tool.function.name,
                duration,
                error: error instanceof Error ? error.message : String(error)
              })
              throw error
            }
          }
        }
      }

      // Use Vercel AI SDK to stream response with tool calling
      const startTime = Date.now()
      const result = await streamText({
        model: openai(body.model || 'gpt-5-mini'),
        messages,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tools: tools as any // Type assertion needed due to complex AI SDK types
      })

      // Collect the full response
      let fullText = ''
      const toolsUsed: Array<{
        toolName: string
        toolCallId: string
        status: 'started' | 'completed' | 'failed'
        duration?: number
        error?: string
      }> = []

      for await (const chunk of result.textStream) {
        fullText += chunk
      }

      // Get usage stats
      const usage = await result.usage
      const totalDuration = Date.now() - startTime

      logger.server.info('AI response completed', {
        textLength: fullText.length,
        toolCallsCount: toolsUsed.length,
        duration: totalDuration,
        usage
      })

      // Map to ChatResponse format
      const mapped: ChatResponseType = {
        answer: fullText,
        conversationId: body.conversationId || crypto.randomUUID(),
        model: body.model || 'gpt-4o-mini',
        sources: [],
        toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
        totalDuration,
        tokensUsed: usage ? {
          inputTokens: ('promptTokens' in usage ? usage.promptTokens : 0) as number,
          outputTokens: ('completionTokens' in usage ? usage.completionTokens : 0) as number,
          reasoningTokens: 0,
          totalTokens: ('totalTokens' in usage ? usage.totalTokens : 0) as number,
        } : undefined,
        timestamp: new Date().toISOString(),
      }

      return mapped
    } catch (error) {
      logger.server.error('Failed to process AI chat request', {
        error: error instanceof Error ? { message: error.message, stack: error.stack, name: error.name } : String(error)
      })
      set.status = 500
      return { error: error instanceof Error ? error.message : 'Unknown error while processing AI request' }
    }
  }, {
    body: ChatRequest,
    response: {
      200: ChatResponse,
      ...CommonErrorResponses,
      503: ErrorResponse
    },
    detail: {
      summary: 'AI assistant chat request with internal MCP tools',
      description: 'Uses internal MCP server for backend tool execution via AI SDK.',
      tags: ['ai']
    }
  })
  .post('/chat/stream', async ({ body, set, headers }): Promise<Response | { error: string }> => {
    try {
      // Authenticate via Authorization header (Bearer token)
      const authHeader = headers.authorization || headers.Authorization
      const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
      if (!token) {
        set.status = 401
        return { error: 'Authentication required' }
      }

      // Validate token
      const payload = (await validateToken(token)) as KeycloakJwtPayload
      const userId = (payload.sub || payload.preferred_username) as string | undefined
      if (!userId) {
        set.status = 401
        return { error: 'Invalid token: subject missing' }
      }

      logger.server.info('AI chat stream request received', {
        userId,
        message: body.message.substring(0, 100),
        model: body.model
      })

      // Ensure OpenAI API key is configured
      if (!config.ai.openaiApiKey) {
        logger.server.error('OpenAI API key not configured')
        set.status = 503
        return { error: 'OpenAI API key not configured. Set OPENAI_API_KEY environment variable.' }
      }

      // Setup MCP connection manager
      const mcpManager = new McpConnectionManager()
      
      // Add internal backend tools
      const internalClient = McpClient.createInternalClient(token)
      mcpManager.addServer('internal-backend', internalClient)
      
      // Optionally add external MCP servers (if configured)
      if (config.ai.baseUrl) {
        const externalClient = McpClient.createExternalClient(
          config.ai.baseUrl,
          'external-mcp',
          { token }
        )
        mcpManager.addServer('external-mcp', externalClient)
      }

      // Get all available tools
      const toolsList = await mcpManager.getAllTools()
      
      logger.server.info('MCP tools loaded for streaming', {
        toolCount: toolsList.length,
        toolNames: toolsList.map(t => t.function.name)
      })

      // Convert message history to CoreMessage format
      const messages: CoreMessage[] = [
        {
          role: 'user',
          content: body.message
        }
      ]

      // Add page context as system message if provided
      if (body.pageContext) {
        messages.unshift({
          role: 'system',
          content: `Current page context: ${JSON.stringify(body.pageContext)}`
        })
      }

      // Build tools object for AI SDK
      const tools: Record<string, { description: string; parameters: unknown; execute: (args: Record<string, unknown>) => Promise<string> }> = {}
      
      for (const tool of toolsList) {
        tools[tool.function.name] = {
          description: tool.function.description,
          parameters: tool.function.parameters,
          execute: async (args: Record<string, unknown>) => {
            logger.server.info('Executing MCP tool (streaming)', {
              tool: tool.function.name,
              args
            })
            const toolStart = Date.now()
            try {
              const result = await mcpManager.callTool(tool.function.name, args)
              const duration = Date.now() - toolStart
              logger.server.info('Tool execution completed (streaming)', {
                tool: tool.function.name,
                duration,
                resultLength: JSON.stringify(result).length
              })
              return result.content[0]?.text || ''
            } catch (error) {
              const duration = Date.now() - toolStart
              logger.server.error('Tool execution failed (streaming)', {
                tool: tool.function.name,
                duration,
                error: error instanceof Error ? error.message : String(error)
              })
              throw error
            }
          }
        }
      }

      // Use Vercel AI SDK to stream response with tool calling
      const startTime = Date.now()
      const result = await streamText({
        model: openai(body.model || 'gpt-5-mini'),
        messages,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tools: tools as any // Type assertion needed due to complex AI SDK types
      })

      // Create SSE stream
      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          try {
            // Stream text chunks
            for await (const chunk of result.textStream) {
              const event = {
                type: 'text-delta',
                delta: chunk
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
            }

            // Send completion event
            const usage = await result.usage
            const totalDuration = Date.now() - startTime
            
            const finishEvent = {
              type: 'finish',
              usage: usage ? {
                inputTokens: ('promptTokens' in usage ? usage.promptTokens : 0) as number,
                outputTokens: ('completionTokens' in usage ? usage.completionTokens : 0) as number,
                totalTokens: ('totalTokens' in usage ? usage.totalTokens : 0) as number,
              } : undefined,
              duration: totalDuration
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(finishEvent)}\n\n`))

            logger.server.info('AI stream completed', {
              duration: totalDuration,
              usage
            })
          } catch (error) {
            logger.server.error('Stream error', {
              error: error instanceof Error ? error.message : String(error)
            })
            const errorEvent = {
              type: 'error',
              error: error instanceof Error ? error.message : String(error)
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`))
          } finally {
            controller.close()
          }
        }
      })

      return new Response(readable, {
        headers: {
          'content-type': 'text/event-stream',
          'cache-control': 'no-cache',
          'connection': 'keep-alive'
        }
      })
    } catch (error) {
      logger.server.error('Failed to initialize AI stream', {
        error: error instanceof Error ? { message: error.message, stack: error.stack, name: error.name } : String(error)
      })
      set.status = 500
      return { error: error instanceof Error ? error.message : 'Unknown error while initializing AI assistant' }
    }
  }, {
    body: ChatRequest,
    response: {
      200: AiStreamResponse,
      ...CommonErrorResponses,
      503: ErrorResponse
    },
    detail: {
      summary: 'Stream AI assistant chat responses with internal MCP tools',
      description: 'Uses internal MCP server for backend tool execution via AI SDK with SSE streaming.',
      tags: ['ai']
    }
  })

