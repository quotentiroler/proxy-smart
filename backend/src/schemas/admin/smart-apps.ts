import { t, type Static } from 'elysia'
import { AttributesMap, AppTypeLiteral, ClientTypeLiteral } from './common'

/**
 * SMART App/Client Management schemas
 */

export const SmartApp = t.Object({
  id: t.Optional(t.String({ description: 'Internal ID' })),
  clientId: t.Optional(t.String({ description: 'OAuth2 client ID' })),
  name: t.Optional(t.String({ description: 'Application name' })),
  description: t.Optional(t.String({ description: 'Application description' })),
  enabled: t.Optional(t.Boolean({ description: 'Whether the app is enabled' })),
  protocol: t.Optional(t.String({ description: 'Protocol (openid-connect)' })),
  publicClient: t.Optional(t.Boolean({ description: 'Whether this is a public client' })),
  redirectUris: t.Optional(t.Array(t.String(), { description: 'Allowed redirect URIs' })),
  webOrigins: t.Optional(t.Array(t.String(), { description: 'Allowed web origins (CORS)' })),
  attributes: t.Optional(AttributesMap),
  clientAuthenticatorType: t.Optional(t.String({ description: 'Client authentication method' })),
  serviceAccountsEnabled: t.Optional(t.Boolean({ description: 'Enable service accounts' })),
  standardFlowEnabled: t.Optional(t.Boolean({ description: 'Enable authorization code flow' })),
  implicitFlowEnabled: t.Optional(t.Boolean({ description: 'Enable implicit flow' })),
  directAccessGrantsEnabled: t.Optional(t.Boolean({ description: 'Enable direct access grants' })),
  defaultClientScopes: t.Optional(t.Array(t.String(), { description: 'Default scopes' })),
  optionalClientScopes: t.Optional(t.Array(t.String(), { description: 'Optional scopes' })),
  appType: t.Optional(AppTypeLiteral),
  clientType: t.Optional(ClientTypeLiteral),
  secret: t.Optional(t.String({ description: 'Client secret for symmetric authentication (only for confidential clients)' })),
  access: t.Optional(t.Record(t.String(), t.Boolean(), { description: 'Keycloak admin console permissions (configure, manage, view) - informational only' })),
  
  // Additional UI/metadata fields
  launchUrl: t.Optional(t.String({ description: 'SMART App launch URL' })),
  logoUri: t.Optional(t.String({ description: 'Logo URI for application display' })),
  tosUri: t.Optional(t.String({ description: 'Terms of Service URI' })),
  policyUri: t.Optional(t.String({ description: 'Privacy Policy URI' })),
  contacts: t.Optional(t.Array(t.String(), { description: 'Contact emails or names' })),
  
  // Server access control
  serverAccessType: t.Optional(t.Union([
    t.Literal('all-servers'),
    t.Literal('selected-servers'),
    t.Literal('user-person-servers')
  ], { description: 'FHIR server access control type' })),
  allowedServerIds: t.Optional(t.Array(t.String(), { description: 'List of allowed FHIR server IDs' })),
  
  // Scope set reference
  scopeSetId: t.Optional(t.String({ description: 'Reference to a predefined scope set configuration' })),
  
  // PKCE and offline access
  requirePkce: t.Optional(t.Boolean({ description: 'Require PKCE for public clients' })),
  allowOfflineAccess: t.Optional(t.Boolean({ description: 'Allow offline access (refresh tokens)' }))
}, { title: 'SmartApp' })

