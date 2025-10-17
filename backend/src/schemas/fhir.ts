import { t, type Static } from 'elysia'

/**
 * FHIR and SMART on FHIR response schemas
 */

// ==================== FHIR Server Metadata ====================

export const FhirServerMetadata = t.Object({
  fhirVersion: t.String({ description: 'FHIR version supported by server' }),
  serverVersion: t.Optional(t.String({ description: 'Server software version' })),
  serverName: t.Optional(t.String({ description: 'Server software name' })),
  supported: t.Boolean({ description: 'Whether this version is supported' })
}, { title: 'FhirServerMetadata' })

export type FhirServerMetadataType = Static<typeof FhirServerMetadata>

// ==================== Cache Refresh Response ====================

export const CacheRefreshResponse = t.Object({
  success: t.Boolean({ description: 'Whether refresh was successful' }),
  message: t.String({ description: 'Success message' }),
  serverInfo: FhirServerMetadata
}, { title: 'CacheRefreshResponse' })

export type CacheRefreshResponseType = Static<typeof CacheRefreshResponse>

// ==================== SMART Configuration Response ====================

export const SmartConfigurationResponse = t.Object({
  issuer: t.String({ description: 'OpenID Connect issuer URL' }),
  authorization_endpoint: t.String({ description: 'OAuth2 authorization endpoint' }),
  token_endpoint: t.String({ description: 'OAuth2 token endpoint' }),
  introspection_endpoint: t.String({ description: 'OAuth2 token introspection endpoint' }),
  registration_endpoint: t.Optional(t.String({ description: 'RFC 7591 Dynamic Client Registration endpoint' })),
  code_challenge_methods_supported: t.Array(t.String(), { description: 'Supported PKCE code challenge methods' }),
  grant_types_supported: t.Array(t.String(), { description: 'Supported OAuth2 grant types' }),
  response_types_supported: t.Array(t.String(), { description: 'Supported OAuth2 response types' }),
  scopes_supported: t.Array(t.String(), { description: 'Supported OAuth2 scopes' }),
  capabilities: t.Array(t.String(), { description: 'SMART on FHIR capabilities' }),
  token_endpoint_auth_methods_supported: t.Array(t.String(), { description: 'Supported token endpoint authentication methods' }),
  token_endpoint_auth_signing_alg_values_supported: t.Array(t.String(), { description: 'Supported JWT signing algorithms for token endpoint auth' })
}, { title: 'SmartConfigurationResponse' })

export type SmartConfigurationResponseType = Static<typeof SmartConfigurationResponse>

// ==================== FHIR Proxy Response ====================

export const FhirProxyResponse = t.Object({}, { 
  additionalProperties: true,
  title: 'FhirProxyResponse',
  description: 'FHIR resource response (proxied from upstream server)'
})

export type FhirProxyResponseType = Static<typeof FhirProxyResponse>

// ==================== SMART Config Refresh Response ====================

export const SmartConfigRefreshResponse = t.Object({
  message: t.String({ description: 'Refresh status message' }),
  timestamp: t.String({ description: 'Timestamp of refresh' }),
  config: t.Object({}, { additionalProperties: true, description: 'Refreshed SMART configuration' })
}, { title: 'SmartConfigRefreshResponse' })

export type SmartConfigRefreshResponseType = Static<typeof SmartConfigRefreshResponse>

