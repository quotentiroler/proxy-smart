import { Elysia, t } from 'elysia'
import { logger } from '../../lib/logger'
import { ErrorResponse } from '../../schemas'
import { validateToken } from '@/lib/auth'

/**
 * MCP Server Management Endpoints
 * 
 * Allows the UI to:
 * - List configured MCP servers
 * - Check server health/connectivity
 * - View available tools per server
 */

// Define schemas
const McpServerInfo = t.Object({
  name: t.String({ description: 'Server identifier' }),
  url: t.String({ description: 'MCP server URL' }),
  type: t.Union([
    t.Literal('internal'),
    t.Literal('external'),
    t.Literal('generated')
  ], { description: 'Server type' }),
  status: t.Union([
    t.Literal('connected'),
    t.Literal('disconnected'),
    t.Literal('error'),
    t.Literal('unknown')
  ], { description: 'Connection status' }),
  description: t.Optional(t.String({ description: 'Server description' })),
  toolCount: t.Optional(t.Number({ description: 'Number of available tools' })),
  lastChecked: t.Optional(t.String({ description: 'Last health check timestamp (ISO)' })),
  error: t.Optional(t.String({ description: 'Error message if status is error' }))
})

const McpServerCreate = t.Object({
  name: t.String({ description: 'Unique server identifier' }),
  url: t.String({ description: 'MCP server URL (must be accessible)' }),
  description: t.Optional(t.String({ description: 'Optional server description' }))
})

const McpServerUpdate = t.Object({
  url: t.Optional(t.String({ description: 'MCP server URL' })),
  description: t.Optional(t.String({ description: 'Server description' }))
})

const McpServersListResponse = t.Object({
  servers: t.Array(McpServerInfo, { description: 'List of MCP servers' }),
  totalServers: t.Number({ description: 'Total number of servers' }),
  connectedServers: t.Number({ description: 'Number of connected servers' })
})

const McpServerHealthResponse = t.Object({
  name: t.String({ description: 'Server name' }),
  status: t.Union([
    t.Literal('healthy'),
    t.Literal('unhealthy'),
    t.Literal('unreachable')
  ]),
  responseTime: t.Optional(t.Number({ description: 'Response time in milliseconds' })),
  toolCount: t.Optional(t.Number({ description: 'Number of available tools' })),
  error: t.Optional(t.String({ description: 'Error message if unhealthy' }))
})

const McpToolInfo = t.Object({
  name: t.String({ description: 'Tool name' }),
  description: t.String({ description: 'Tool description' }),
  parameters: t.Record(t.String(), t.Unknown(), { description: 'Tool parameters schema' })
})

const McpServerToolsResponse = t.Object({
  server: t.String({ description: 'Server name' }),
  tools: t.Array(McpToolInfo, { description: 'Available tools' }),
  totalTools: t.Number({ description: 'Total number of tools' })
})

type McpServerInfoType = typeof McpServerInfo.static
type McpServersListResponseType = typeof McpServersListResponse.static
type McpServerHealthResponseType = typeof McpServerHealthResponse.static
type McpServerToolsResponseType = typeof McpServerToolsResponse.static
type McpServerCreateType = typeof McpServerCreate.static
type McpServerUpdateType = typeof McpServerUpdate.static

// In-memory storage for dynamically added servers
const dynamicServers = new Map<string, { url: string; description?: string }>()

// In-memory cache of server statuses
const serverStatusCache = new Map<string, {
  status: 'connected' | 'disconnected' | 'error' | 'unknown'
  toolCount?: number
  lastChecked: string
  error?: string
}>()

/**
 * Get configured MCP servers
 */
function getConfiguredServers(): Array<{ name: string; url: string; type: 'internal' | 'external' | 'generated'; description?: string }> {
  const servers: Array<{ name: string; url: string; type: 'internal' | 'external' | 'generated'; description?: string }> = []
  
  // Generated MCP server (Python FastMCP exposing backend API)
  const generatedMcpUrl = process.env.GENERATED_MCP_URL || 'http://localhost:8081'
  servers.push({
    name: 'generated-backend',
    url: generatedMcpUrl,
    type: 'generated',
    description: 'Auto-generated MCP server exposing backend API routes as tools'
  })

  // External MCP servers from environment
  const externalServers = process.env.EXTERNAL_MCP_SERVERS
  if (externalServers) {
    try {
      const parsed = JSON.parse(externalServers)
      if (Array.isArray(parsed)) {
        for (const server of parsed) {
          if (server.name && server.url) {
            servers.push({
              name: server.name,
              url: server.url,
              type: 'external',
              description: server.description
            })
          }
        }
      }
    } catch (error) {
      logger.server.warn('Failed to parse EXTERNAL_MCP_SERVERS', { error })
    }
  }

  // Add dynamically configured servers
  for (const [name, config] of dynamicServers.entries()) {
    servers.push({
      name,
      url: config.url,
      type: 'external',
      description: config.description
    })
  }

  return servers
}