export const CreateSmartAppRequest = t.Object({
  clientId: t.String({ description: 'OAuth2 client ID (must be unique)' }),
  name: t.String({ description: 'Application name' }),
  description: t.Optional(t.String({ description: 'Application description' })),
  publicClient: t.Optional(t.Boolean({ description: 'Whether this is a public client', default: true })),
  redirectUris: t.Optional(t.Array(t.String(), { description: 'Allowed redirect URIs' })),
  webOrigins: t.Optional(t.Array(t.String(), { description: 'Allowed web origins' })),
  defaultClientScopes: t.Optional(t.Array(t.String(), { description: 'Default SMART scopes' })),
  optionalClientScopes: t.Optional(t.Array(t.String(), { description: 'Optional SMART scopes' })),
  smartVersion: t.Optional(t.String({ description: 'SMART App Launch version' })),
  fhirVersion: t.Optional(t.String({ description: 'FHIR version' })),
  appType: t.Optional(AppTypeLiteral),
  clientType: t.Optional(ClientTypeLiteral),
  secret: t.Optional(t.String({ description: 'Client secret for symmetric authentication (only for confidential clients)' })),
  publicKey: t.Optional(t.String({ description: 'Public key for JWT authentication (PEM format)' })),
  jwksUri: t.Optional(t.String({ description: 'JWKS URI for JWT authentication' })),
  systemScopes: t.Optional(t.Array(t.String(), { description: 'System-level scopes for backend services' })),
  
  // Additional UI/metadata fields
  launchUrl: t.Optional(t.String({ description: 'SMART App launch URL' })),
  logoUri: t.Optional(t.String({ description: 'Logo URI for application display' })),
  tosUri: t.Optional(t.String({ description: 'Terms of Service URI' })),
  policyUri: t.Optional(t.String({ description: 'Privacy Policy URI' })),
  contacts: t.Optional(t.Array(t.String(), { description: 'Contact emails or names' })),
  
  // Server access control
  serverAccessType: t.Optional(t.Union([
    t.Literal('all-servers'),
    t.Literal('selected-servers'),
    t.Literal('user-person-servers')
  ], { description: 'FHIR server access control type' })),
  allowedServerIds: t.Optional(t.Array(t.String(), { description: 'List of allowed FHIR server IDs (when serverAccessType is selected-servers)' })),
  
  // Scope set reference
  scopeSetId: t.Optional(t.String({ description: 'Reference to a predefined scope set configuration' })),
  
  // PKCE and offline access
  requirePkce: t.Optional(t.Boolean({ description: 'Require Proof Key for Code Exchange (PKCE) for public clients' })),
  allowOfflineAccess: t.Optional(t.Boolean({ description: 'Allow offline access (refresh tokens)' }))
}, { title: 'CreateSmartAppRequest' })

export const UpdateSmartAppRequest = t.Object({
  name: t.Optional(t.String({ description: 'Application name' })),
  description: t.Optional(t.String({ description: 'Application description' })),
  enabled: t.Optional(t.Boolean({ description: 'Whether the app is enabled' })),
  publicClient: t.Optional(t.Boolean({ description: 'Whether this is a public client' })),
  redirectUris: t.Optional(t.Array(t.String(), { description: 'Allowed redirect URIs' })),
  webOrigins: t.Optional(t.Array(t.String(), { description: 'Allowed web origins' })),
  defaultClientScopes: t.Optional(t.Array(t.String(), { description: 'Default SMART scopes' })),
  optionalClientScopes: t.Optional(t.Array(t.String(), { description: 'Optional SMART scopes' })),
  smartVersion: t.Optional(t.String({ description: 'SMART App Launch version' })),
  fhirVersion: t.Optional(t.String({ description: 'FHIR version' })),
  appType: t.Optional(AppTypeLiteral),
  clientType: t.Optional(ClientTypeLiteral),
  secret: t.Optional(t.String({ description: 'Client secret for symmetric authentication (only for confidential clients)' })),
  publicKey: t.Optional(t.String({ description: 'Public key for JWT authentication (PEM format)' })),
  jwksUri: t.Optional(t.String({ description: 'JWKS URI for JWT authentication' })),
  systemScopes: t.Optional(t.Array(t.String(), { description: 'System-level scopes for backend services' })),
  
  // Additional UI/metadata fields
  launchUrl: t.Optional(t.String({ description: 'SMART App launch URL' })),
  logoUri: t.Optional(t.String({ description: 'Logo URI for application display' })),
  tosUri: t.Optional(t.String({ description: 'Terms of Service URI' })),
  policyUri: t.Optional(t.String({ description: 'Privacy Policy URI' })),
  contacts: t.Optional(t.Array(t.String(), { description: 'Contact emails or names' })),
  
  // Server access control
  serverAccessType: t.Optional(t.Union([
    t.Literal('all-servers'),
    t.Literal('selected-servers'),
    t.Literal('user-person-servers')
  ], { description: 'FHIR server access control type' })),
  allowedServerIds: t.Optional(t.Array(t.String(), { description: 'List of allowed FHIR server IDs' })),
  
  // Scope set reference
  scopeSetId: t.Optional(t.String({ description: 'Reference to a predefined scope set configuration' })),
  
  // PKCE and offline access
  requirePkce: t.Optional(t.Boolean({ description: 'Require PKCE for public clients' })),
  allowOfflineAccess: t.Optional(t.Boolean({ description: 'Allow offline access (refresh tokens)' }))
}, { title: 'UpdateSmartAppRequest' })

export const ClientIdParam = t.Object({
  clientId: t.String({ description: 'OAuth2 client ID' })
}, { title: 'ClientIdParam' })

// TypeScript type inference helpers
export type SmartAppType = Static<typeof SmartApp>
export type CreateSmartAppRequestType = Static<typeof CreateSmartAppRequest>
export type UpdateSmartAppRequestType = Static<typeof UpdateSmartAppRequest>
