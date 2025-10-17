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
  access: t.Optional(t.Record(t.String(), t.Boolean()))
}, { title: 'SmartApp' })

export const CreateSmartAppRequest = t.Object({
  clientId: t.String({ description: 'OAuth2 client ID (must be unique)' }),
  name: t.String({ description: 'Application name' }),
  description: t.Optional(t.String({ description: 'Application description' })),
  publicClient: t.Optional(t.Boolean({ description: 'Whether this is a public client', default: true })),
  redirectUris: t.Optional(t.Array(t.String(), { description: 'Allowed redirect URIs' })),
  webOrigins: t.Optional(t.Array(t.String(), { description: 'Allowed web origins' })),
  defaultScopes: t.Optional(t.Array(t.String(), { description: 'Default SMART scopes' })),
  optionalScopes: t.Optional(t.Array(t.String(), { description: 'Optional SMART scopes' })),
  smartVersion: t.Optional(t.String({ description: 'SMART App Launch version' })),
  fhirVersion: t.Optional(t.String({ description: 'FHIR version' })),
  appType: t.Optional(AppTypeLiteral),
  clientType: t.Optional(ClientTypeLiteral),
  publicKey: t.Optional(t.String({ description: 'Public key for JWT authentication (PEM format)' })),
  jwksUri: t.Optional(t.String({ description: 'JWKS URI for JWT authentication' })),
  systemScopes: t.Optional(t.Array(t.String(), { description: 'System-level scopes for backend services' }))
}, { title: 'CreateSmartAppRequest' })

export const UpdateSmartAppRequest = t.Object({
  name: t.Optional(t.String({ description: 'Application name' })),
  description: t.Optional(t.String({ description: 'Application description' })),
  enabled: t.Optional(t.Boolean({ description: 'Whether the app is enabled' })),
  redirectUris: t.Optional(t.Array(t.String(), { description: 'Allowed redirect URIs' })),
  webOrigins: t.Optional(t.Array(t.String(), { description: 'Allowed web origins' })),
  defaultScopes: t.Optional(t.Array(t.String(), { description: 'Default SMART scopes' })),
  optionalScopes: t.Optional(t.Array(t.String(), { description: 'Optional SMART scopes' })),
  smartVersion: t.Optional(t.String({ description: 'SMART App Launch version' })),
  fhirVersion: t.Optional(t.String({ description: 'FHIR version' }))
}, { title: 'UpdateSmartAppRequest' })

export const ClientIdParam = t.Object({
  clientId: t.String({ description: 'OAuth2 client ID' })
}, { title: 'ClientIdParam' })

// TypeScript type inference helpers
export type SmartAppType = Static<typeof SmartApp>
export type CreateSmartAppRequestType = Static<typeof CreateSmartAppRequest>
export type UpdateSmartAppRequestType = Static<typeof UpdateSmartAppRequest>
