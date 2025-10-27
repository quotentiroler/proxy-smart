/**
 * AI Assistant internal - Direct Node.js implementation with OpenAI function calling
 * 
 * Implements function calling directly in Node.js, with tools auto-extracted from Elysia routes.
 */

import { Elysia, t } from 'elysia'
import { logger } from '@/lib/logger'
import { ErrorResponse } from '@/schemas'
import {
  ChatRequest,
  ChatResponse,
  AiStreamResponse,
  AiHealthResponse,
  type AiHealthResponseType,
} from '@/schemas/ai-assistant'
import { getToolRegistry, createToolExecutor } from '@/lib/ai/tool-registry'
import { type AIContext } from '@/lib/ai/assistant'
import { streamText, generateText, type Tool as AiSdkTool, type LanguageModel } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { typeboxToZod } from '@/lib/schemas/typebox-to-zod'
import { validateToken } from '@/lib/auth'
import type { JwtPayload } from 'jsonwebtoken'
import { config } from '@/config'

// Use Elysia's inferred handler context types based on route schemas

// Keycloak-flavored OIDC JWT payload shape (subset)
type KeycloakJwtPayload = JwtPayload & {
  scope?: string | string[]
  scp?: string | string[]
  email?: string
  preferred_username?: string
  realm_access?: { roles?: string[] }
  resource_access?: Record<string, { roles?: string[] }>
}

function parseRolesFromTokenPayload(payload: KeycloakJwtPayload): string[] {
  const roles: string[] = []
  const realmRoles: string[] = payload?.realm_access?.roles || []
  const clientRoles: string[] = Object.values(payload?.resource_access || {}).flatMap((r) => (r?.roles || [])) as string[]
  return [...new Set([...roles, ...realmRoles, ...clientRoles])]
}

// Mask sensitive identifiers for logs (show a short prefix only)
function maskId(id?: string): string | undefined {
  if (!id) return id
  if (id.length <= 8) return id
  return `${id.slice(0, 8)}…`
}