/**
 * Check MCP server health
 */
async function checkServerHealth(url: string, timeout = 5000): Promise<{
  status: 'healthy' | 'unhealthy' | 'unreachable'
  responseTime?: number
  toolCount?: number
  error?: string
}> {
  const startTime = Date.now()
  
  try {
    // Try to call the actual MCP endpoint (listTools) to verify it's a real MCP server
    const toolsResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'listTools' }),
      signal: AbortSignal.timeout(timeout)
    })
    
    const responseTime = Date.now() - startTime
    
    if (!toolsResponse.ok) {
      return {
        status: 'unhealthy',
        responseTime,
        error: `HTTP ${toolsResponse.status}: ${toolsResponse.statusText}`
      }
    }
    
    // Try to parse the response to verify it's actually an MCP server
    let toolCount: number | undefined
    try {
      const data = await toolsResponse.json() as { tools?: unknown[] }
      if (data.tools && Array.isArray(data.tools)) {
        toolCount = data.tools.length
      } else {
        // Response doesn't look like an MCP server
        return {
          status: 'unhealthy',
          responseTime,
          error: 'Server responded but not with valid MCP protocol'
        }
      }
    } catch (parseError) {
      return {
        status: 'unhealthy',
        responseTime,
        error: `Invalid MCP response: ${parseError instanceof Error ? parseError.message : String(parseError)}`
      }
    }
    
    return {
      status: 'healthy',
      responseTime,
      toolCount
    }
  } catch (error) {
    return {
      status: 'unreachable',
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export const mcpServersRoutes = new Elysia({ prefix: '/mcp-servers', tags: ['mcp-management'] })
  /**
   * Get MCP server templates catalog
   */
  .get('/templates', async ({ headers }) => {
    // Validate authentication
    const authHeader = headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Unauthorized')
    }
    
    const token = authHeader.substring(7)
    await validateToken(token)
    
    try {
      const fs = await import('fs/promises')
      const path = await import('path')
      
      // Try multiple possible paths for the templates file
      const possiblePaths = [
        path.join(process.cwd(), 'mcp-server-templates.json'),
        path.join(process.cwd(), 'backend', 'mcp-server-templates.json'),
        path.join(__dirname, '..', '..', '..', 'mcp-server-templates.json'),
        path.join(__dirname, '..', '..', 'mcp-server-templates.json'),
      ]
      
      let templatesContent: string | null = null
      let usedPath: string | null = null
      
      for (const templatesPath of possiblePaths) {
        try {
          templatesContent = await fs.readFile(templatesPath, 'utf-8')
          usedPath = templatesPath
          logger.server.debug('Found MCP templates at', { path: templatesPath })
          break
        } catch {
          // Try next path
          continue
        }
      }
      
      if (!templatesContent) {
        throw new Error('Templates file not found in any expected location')
      }
      
      const templates = JSON.parse(templatesContent)
      
      return templates
    } catch (error) {
      logger.server.error('Failed to load MCP server templates', {
        error: error instanceof Error ? error.message : String(error)
      })
      // Return empty template structure if file not found
      return {
        templates: [],
        categories: {},
        version: '1.0.0'
      }
    }
  }, {
    detail: {
      summary: 'Get MCP server templates',
      description: 'Get catalog of pre-configured MCP server templates for quick setup',
      tags: ['mcp-management']
    },
    response: {
      200: t.Object({
        templates: t.Array(t.Any()),
        categories: t.Record(t.String(), t.Any()),
        version: t.String()
      }),
      401: ErrorResponse,
      500: ErrorResponse
    }
  })

  /**
   * List all configured MCP servers
   */
  .get('/', async ({ headers }): Promise<McpServersListResponseType> => {
    // Validate authentication
    const authHeader = headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Unauthorized')
    }
    
    const token = authHeader.substring(7)
    await validateToken(token) // Will throw if invalid
    
    const configuredServers = getConfiguredServers()
    const servers: McpServerInfoType[] = []
    let connectedCount = 0
    
    for (const server of configuredServers) {
      const cached = serverStatusCache.get(server.name)
      
      servers.push({
        name: server.name,
        url: server.url,
        type: server.type,
        description: server.description,
        status: cached?.status || 'unknown',
        toolCount: cached?.toolCount,
        lastChecked: cached?.lastChecked,
        error: cached?.error
      })
      
      if (cached?.status === 'connected') {
        connectedCount++
      }
    }
    
    return {
      servers,
      totalServers: servers.length,
      connectedServers: connectedCount
    }
  }, {
    detail: {
      summary: 'List MCP servers',
      description: 'Get list of configured MCP servers with their status',
      tags: ['mcp-management']
    },
    response: {
      200: McpServersListResponse,
      401: ErrorResponse,
      500: ErrorResponse
    }
  })

  /**
   * Check health of a specific MCP server
   */
  .get('/:name/health', async ({ headers, params }): Promise<McpServerHealthResponseType> => {
    // Validate authentication
    const authHeader = headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Unauthorized')
    }
    
    const token = authHeader.substring(7)
    await validateToken(token)
    
    const { name } = params
    const configuredServers = getConfiguredServers()
    const server = configuredServers.find(s => s.name === name)
    
    if (!server) {
      throw new Error(`MCP server '${name}' not found`)
    }
    
    const health = await checkServerHealth(server.url)
    
    // Update cache
    serverStatusCache.set(name, {
      status: health.status === 'healthy' ? 'connected' : health.status === 'unhealthy' ? 'error' : 'disconnected',
      toolCount: health.toolCount,
      lastChecked: new Date().toISOString(),
      error: health.error
    })
    
    return {
      name,
      status: health.status,
      responseTime: health.responseTime,
      toolCount: health.toolCount,
      error: health.error
    }
  }, {
    detail: {
      summary: 'Check MCP server health',
      description: 'Check connectivity and health of a specific MCP server',
      tags: ['mcp-management']
    },
    response: {
      200: McpServerHealthResponse,
      401: ErrorResponse,
      404: ErrorResponse,
      500: ErrorResponse
    }
  })

  /**
   * Get tools from a specific MCP server
   */
  .get('/:name/tools', async ({ headers, params }): Promise<McpServerToolsResponseType> => {
    // Validate authentication
    const authHeader = headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Unauthorized')
    }
    
    const token = authHeader.substring(7)
    await validateToken(token)
    
    const { name } = params
    const configuredServers = getConfiguredServers()
    const server = configuredServers.find(s => s.name === name)
    
    if (!server) {
      throw new Error(`MCP server '${name}' not found`)
    }
    
    try {
      const response = await fetch(server.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'listTools' }),
        signal: AbortSignal.timeout(10000)
      })
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json() as { tools?: Array<{ function: { name: string; description: string; parameters: Record<string, unknown> } }> }
      const tools = (data.tools || []).map(tool => ({
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters
      }))
      
      return {
        server: name,
        tools,
        totalTools: tools.length
      }
    } catch (error) {
      logger.server.error('Failed to fetch tools from MCP server', {
        server: name,
        error: error instanceof Error ? error.message : String(error)
      })
      throw error
    }
  }, {
    detail: {
      summary: 'List MCP server tools',
      description: 'Get available tools from a specific MCP server',
      tags: ['mcp-management']
    },
    response: {
      200: McpServerToolsResponse,
      401: ErrorResponse,
      404: ErrorResponse,
      500: ErrorResponse
    }
  })

  /**
   * Refresh health status of all servers
   */
  .post('/refresh', async ({ headers }): Promise<McpServersListResponseType> => {
    // Validate authentication
    const authHeader = headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Unauthorized')
    }
    
    const token = authHeader.substring(7)
    await validateToken(token)
    
    const configuredServers = getConfiguredServers()
    const servers: McpServerInfoType[] = []
    let connectedCount = 0
    
    // Check health of all servers in parallel
    await Promise.all(
      configuredServers.map(async (server) => {
        const health = await checkServerHealth(server.url)
        
        const status = health.status === 'healthy' ? 'connected' : health.status === 'unhealthy' ? 'error' : 'disconnected'
        
        serverStatusCache.set(server.name, {
          status,
          toolCount: health.toolCount,
          lastChecked: new Date().toISOString(),
          error: health.error
        })
        
        servers.push({
          name: server.name,
          url: server.url,
          type: server.type,
          description: server.description,
          status,
          toolCount: health.toolCount,
          lastChecked: new Date().toISOString(),
          error: health.error
        })
        
        if (status === 'connected') {
          connectedCount++
        }
      })
    )
    
    return {
      servers,
      totalServers: servers.length,
      connectedServers: connectedCount
    }
  }, {
    detail: {
      summary: 'Refresh MCP servers status',
      description: 'Check health of all MCP servers and update their status',
      tags: ['mcp-management']
    },
    response: {
      200: McpServersListResponse,
      401: ErrorResponse,
      500: ErrorResponse
    }
  })

  /**
   * Add a new MCP server
   */
  .post('/', async ({ headers, body }): Promise<McpServerInfoType> => {
    // Validate authentication
    const authHeader = headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Unauthorized')
    }
    
    const token = authHeader.substring(7)
    await validateToken(token)
    
    const { name, url, description } = body as McpServerCreateType
    
    // Check if server with this name already exists
    const existing = getConfiguredServers().find(s => s.name === name)
    if (existing) {
      throw new Error(`MCP server with name '${name}' already exists`)
    }
    
    // Validate URL format
    try {
      new URL(url)
    } catch {
      throw new Error('Invalid URL format')
    }
    
    // Add to dynamic servers
    dynamicServers.set(name, { url, description })
    
    // Check initial health
    const health = await checkServerHealth(url)
    const status = health.status === 'healthy' ? 'connected' : health.status === 'unhealthy' ? 'error' : 'disconnected'
    
    serverStatusCache.set(name, {
      status,
      toolCount: health.toolCount,
      lastChecked: new Date().toISOString(),
      error: health.error
    })
    
    logger.server.info('Added new MCP server', { name, url })
    
    return {
      name,
      url,
      type: 'external',
      description,
      status,
      toolCount: health.toolCount,
      lastChecked: new Date().toISOString(),
      error: health.error
    }
  }, {
    body: McpServerCreate,
    detail: {
      summary: 'Add MCP server',
      description: 'Register a new external MCP server',
      tags: ['mcp-management']
    },
    response: {
      200: McpServerInfo,
      400: ErrorResponse,
      401: ErrorResponse,
      409: ErrorResponse,
      500: ErrorResponse
    }
  })

  /**
   * Update an existing MCP server
   */
  .patch('/:name', async ({ headers, params, body }): Promise<McpServerInfoType> => {
    // Validate authentication
    const authHeader = headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Unauthorized')
    }
    
    const token = authHeader.substring(7)
    await validateToken(token)
    
    const { name } = params
    const { url, description } = body as McpServerUpdateType
    
    // Check if server exists in dynamic servers
    const existing = dynamicServers.get(name)
    if (!existing) {
      throw new Error(`MCP server '${name}' not found or cannot be modified (only dynamically added servers can be updated)`)
    }
    
    // Update fields
    if (url) {
      try {
        new URL(url)
      } catch {
        throw new Error('Invalid URL format')
      }
      existing.url = url
    }
    
    if (description !== undefined) {
      existing.description = description
    }
    
    dynamicServers.set(name, existing)
    
    // Re-check health
    const health = await checkServerHealth(existing.url)
    const status = health.status === 'healthy' ? 'connected' : health.status === 'unhealthy' ? 'error' : 'disconnected'
    
    serverStatusCache.set(name, {
      status,
      toolCount: health.toolCount,
      lastChecked: new Date().toISOString(),
      error: health.error
    })
    
    logger.server.info('Updated MCP server', { name, url: existing.url })
    
    return {
      name,
      url: existing.url,
      type: 'external',
      description: existing.description,
      status,
      toolCount: health.toolCount,
      lastChecked: new Date().toISOString(),
      error: health.error
    }
  }, {
    body: McpServerUpdate,
    detail: {
      summary: 'Update MCP server',
      description: 'Update configuration of an existing external MCP server',
      tags: ['mcp-management']
    },
    response: {
      200: McpServerInfo,
      400: ErrorResponse,
      401: ErrorResponse,
      404: ErrorResponse,
      500: ErrorResponse
    }
  })

  /**
   * Delete an MCP server
   */
  .delete('/:name', async ({ headers, params }): Promise<{ success: boolean; message: string }> => {
    // Validate authentication
    const authHeader = headers['authorization']
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('Unauthorized')
    }
    
    const token = authHeader.substring(7)
    await validateToken(token)
    
    const { name } = params
    
    // Only allow deletion of dynamically added servers
    if (!dynamicServers.has(name)) {
      throw new Error(`MCP server '${name}' not found or cannot be deleted (only dynamically added servers can be removed)`)
    }
    
    dynamicServers.delete(name)
    serverStatusCache.delete(name)
    
    logger.server.info('Deleted MCP server', { name })
    
    return {
      success: true,
      message: `MCP server '${name}' deleted successfully`
    }
  }, {
    detail: {
      summary: 'Delete MCP server',
      description: 'Remove a dynamically added MCP server',
      tags: ['mcp-management']
    },
    response: {
      200: t.Object({
        success: t.Boolean(),
        message: t.String()
      }),
      401: ErrorResponse,
      404: ErrorResponse,
      500: ErrorResponse
    }
  })

