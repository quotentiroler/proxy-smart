import { Elysia, t, sse } from 'elysia'
import { extractRouteTools, addCustomTools, createToolExecutor } from '@/lib/ai/tool-registry'
import { validateToken } from '@/lib/auth'
import { config } from '@/config'
import { createApp } from '@/app-factory'
import type { JwtPayload } from 'jsonwebtoken'
import { 
  McpRequest, 
  McpToolListResponse, 
  McpCallToolSuccess,
  McpUnauthorizedError,
  McpInsufficientScopeError,
  McpToolNotFoundError,
  McpForbiddenError,
  McpExecutionFailedError
} from '@/schemas'
import type { 
  McpToolListResponseType, 
  McpCallToolSuccessType,
  McpUnauthorizedErrorType,
  McpInsufficientScopeErrorType,
  McpToolNotFoundErrorType,
  McpForbiddenErrorType,
  McpExecutionFailedErrorType
} from '@/schemas'

type JwtContext = {
  sub: string
  email?: string
  roles: string[]
  scopes: string[]
}

// Keycloak-flavored OIDC JWT payload shape (subset)
type KeycloakJwtPayload = JwtPayload & {
  scope?: string | string[]
  scp?: string | string[]
  email?: string
  realm_access?: { roles?: string[] }
  resource_access?: Record<string, { roles?: string[] }>
}

function parseScopesFromTokenPayload(payload: KeycloakJwtPayload): string[] {
  const scopes: string[] = []
  const claim = (payload && (payload.scope || payload.scp)) as string | string[] | undefined
  if (Array.isArray(claim)) return claim
  if (typeof claim === 'string') return claim.split(/\s+/).filter(Boolean)
  return scopes
}

function parseRolesFromTokenPayload(payload: KeycloakJwtPayload): string[] {
  const roles: string[] = []
  const realmRoles: string[] = payload?.realm_access?.roles || []
  const clientRoles: string[] = Object.values(payload?.resource_access || {}).flatMap((r) => (r?.roles || [])) as string[]
  return [...new Set([...roles, ...realmRoles, ...clientRoles])]
}

function requiredScope(): string | undefined {
  return config.mcp.scopeChallenge
}

function resourceMetadataUrl(): string {
  return `${config.baseUrl.replace(/\/$/, '')}/.well-known/oauth-protected-resource`
}

function unauthorizedWWWAuthenticate(extra: Record<string, string> = {}): Record<string, string> {
  // RFC 6750 + resource_metadata pointer per RFC 9728
  const scope = requiredScope()
  const params = [
    'realm="Proxy Smart MCP"',
    `resource_metadata="${resourceMetadataUrl()}"`,
  ]
  if (scope) params.push(`scope="${scope}"`)
  const header = { 'WWW-Authenticate': `Bearer ${params.join(', ')}` }
  return { ...header, ...extra }
}

class AudienceError extends Error { code = 'invalid_audience' as const }

async function authenticate(headers: Headers, url: URL): Promise<JwtContext> {
  // Support Authorization header and optional token query param for SSE (HTTPS only recommended)
  const authHeader = headers.get('authorization') || headers.get('Authorization') || undefined
  const queryToken = url.searchParams.get('token') || undefined
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : queryToken
  if (!token) throw new Error('no_token')

  const payload = (await validateToken(token)) as KeycloakJwtPayload
  // Audience validation: require that the token was issued for this MCP server
  const aud = (payload as JwtPayload).aud
  const canonical = config.mcp.canonicalResource
  const acceptable = new Set<string>([
    canonical,
    config.mcp.resourceBase,
    config.baseUrl.replace(/\/$/, ''),
  ].filter(Boolean))

  const audOk = Array.isArray(aud)
    ? aud.some((a) => acceptable.has(String(a)))
    : (typeof aud === 'string' ? acceptable.has(aud) : false)

  if (!audOk) throw new AudienceError('invalid_audience')
  const roles = parseRolesFromTokenPayload(payload)
  const scopes = parseScopesFromTokenPayload(payload)
  return {
    sub: payload.sub as string,
    email: (payload as JwtPayload & { email?: string }).email,
    roles,
    scopes,
  }
}

function hasScope(ctx: JwtContext, scope: string | undefined): boolean {
  if (!scope) return true
  return ctx.scopes.includes(scope)
}

