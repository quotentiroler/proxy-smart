/**
 * SMART Configuration Service
 * Dynamically builds SMART configuration from Keycloak's OpenID configuration
 * 
 * Implements SMART App Launch Framework 2.2.0 (STU 2.2)
 * - Supports both SMART 2.0 scopes (.cruds format) and v1 backwards compatibility
 * - Provides comprehensive launch context and identity management
 * - Integrates with Keycloak for OAuth2/OIDC authorization
 */

import { config } from '../config'
import type { SmartConfiguration } from '../types'

interface OpenIDConfiguration {
    issuer: string
    authorization_endpoint: string
    token_endpoint: string
    introspection_endpoint?: string
    grant_types_supported: string[]
    response_types_supported: string[]
    code_challenge_methods_supported: string[]
    token_endpoint_auth_methods_supported: string[]
    token_endpoint_auth_signing_alg_values_supported?: string[]
    scopes_supported?: string[]
}

interface CachedConfig {
    config: SmartConfiguration
    timestamp: number
    ttl: number
}

class SmartConfigService {
    private cachedConfig: CachedConfig | null = null
    private readonly cacheTTL = parseInt(process.env.SMART_CONFIG_CACHE_TTL || '300000') // 5 minutes default
    private readonly keycloakDiscoveryUrl = `${config.keycloak.baseUrl}/realms/${config.keycloak.realm}/.well-known/openid-configuration`

    /**
     * Get SMART configuration, using cache if available and valid
     */
    async getSmartConfiguration(): Promise<SmartConfiguration> {
        const now = Date.now()

        // Check if we have valid cached config
        if (this.cachedConfig && (now - this.cachedConfig.timestamp) < this.cachedConfig.ttl) {
            return this.cachedConfig.config
        }

        // Fetch fresh config from Keycloak
        const freshConfig = await this.fetchAndBuildSmartConfig()

        // Cache the result
        this.cachedConfig = {
            config: freshConfig,
            timestamp: now,
            ttl: this.cacheTTL
        }

        return freshConfig
    }

    /**
     * Fetch OpenID configuration from Keycloak and build SMART config
     */
    private async fetchAndBuildSmartConfig(): Promise<SmartConfiguration> {
        try {
            console.log(`Fetching OpenID configuration from: ${this.keycloakDiscoveryUrl}`)

            const response = await fetch(this.keycloakDiscoveryUrl, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'SMART-on-FHIR-Proxy/1.0'
                },
                // Add timeout to prevent hanging
                signal: AbortSignal.timeout(10000) // 10 second timeout
            })

            if (!response.ok) {
                throw new Error(`Failed to fetch OpenID configuration: ${response.status} ${response.statusText}`)
            }

            const openidConfig: OpenIDConfiguration = await response.json()
            return this.buildSmartConfigFromOpenID(openidConfig)

        } catch (error) {
            console.error('Failed to fetch Keycloak OpenID configuration:', error)
            throw new Error(`SMART configuration unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    /**
     * Build SMART configuration from OpenID configuration
     */
    private buildSmartConfigFromOpenID(openidConfig: OpenIDConfiguration): SmartConfiguration {
        // Build scopes - combine OpenID scopes with SMART-specific scopes
        const baseScopes = openidConfig.scopes_supported || ['openid', 'profile']
        const smartScopes = this.getSmartScopes()
        const allScopes = [...new Set([...baseScopes, ...smartScopes])]

        return {
            // Use our proxy endpoints, not Keycloak's direct endpoints
            issuer: openidConfig.issuer,
            authorization_endpoint: `${config.baseUrl}/auth/authorize`,
            token_endpoint: `${config.baseUrl}/auth/token`,
            introspection_endpoint: `${config.baseUrl}/auth/introspect`,

            // Use Keycloak's reported capabilities
            code_challenge_methods_supported: openidConfig.code_challenge_methods_supported,
            grant_types_supported: openidConfig.grant_types_supported,
            response_types_supported: openidConfig.response_types_supported,
            token_endpoint_auth_methods_supported: openidConfig.token_endpoint_auth_methods_supported,
            token_endpoint_auth_signing_alg_values_supported: openidConfig.token_endpoint_auth_signing_alg_values_supported || ['RS256', 'RS384', 'ES384'],

            // Combine discovered and SMART-specific scopes
            scopes_supported: allScopes,

            // SMART capabilities based on what we support
            capabilities: this.getSmartCapabilities()
        }
    }

    /**
     * Get SMART-specific scopes based on SMART App Launch 2.2.0 specification
     */
    private getSmartScopes(): string[] {
        const envScopes = process.env.SMART_SCOPES_SUPPORTED?.split(',').map(s => s.trim())

        return envScopes || [
            // OpenID Connect scopes
            'openid',
            'profile',
            'fhirUser',

            // Launch context scopes
            'launch',
            'launch/patient',
            'launch/encounter',

            // Session management scopes
            'online_access',
            'offline_access',

            // Patient-level resource access (SMART 2.0 format)
            'patient/*.cruds',     // Full CRUDS access (create, read, update, delete, search)
            'patient/*.rs',        // Read and search access (SMART standard)
            'patient/*.read',      // v1 compatibility - mapped to .rs in v2
            'patient/*.write',     // v1 compatibility - mapped to .cud in v2
            'patient/*.*',         // v1 compatibility - mapped to .cruds in v2

            // User-level resource access (SMART 2.0 format)
            'user/*.cruds',        // Full CRUDS access
            'user/*.rs',           // Read and search access
            'user/*.read',         // v1 compatibility
            'user/*.write',        // v1 compatibility
            'user/*.*',            // v1 compatibility

            // System-level resource access (SMART 2.0 format)
            'system/*.cruds',      // Full CRUDS access
            'system/*.rs',         // Read and search access
            'system/*.read',       // v1 compatibility
            'system/*.write',      // v1 compatibility
            'system/*.*'           // v1 compatibility
        ]
    }

    /**
     * Get SMART capabilities based on SMART App Launch 2.2.0 specification
     */
    private getSmartCapabilities(): string[] {
        const envCapabilities = process.env.SMART_CAPABILITIES?.split(',').map(s => s.trim())

        return envCapabilities || [
            // Launch flows
            'launch-ehr',
            'launch-standalone',
            
            // Client types
            'client-public',
            'client-confidential-symmetric',
            'client-confidential-asymmetric',
            
            // Authentication & SSO
            'sso-openid-connect',
            
            // Context capabilities
            'context-standalone-patient',
            'context-ehr-patient',
            'context-ehr-encounter',
            
            // SMART 2.0 features
            'permission-offline',
            'permission-online',
            'permission-patient',
            'permission-user',
            'permission-v2',      // Indicates support for SMART 2.0 scopes (.cruds format)
            'permission-v1'       // Indicates backwards compatibility with SMART 1.0 scopes
        ]
    }

    /**
     * Clear cache - useful for testing or manual refresh
     */
    clearCache(): void {
        this.cachedConfig = null
    }
}

// Export singleton instance
export const smartConfigService = new SmartConfigService()
