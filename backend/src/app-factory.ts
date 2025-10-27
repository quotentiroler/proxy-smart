import { Elysia } from 'elysia'
import { openapi, fromTypes } from '@elysiajs/openapi'
import { cors } from '@elysiajs/cors'
import staticPlugin from '@elysiajs/static'
import { join } from 'path'
import { keycloakPlugin } from './lib/keycloak-plugin'
import { fhirRoutes } from './routes/fhir'
import { statusRoutes } from './routes/status'
import { serverDiscoveryRoutes } from './routes/fhir-servers'
import { oauthMonitoringRoutes } from './routes/oauth-monitoring'
import { oauthWebSocket } from './routes/oauth-websocket'
import { config } from './config'
import { adminRoutes } from './routes/admin'
import { authRoutes } from './routes/auth'
import { mcpMetadataRoutes } from './routes/auth/mcp-metadata'
import { docsRoutes } from './routes/docs'
import { mcpHttpRoutes } from './routes/mcp-http'

export function createApp() {
    const app = new Elysia({
        name: config.name,
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
                process.env.NODE_ENV === 'production' ? 'dist/index.d.ts' : 'src/index.ts',
                { projectRoot: join(import.meta.dir, '..') }
            ),
            documentation: {
                info: {
                    title: config.displayName,
                    version: config.version,
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
                servers: [
                    { url: config.baseUrl, description: 'Development server' }
                ]
            }
        }))
        .use(staticPlugin({ assets: 'public', prefix: '/' }))
        .use(keycloakPlugin)
        .use(docsRoutes)
        .use(mcpMetadataRoutes)
        // Optional: HTTP MCP endpoints (legacy/alt transport) behind a flag
        .use(process.env.MCP_HTTP_ENABLED === 'true' ? mcpHttpRoutes : (new Elysia()))
        .use(statusRoutes)
        .use(serverDiscoveryRoutes)
        .use(authRoutes)
        .use(adminRoutes)
        .use(oauthMonitoringRoutes)
        .use(oauthWebSocket)
        .use(fhirRoutes)

    return app
}