function isAdmin(ctx: JwtContext): boolean {
  return ctx.roles.some((r) => r.includes('admin') || r.includes('manage'))
}

// Simple in-memory fan-out by subject for SSE
const sseChannels = new Map<string, Set<ReadableStreamDefaultController<Uint8Array>>>()

// Track last known tool set hash per subject to push change notifications
const lastToolsHashBySub = new Map<string, string>()

function hashString(input: string): string {
  // Simple 32-bit FNV-1a hash as hex
  let hash = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0
  }
  return ('00000000' + hash.toString(16)).slice(-8)
}

function computeToolsHash(defs: unknown): string {
  // Stable-ish stringify
  const text = JSON.stringify(defs)
  return hashString(text)
}

function broadcastToSubject(sub: string, event: Record<string, unknown>) {
  const set = sseChannels.get(sub)
  if (!set || set.size === 0) return
  const data = `data: ${JSON.stringify(event)}\n\n`
  const enc = new TextEncoder()
  for (const controller of set) {
    try { controller.enqueue(enc.encode(data)) } catch { /* ignore */ }
  }
}

export const mcpHttpRoutes = new Elysia({ prefix: '/mcp', tags: ['mcp-http'] })
  // POST /mcp - modern Streamable HTTP transport (list tools or call a tool)
  .post('/', async function ({ body, set, request }): Promise<
    McpToolListResponseType | 
    McpCallToolSuccessType | 
    McpUnauthorizedErrorType | 
    McpInsufficientScopeErrorType | 
    McpToolNotFoundErrorType | 
    McpForbiddenErrorType | 
    McpExecutionFailedErrorType
  > {
    const url = new URL(request.url)
    let jwt: JwtContext
    try {
      jwt = await authenticate(request.headers as unknown as Headers, url)
    } catch (e) {
      const code = (e instanceof AudienceError) ? 'invalid_audience' : undefined
      set.status = 401
      const params: Record<string, string> = code === 'invalid_audience'
        ? unauthorizedWWWAuthenticate({ 'WWW-Authenticate': `Bearer realm="Proxy Smart MCP", error="invalid_token", error_description="Token audience does not match this resource", resource_metadata="${resourceMetadataUrl()}"` })
        : unauthorizedWWWAuthenticate()
  // Attach headers and return typed error body (assign individually for type safety)
  set.headers['Content-Type'] = 'application/json'
  for (const [k, v] of Object.entries(params)) set.headers[k] = v
      return { error: 'unauthorized', code }
    }

    // Check base scope
    if (!hasScope(jwt, requiredScope())) {
      set.status = 403
      const scope = requiredScope()
      const hdr = `Bearer error="insufficient_scope", scope="${scope ?? ''}", resource_metadata="${resourceMetadataUrl()}"`
  set.headers['Content-Type'] = 'application/json'
  set.headers['WWW-Authenticate'] = hdr
      return { error: 'insufficient_scope', code: scope ?? 'scope' }
    }

    // Build a fresh app instance to introspect routes (avoids relying on this)
    const appInstance = createApp()
    const routeTools = extractRouteTools(appInstance, { prefixes: ['/admin/', '/fhir-servers/'] })
    const tools = addCustomTools(routeTools, new Map())
    const executor = createToolExecutor(tools, { userId: jwt.sub, roles: jwt.roles, email: jwt.email })

    if (body.type === 'listTools') {
      const defs = executor.getToolDefinitions()
      // Broadcast tools_list_changed if hash differs for this subject
      try {
        const hash = computeToolsHash(defs)
        const prev = lastToolsHashBySub.get(jwt.sub)
        if (prev !== hash) {
          lastToolsHashBySub.set(jwt.sub, hash)
          broadcastToSubject(jwt.sub, { type: 'tools_list_changed', count: defs.length, hash, timestamp: new Date().toISOString() })
        }
      } catch {
        // Ignore hash computation or broadcast errors - non-critical for tool listing
      }
      return { tools: defs }
    }

    // callTool path
    const name = body.name
    const args = (body.args ?? {}) as Record<string, unknown>

    const meta = tools.get(name)
    if (!meta) {
      set.status = 404
      return { error: 'tool_not_found', code: name }
    }

    // For non-public tools, require admin role or stronger scope
    if (!meta.public && !isAdmin(jwt)) {
      set.status = 403
      const hdr = `Bearer error="insufficient_scope", scope="admin", resource_metadata="${resourceMetadataUrl()}"`
  set.headers['Content-Type'] = 'application/json'
  set.headers['WWW-Authenticate'] = hdr
      return { error: 'forbidden', code: 'admin_required' }
    }

    const started = Date.now()
    broadcastToSubject(jwt.sub, { type: 'tool_call_started', toolName: name, toolCallId: body.id ?? crypto.randomUUID(), timestamp: new Date().toISOString() })
    try {
      const result = await executor.execute(name, args)
      const duration = Date.now() - started
      // Opportunistically compute tool hash and broadcast if changed (e.g., hot-reload scenarios)
      try {
        const defs = executor.getToolDefinitions()
        const hash = computeToolsHash(defs)
        const prev = lastToolsHashBySub.get(jwt.sub)
        if (prev !== hash) {
          lastToolsHashBySub.set(jwt.sub, hash)
          broadcastToSubject(jwt.sub, { type: 'tools_list_changed', count: defs.length, hash, timestamp: new Date().toISOString() })
        }
      } catch {
        // Ignore hash computation or broadcast errors - non-critical for tool execution
      }
      broadcastToSubject(jwt.sub, { type: 'tool_call_completed', toolName: name, success: true, duration })
      const text = typeof result === 'string' ? result : JSON.stringify(result)
      return { content: [{ type: 'text', text }], duration }
    } catch (e) {
      const duration = Date.now() - started
      const message = e instanceof Error ? e.message : String(e)
      broadcastToSubject(jwt.sub, { type: 'tool_call_completed', toolName: name, success: false, duration, error: message })
      set.status = 500
      return { error: 'execution_failed', details: message }
    }
  }, {
    body: McpRequest,
    response: {
      200: t.Union([McpToolListResponse, McpCallToolSuccess]),
      401: McpUnauthorizedError,
      403: t.Union([McpInsufficientScopeError, McpForbiddenError]),
      404: McpToolNotFoundError,
      500: McpExecutionFailedError
    },
    detail: {
      summary: 'MCP Streamable HTTP',
      description: 'Modern MCP transport - list available tools or call a specific tool with OAuth authentication and role-based access control. Supports optional SSE streaming for progress updates.',
      tags: ['mcp-http'],
      security: [{ BearerAuth: [] }]
    }
  })

  // GET /mcp - SSE stream for server→client updates (optional, can connect before making requests)
  .get('/', async function ({ set, request }) {
    const url = new URL(request.url)
    let jwt: JwtContext
    try {
      jwt = await authenticate(request.headers as unknown as Headers, url)
    } catch (e) {
      set.status = 401
      const headers = (e instanceof AudienceError)
        ? { 'WWW-Authenticate': `Bearer realm="Proxy Smart MCP", error="invalid_token", error_description="Token audience does not match this resource", resource_metadata="${resourceMetadataUrl()}"` }
        : unauthorizedWWWAuthenticate()
      return new Response('Unauthorized', { headers: { 'Content-Type': 'text/plain', ...headers } })
    }

    if (!hasScope(jwt, requiredScope())) {
      set.status = 403
      const scope = requiredScope()
      return new Response('Insufficient scope', { headers: { 'Content-Type': 'text/plain', 'WWW-Authenticate': `Bearer error="insufficient_scope", scope="${scope ?? ''}", resource_metadata="${resourceMetadataUrl()}"` } })
    }

    // Use Elysia's sse helper for robust formatting and heartbeats
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        if (!sseChannels.has(jwt.sub)) sseChannels.set(jwt.sub, new Set())
        const setControllers = sseChannels.get(jwt.sub)!
        setControllers.add(controller)
        const enc = new TextEncoder()

        // Initial ready event
        controller.enqueue(enc.encode(`event: ready\n` + `data: ${JSON.stringify({ sub: jwt.sub, ts: Date.now() })}\n\n`))

        // Heartbeat
        const ping = setInterval(() => {
          try { controller.enqueue(enc.encode('event: ping\ndata: {}\n\n')) } catch { /* ignore */ }
        }, 15000)

        // Cleanup on cancel
        // @ts-expect-error - not all runtimes provide this callback
        controller.signal?.addEventListener?.('abort', () => {
          clearInterval(ping)
          setControllers.delete(controller)
          if (setControllers.size === 0) sseChannels.delete(jwt.sub)
        })
      }
    })

    return sse(stream)
  })
