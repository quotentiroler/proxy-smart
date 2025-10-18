import { Elysia } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'
import { cors } from '@elysiajs/cors'
import { config } from './config'
import { keycloakPlugin } from './lib/keycloak-plugin'
import { fhirRoutes } from './routes/fhir'
import { statusRoutes } from './routes/status'
import { serverDiscoveryRoutes } from './routes/fhir-servers'
import { oauthMonitoringRoutes } from './routes/oauth-monitoring'
import { oauthWebSocket } from './routes/oauth-websocket'
import { adminRoutes } from './routes/admin'
import { authRoutes } from './routes/auth'
import { aiRoutes, aiPublicRoutes } from './routes/admin/ai'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

// Minimal config for OpenAPI export - provides defaults for required environment variables
const exportConfig = {
  name: 'proxy-smart',
  displayName: 'Proxy Smart',
  version: process.env.npm_package_version || '1.0.0',
  baseUrl: 'http://localhost:3001',
  port: 3001,
  keycloak: {
    serverUrl: process.env.KEYCLOAK_SERVER_URL || 'http://localhost:8080',
    realm: process.env.KEYCLOAK_REALM || 'proxy-smart',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'proxy-smart-admin',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || 'mock-secret',
  },
  fhir: {
    serverBases: (process.env.FHIR_SERVER_BASE ?? 'http://localhost:8081/fhir')
      .split(',')
      .map(s => s.trim()),
  },
  logging: {
    level: 'info' as const,
    oauthMetrics: false,
  },
  cors: {
    allowedOrigins: ['http://localhost:5173', 'http://localhost:3000'],
  },
  enableMutualTLS: false,
}

// Create the same app configuration as the main server
const app = new Elysia({
  name: exportConfig.name,
  serve: {
    idleTimeout: 120
  },
  websocket: {
    idleTimeout: 120
  },
  aot: true,
  sanitize: (value) => Bun.escapeHTML(value)
})
  .use(cors({
    origin: config.cors.origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  }))
  .use(openapi({
    references: fromTypes(
      process.env.NODE_ENV === 'production'
        ? 'dist/index.d.ts'
        : 'src/index.ts',
      {
        projectRoot: join(import.meta.dir, '..')
      }
    ),
    documentation: {
      info: {
        title: exportConfig.displayName,
        version: exportConfig.version,
        description: 'SMART on FHIR Proxy + Healthcare Administration API using Keycloak and Elysia',
      },
      tags: [
        { name: 'authentication', description: 'Authentication and authorization endpoints' },
        { name: 'users', description: 'Healthcare user management' },
        { name: 'admin', description: 'Administrative operations' },
        { name: 'fhir', description: 'FHIR resource proxy endpoints' },
        { name: 'servers', description: 'FHIR server discovery endpoints' },
        { name: 'identity-providers', description: 'Identity provider management' },
        { name: 'smart-apps', description: 'SMART on FHIR configuration endpoints' },
        { name: 'oauth-ws-monitoring', description: 'OAuth monitoring via WebSocket' },
        { name: 'oauth-sse-monitoring', description: 'OAuth monitoring via Server-Sent Events' },
        { name: 'ai', description: 'AI assistant endpoints proxied to MCP server' },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT Bearer token from OAuth2 flow'
          },
          MutualTLS: {
            type: 'http',
            scheme: 'mutual-tls',
            description: 'Mutual TLS authentication for secure API communication between proxy and FHIR servers. Submit a request to the infrastructure team with full information about your application to obtain a client certificate.'
          }
        }
      },
      servers: [
        {
          url: exportConfig.baseUrl,
          description: 'Development server'
        }
      ]
    }
  }))
  .use(keycloakPlugin)
  .use(statusRoutes)
  .use(serverDiscoveryRoutes)
  .use(authRoutes)
  .use(adminRoutes)
  .use(oauthMonitoringRoutes)
  .use(oauthWebSocket)
  .use(aiPublicRoutes) // Public AI health checks (no auth)
  .use(aiRoutes) // Protected AI routes (with auth)
  .use(fhirRoutes)

// The OpenAPI plugin doesn't expose the spec directly, so we need to start a server
// However, we can optimize it by fetching immediately with minimal delay (100ms)
let serverInstance: ReturnType<typeof app.listen> | null = null

const exportSpec = async () => {
  try {
    // Small delay to ensure server port is available
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const port = serverInstance?.server?.port as number
    
    if (!port) {
      throw new Error('Failed to get server port')
    }
    
    console.log(`🔄 Fetching OpenAPI spec from port ${port}`)
    
    // Fetch the spec - Bun is fast enough that we don't need extra delays
    // Note: @elysiajs/openapi uses /openapi/json by default (not /swagger/json)
    const response = await fetch(`http://localhost:${port}/openapi/json`)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const spec = await response.json()
    
    // Ensure dist directory exists
    const distDir = join(process.cwd(), 'dist')
    mkdirSync(distDir, { recursive: true })

    // Write to file
    const outputPath = join(distDir, 'openapi.json')
    writeFileSync(outputPath, JSON.stringify(spec, null, 2))

    console.log(`✅ OpenAPI spec exported to: ${outputPath}`)
    
    serverInstance?.stop()
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to export OpenAPI spec:', error)
    serverInstance?.stop()
    process.exit(1)
  }
}

serverInstance = app.listen(0, exportSpec)
