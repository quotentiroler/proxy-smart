import { readFileSync } from 'fs'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

// Get package.json path - try multiple strategies for robustness
let packageJson: { name: string; displayName?: string; version: string }
try {
  // Strategy 1: Use import.meta.url (works in ES modules)
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const packageJsonPath = join(__dirname, '..', 'package.json')
  packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
} catch {
  // Strategy 2: Use process.cwd() (works in Bun)
  try {
    const packageJsonPath = resolve(process.cwd(), 'package.json')
    packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  } catch {
    // Strategy 3: Fallback defaults
    packageJson = {
      name: 'proxy-smart-backend',
      displayName: 'Proxy Smart Backend',
      version: '0.0.1-alpha'
    }
  }
}

/**
 * Application configuration from environment variables
 */
export const config = {
  baseUrl: process.env.BASE_URL || 'http://localhost:8445',
  port: process.env.PORT || 8445,
  
  // Application name and version from package.json
  name: packageJson.name,
  displayName: packageJson.displayName || packageJson.name,
  version: packageJson.version,
  
  keycloak: {
    // Dynamic getters that read from process.env for real-time updates
    get baseUrl() {
      return process.env.KEYCLOAK_BASE_URL || null
    },
    
    get realm() {
      return process.env.KEYCLOAK_REALM || null
    },
    
    get adminClientId() {
      return process.env.KEYCLOAK_ADMIN_CLIENT_ID || null
    },
    
    get adminClientSecret() {
      return process.env.KEYCLOAK_ADMIN_CLIENT_SECRET || null
    },
    
    // Check if Keycloak is configured
    get isConfigured() {
      return !!(this.baseUrl && this.realm)
    },
    
    // Public URL for browser redirects (defaults to baseUrl if not specified)
    get publicUrl() {   
      if (!this.baseUrl) return null
      const domain = process.env.KEYCLOAK_DOMAIN;
      if (!domain) return this.baseUrl
      // Use regex to replace the hostname in the URL, preserving protocol and port
      return this.baseUrl.replace(/\/\/([^:/]+)(:[0-9]+)?/, `//${domain}$2`)
    },
    
    // Dynamically construct JWKS URI from base URL and realm
    get jwksUri() {
      if (!this.baseUrl || !this.realm) return null
      return `${this.baseUrl}/realms/${this.realm}/protocol/openid-connect/certs`
    },
  },
  
  fhir: {
    // Support multiple FHIR servers - can be a single URL or comma-separated list
    serverBases: (process.env.FHIR_SERVER_BASE ?? 'http://localhost:8081/fhir').split(',').map(s => s.trim()),
    supportedVersions: process.env.FHIR_SUPPORTED_VERSIONS?.split(',').map(s => s.trim()) || ['R4'],
  },

  smart: {
    configCacheTtl: parseInt(process.env.SMART_CONFIG_CACHE_TTL || '300000'), // 5 minutes
    scopesSupported: process.env.SMART_SCOPES_SUPPORTED?.split(',').map(s => s.trim()),
    capabilities: process.env.SMART_CAPABILITIES?.split(',').map(s => s.trim()),
  },

  ai: {
    get baseUrl() {
      return process.env.MCP_SERVER_URL || 'http://localhost:8081';
    },
    // AI routing flags
    // In MONO_MODE, we use the internal Node AI; otherwise we proxy to the remote (Python MCP) AI
    get useInternalAI() {
      return (process.env.MONO_MODE || '').toLowerCase() === 'true'
    },
    get useRemoteAI() {
      return !this.useInternalAI
    },
    get chatEndpoint() {
      return `${this.baseUrl.replace(/\/$/, '')}/ai/chat`;
    },
    get healthEndpoint() {
      return `${this.baseUrl.replace(/\/$/, '')}/health`;
    },
    get timeoutMs() {
      return Number.parseInt(process.env.MCP_SERVER_TIMEOUT_MS || '30000', 10); // 30 seconds for reasoning models
    },
    get openaiApiKey() {
      return process.env.OPENAI_API_KEY || null;
    },
    get enabled() {
      return !!this.baseUrl;
    }
  },

  mcp: {
    // Whether to expose MCP HTTP discovery metadata
    get httpEnabled() {
      return (process.env.MCP_HTTP_ENABLED || 'true').toLowerCase() !== 'false'
    },
    // Base URI for the resource identifier (scheme+host[:port])
    get resourceBase() {
      return (process.env.MCP_HTTP_RESOURCE_URI || config.baseUrl).replace(/\/$/, '')
    },
    // Path that identifies the MCP HTTP endpoint (can be empty)
    get resourcePath() {
      // Default to '/mcp' as the canonical path if using HTTP transport later
      const p = process.env.MCP_HTTP_RESOURCE_PATH ?? '/mcp'
      return p.startsWith('/') ? p : `/${p}`
    },
    // Canonical Resource URI per RFC 8707 (no fragment, prefer no trailing slash)
    get canonicalResource() {
      const base = this.resourceBase
      const path = this.resourcePath
      const full = `${base}${path}`
      // Normalize to no trailing slash unless path is root
      return full.endsWith('/') && path !== '/' ? full.slice(0, -1) : full
    },
    // Authorization servers (issuer URLs) for this resource
    get authorizationServers() {
      const envList = process.env.MCP_AUTHORIZATION_SERVERS
        ? process.env.MCP_AUTHORIZATION_SERVERS.split(',').map(s => s.trim()).filter(Boolean)
        : []
      if (envList.length) return envList
      // Fallback to Keycloak issuer if configured
      if (config.keycloak.isConfigured) {
        const base = config.keycloak.publicUrl || config.keycloak.baseUrl
        const realm = config.keycloak.realm
        if (base && realm) return [`${base.replace(/\/$/, '')}/realms/${realm}`]
      }
      return [] as string[]
    },
    // Scopes supported by this resource (authorization guidance for clients)
    get scopesSupported() {
      const env = process.env.MCP_SCOPES_SUPPORTED
      if (env) {
        // Support comma or space separated
        const parts = env.split(/[,\s]+/).map(s => s.trim()).filter(Boolean)
        if (parts.length) return parts
      }
      return ['tools:use']
    },
    // Optional scope value to send in WWW-Authenticate challenges
    get scopeChallenge() {
      return process.env.MCP_SCOPE_CHALLENGE || this.scopesSupported[0] || undefined
    },
    // JWT audience claim - what audience should tokens have to be accepted?
    // Defaults to the canonical resource URI (e.g., "http://localhost:8445/mcp")
    get audience() {
      return process.env.JWT_AUDIENCE || this.canonicalResource
    }
  },

  cors: {
    // Support multiple origins - can be a single URL or comma-separated list
    // Defaults to common development origins
    get origins() {
      const defaultOrigins = [
        'http://localhost:5173', // Vite dev server
        'http://localhost:3000', // React dev server  
        'http://localhost:8445', // App server
        config.baseUrl // Fallback to base URL
      ];
      
      const envOrigins = process.env.CORS_ORIGINS?.split(',').map(s => s.trim()) || [];
      
      // In development mode, allow all localhost origins
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV !== 'production') {
        const allOrigins = [...new Set([...defaultOrigins, ...envOrigins])];
        return allOrigins.filter(Boolean);
      }
      
      // In production, only use explicitly configured origins or fallback to base URL
      return envOrigins.length > 0 ? envOrigins : [config.baseUrl];
    }
  }
} as const