// Load system prompt from shared markdown file
async function loadSystemPrompt(reqId?: string): Promise<string> {
  const fallback = 'You are an AI assistant for SMART on FHIR. Be concise and helpful.'
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const configuredPath = process.env.AI_SYSTEM_PROMPT_PATH
    const candidatePaths: string[] = []

    if (configuredPath) {
      candidatePaths.push(path.isAbsolute(configuredPath) ? configuredPath : path.resolve(process.cwd(), configuredPath))
    }

    candidatePaths.push(
      path.join(process.cwd(), 'prompts', 'system.md'),
      path.join(process.cwd(), '..', 'prompts', 'system.md'),
      path.join(process.cwd(), '..', '..', 'prompts', 'system.md')
    )

    const errors: Array<{ path: string; message: string }> = []

    for (const promptPath of candidatePaths) {
      try {
        const promptContent = await fs.readFile(promptPath, 'utf-8')
        return promptContent
          .replace(/^# SMART on FHIR Platform AI Assistant - System Prompt\n\n/, '')
          .replace(/##\s+/g, '')
          .replace(/```[^\n]*\n/g, '')
          .replace(/```/g, '')
          .trim()
      } catch (error) {
        errors.push({
          path: promptPath,
          message: error instanceof Error ? error.message : String(error)
        })
      }
    }

    logger.server.warn('Failed to load system prompt, using fallback', {
      reqId,
      attempts: errors
    })
  } catch (err) {
    logger.server.warn('Failed to initialize system prompt loader, using fallback', {
      reqId,
      error: err instanceof Error ? err.message : String(err)
    })
  }
  return fallback
}

// Public AI internal health check routes
export const aiV2PublicRoutes = new Elysia({ prefix: '/ai', tags: ['ai-internal'] })
  .get('/health', async ({ set }): Promise<AiHealthResponseType> => {
    try {
      // Check if OpenAI is configured
      const openaiConfigured = !!process.env.OPENAI_API_KEY
      const model = process.env.OPENAI_MODEL || 'gpt-5-mini'

      // For now, return basic health without tool discovery (requires app instance)
      return {
        status: openaiConfigured ? 'healthy' : 'unhealthy',
        openai: {
          configured: openaiConfigured,
          model,
          reachable: undefined, // Could ping OpenAI API if needed
        },
        tools: {
          totalAvailable: 0, // Will be calculated per request
          byPrefix: {},
          examples: undefined,
        },
        version: '2.0.0',
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      logger.server.warn('AI internal health check failed', {
        error: error instanceof Error ? {
          message: error.message,
          name: error.name
        } : String(error)
      })
      set.status = 503
      return {
        status: 'unhealthy',
        openai: {
          configured: false,
        },
        tools: {
          totalAvailable: 0,
          byPrefix: {},
        },
        version: '2.0.0',
        timestamp: new Date().toISOString(),
      }
    }
  }, {
    response: {
      200: AiHealthResponse,
      503: AiHealthResponse
    },
    detail: {
      summary: 'Get AI assistant internal health status',
      description: 'Returns health status for the Node.js-based AI assistant (v2) with function calling capabilities.'
    }
  })
  .head('/chat', async ({ set }): Promise<void> => {
    // HEAD request for chat endpoint - check availability without processing
    try {
      if (!process.env.OPENAI_API_KEY) {
        set.status = 503
        return
      }
      set.status = 200
    } catch (error) {
      logger.server.warn('AI internal HEAD /chat check failed', {
        error: error instanceof Error ? error.message : String(error)
      })
      set.status = 503
    }
  }, {
    response: {
      200: t.Void(),
      503: t.Void(),
    },
    detail: {
      summary: 'Check AI assistant internal availability',
      description: 'HEAD request to check if the AI assistant internal is available.'
    }
  })

// Protected AI internal routes (authentication required)
export const aiV2Routes = new Elysia({ prefix: '/ai', tags: ['ai-internal'] })
  .post('/chat/stream', async ({ body, set, headers }) => {
    // Check OpenAI configuration
    if (!process.env.OPENAI_API_KEY) {
      set.status = 503
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Authenticate via Authorization header (Bearer token)
    // Note: do NOT create synthetic user contexts here. If no valid token is present
    // the request must be rejected with 401 so callers can fix the auth flow.
    const authOptional = (process.env.AI_AUTH_OPTIONAL || '').toLowerCase() === 'true'
    const authHeader = headers['authorization'] || headers['Authorization']
    const reqId = crypto.randomUUID()
    // Production-safe auth probe (no token content)
    logger.auth.info('AI internal /chat/stream auth probe', {
      reqId,
      hasAuthHeader: !!authHeader,
      jwksConfigured: !!config.keycloak.jwksUri,
      monoMode: config.ai.useInternalAI,
    })
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
    if (!token) {
      // If auth is optional (dev/test), caller can opt-in; otherwise reject explicitly
      if (!authOptional) {
        set.status = 401
        return new Response(
          JSON.stringify({ error: 'Authentication required: missing Authorization header' }),
          { headers: { 'Content-Type': 'application/json', 'WWW-Authenticate': `Bearer realm="${config.keycloak.realm ?? 'proxy-smart'}", error="invalid_token", error_description="missing Authorization header"` } }
        )
      }
    }

    try {
      let userId: string | undefined
      let roles: string[] = []
      let email: string | undefined
      if (token) {
        try {
          const payload = (await validateToken(token)) as KeycloakJwtPayload
          logger.auth.debug('AI internal token payload after validation', {
            reqId,
            hasSub: !!payload.sub,
            sub: payload.sub,
            hasPreferredUsername: !!payload.preferred_username,
            preferredUsername: payload.preferred_username,
            hasEmail: !!payload.email,
            hasRealmAccess: !!payload.realm_access,
            hasResourceAccess: !!payload.resource_access,
            payloadKeys: Object.keys(payload)
          })
          // Use sub if available, fallback to preferred_username (common in Keycloak tokens)
          userId = (payload.sub || payload.preferred_username) as string | undefined
          roles = parseRolesFromTokenPayload(payload)
          email = (payload as JwtPayload & { email?: string }).email
        } catch (err) {
          // Provide a clearer 401 reason to the client while logging details for operators
          logger.auth.warn('AI internal token validation failed', { reqId, error: err instanceof Error ? err.message : String(err) })
          if (!authOptional) {
            set.status = 401
            return new Response(
              JSON.stringify({ error: 'Invalid or expired token', details: err instanceof Error ? err.message : String(err) }),
              { headers: { 'Content-Type': 'application/json', 'WWW-Authenticate': `Bearer realm="${config.keycloak.realm ?? 'proxy-smart'}", error="invalid_token", error_description="invalid or expired token"` } }
            )
          }
        }
      }

      if (!userId) {
        logger.auth.warn('AI internal /chat/stream rejected: no authenticated user', { reqId })
        set.status = 401
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { headers: { 'Content-Type': 'application/json', 'WWW-Authenticate': `Bearer realm="${config.keycloak.realm ?? 'proxy-smart'}"` } }
        )
      }

      // Build AI context from JWT
      const aiContext: AIContext = { userId: userId!, roles, email }
      logger.auth.info('AI internal /chat/stream token accepted', {
        reqId,
        sub: maskId(aiContext.userId),
        rolesCount: roles.length,
        emailPresent: !!email,
      })

      // Get tools from the global registry (initialized once at startup)
      const allTools = getToolRegistry()
      logger.server.info(`Internal MCP: Using ${allTools.size} tools from global registry`, {
        reqId,
        userId: aiContext.userId,
        toolNames: Array.from(allTools.keys()).slice(0, 10) // Log first 10 tool names
      })

      // Map our route-extracted tools to AI SDK tools
      const sdkTools: Record<string, AiSdkTool> = {}
      for (const [toolName, meta] of allTools.entries()) {
        sdkTools[toolName] = {
          description: `Auto-generated tool for ${meta.method} ${meta.path}`,
          inputSchema: meta.schema ? typeboxToZod(meta.schema) : z.object({}).strict(),
          // Tool executor delegates to our route handler executor
          // The AI SDK passes { input } to execute
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          execute: async ({ input }: any) => {
            const result = await createToolExecutor(allTools, aiContext).execute(toolName, input)
            return typeof result === 'string' ? result : JSON.stringify(result)
          },
        }
      }

      logger.server.info('AI internal stream starting', { reqId, model: body.model || process.env.OPENAI_MODEL || 'gpt-5-mini', tools: Object.keys(sdkTools).length })

      // Load system prompt from shared file
      const systemPrompt = await loadSystemPrompt(reqId)

      // Use model from request or fall back to env var
      const modelToUse = body.model || process.env.OPENAI_MODEL || 'gpt-5-mini'

      // Use AI SDK's streamText for streaming responses with tool support
      const result = await streamText({
        // Uses OPENAI_API_KEY from env
        model: openai(modelToUse) as unknown as LanguageModel,
        system: systemPrompt,
        tools: sdkTools,
        prompt: body.message,
        onFinish: async ({ text, toolCalls, usage, finishReason }) => {
          logger.server.info('AI internal stream finished', {
            reqId,
            textLength: text?.length || 0,
            toolCallsCount: toolCalls?.length || 0,
            usage,
            finishReason
          })
        },
      })

      logger.server.debug('AI internal stream result created', {
        reqId,
        hasTextStream: !!result.textStream,
        hasFullStream: !!result.fullStream,
      })

      // Return AI SDK's UIMessageStream as an SSE Response (sets correct headers)
      logger.server.debug('AI internal returning toUIMessageStreamResponse()', { reqId })
      return result.toUIMessageStreamResponse()
    } catch (error) {
      logger.server.error('Failed to initialize AI internal stream', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : String(error)
      })
      set.status = 500
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error while initializing AI assistant'
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
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
      summary: 'Stream AI assistant chat responses',
      description: `Direct Node.js implementation with OpenAI function calling. Returns a Server-Sent Events (SSE) stream using AI SDK's toUIMessageStreamResponse().

The stream emits AI SDK UI message events (e.g., text-delta, tool-call, reasoning, finish, error) as \`data: {..}\` SSE frames with proper \`text/event-stream\` headers.`,
      tags: ['ai-internal']
    }
  })
  .post('/chat', async ({ body, set, headers }) => {
    // Check OpenAI configuration
    if (!process.env.OPENAI_API_KEY) {
      set.status = 503
      return { error: 'OpenAI API key is not configured' }
    }

    // Authenticate via Authorization header (Bearer token)
    const authOptional = (process.env.AI_AUTH_OPTIONAL || '').toLowerCase() === 'true'
    const authHeader = headers['authorization'] || headers['Authorization']
    const reqId = crypto.randomUUID()
    // Log presence of authorization header and JWKS config for debugging
    logger.auth.info('AI internal /chat auth probe', {
      reqId,
      hasAuthHeader: !!authHeader,
      jwksConfigured: !!config.keycloak.jwksUri,
      monoMode: config.ai.useInternalAI,
    })
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined
    if (!token && !authOptional) {
      set.status = 401
        ; (set.headers as unknown as Record<string, string | number>)['WWW-Authenticate'] = `Bearer realm="${config.keycloak.realm ?? 'proxy-smart'}", error="invalid_token", error_description="missing Authorization header"`
      return { error: 'Authentication required' }
    }

    try {
      let userId: string | undefined
      let roles: string[] = []
      let email: string | undefined
      if (token) {
        try {
          const payload = (await validateToken(token)) as KeycloakJwtPayload
          // Use sub if available, fallback to preferred_username (common in Keycloak tokens)
          userId = (payload.sub || payload.preferred_username) as string | undefined
          roles = parseRolesFromTokenPayload(payload)
          email = (payload as JwtPayload & { email?: string }).email
        } catch (err) {
          logger.auth.warn('AI internal token validation failed (non-stream)', { reqId, error: err instanceof Error ? err.message : String(err) })
          if (!authOptional) {
            set.status = 401
              ; (set.headers as unknown as Record<string, string | number>)['WWW-Authenticate'] = `Bearer realm="${config.keycloak.realm ?? 'proxy-smart'}", error="invalid_token", error_description="invalid or expired token"`
            return { error: 'Invalid or expired token' }
          }
        }
      }
      if (!userId) {
        set.status = 401
          ; (set.headers as unknown as Record<string, string | number>)['WWW-Authenticate'] = `Bearer realm="${config.keycloak.realm ?? 'proxy-smart'}"`
        return { error: 'Authentication required' }
      }

      // Build AI context from JWT
      const aiContext: AIContext = { userId: userId!, roles, email }
      logger.auth.info('AI internal /chat token accepted', {
        reqId,
        sub: maskId(aiContext.userId),
        rolesCount: roles.length,
        emailPresent: !!email,
      })

      // Get tools from the global registry (initialized once at startup)
      const allTools = getToolRegistry()
      logger.server.info(`AI v2: Using ${allTools.size} tools from global registry`, {
        reqId,
        userId: aiContext.userId,
        toolNames: Array.from(allTools.keys()).slice(0, 10)
      })

      // Prepare AI SDK tools with measurement
      const measuredToolsUsed: Array<{
        toolName: string
        toolCallId: string
        status: 'started' | 'completed' | 'failed'
        duration?: number
        error?: string
      }> = []

      const sdkTools: Record<string, AiSdkTool> = {}
      for (const [toolName, meta] of allTools.entries()) {
        sdkTools[toolName] = {
          description: `Auto-generated tool for ${meta.method} ${meta.path}`,
          inputSchema: meta.schema ? typeboxToZod(meta.schema) : z.object({}).strict(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          execute: async ({ input }: any) => {
            const toolCallId = crypto.randomUUID()
            const start = Date.now()
            measuredToolsUsed.push({ toolName, toolCallId, status: 'started' })
            try {
              const result = await createToolExecutor(allTools, aiContext).execute(toolName, input)
              measuredToolsUsed.push({ toolName, toolCallId, status: 'completed', duration: Date.now() - start })
              return typeof result === 'string' ? result : JSON.stringify(result)
            } catch (err) {
              const errorMsg = err instanceof Error ? err.message : String(err)
              measuredToolsUsed.push({ toolName, toolCallId, status: 'failed', duration: Date.now() - start, error: errorMsg })
              throw err
            }
          },
        }
      }

      // Load system prompt from shared file
      const systemPrompt = await loadSystemPrompt(reqId)

      // Use model from request or fall back to env var
      const modelToUse = body.model || process.env.OPENAI_MODEL || 'gpt-5-mini'

      const startTime = Date.now()
      const result = await generateText({
        model: openai(modelToUse) as unknown as LanguageModel,
        system: systemPrompt,
        tools: sdkTools,
        prompt: body.message,
      })

      logger.server.info('AI internal non-stream completed', { model: modelToUse, toolCalls: measuredToolsUsed.length })

      return {
        answer: result.text,
        conversationId: body.conversationId || crypto.randomUUID(),
        model: modelToUse,
        sources: undefined, // Internal AI doesn't use RAG
        toolsUsed: measuredToolsUsed,
        totalDuration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      logger.server.error('Failed to process AI internal chat request', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : String(error)
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
      summary: 'Send chat message to AI assistant (v2)',
      description: 'Direct Node.js implementation with OpenAI function calling. Returns complete response with tool execution details.',
      tags: ['ai-internal']
    }
  })
