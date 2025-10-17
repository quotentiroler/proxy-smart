import { t, type Static } from 'elysia'
import { FhirEndpoints } from './common'

/**
 * FHIR Server Management schemas
 */

/**
 * Core server information fields (reused across multiple schemas)
 */
const FhirServerCoreFields = {
  name: t.String({ description: 'Server identifier/name' }),
  url: t.String({ description: 'Base URL of the FHIR server' }),
  fhirVersion: t.String({ description: 'FHIR version (e.g., R4, R5)' }),
  serverVersion: t.Optional(t.String({ description: 'FHIR server software version' })),
  serverName: t.Optional(t.String({ description: 'FHIR server software name' })),
  supported: t.Boolean({ description: 'Whether the server is supported by this proxy' })
}

export const FhirServerResponse = t.Object({
  id: t.String({ description: 'Server ID' }),
  ...FhirServerCoreFields,
  endpoints: FhirEndpoints
}, { title: 'FhirServer' })

export const FhirServerListResponse = t.Object({
  totalServers: t.Number({ description: 'Total number of configured servers' }),
  servers: t.Array(t.Object({
    id: t.String({ description: 'Server ID' }),
    ...FhirServerCoreFields,
    error: t.Optional(t.String({ description: 'Error message if server is not reachable' })),
    endpoints: FhirEndpoints
  }))
}, { title: 'FhirServerList' })

export const FhirServerInfoResponse = t.Object({
  ...FhirServerCoreFields,
  endpoints: FhirEndpoints
}, { title: 'FhirServerDetails' })

export const FhirServerConfig = t.Object({
  name: t.String({ description: 'Server identifier' }),
  displayName: t.String({ description: 'Display name for UI' }),
  url: t.String({ description: 'Base URL of the FHIR server' }),
  fhirVersion: t.String({ description: 'FHIR version' }),
  serverName: t.Optional(t.String({ description: 'Server software name' })),
  serverVersion: t.Optional(t.String({ description: 'Server software version' })),
  supported: t.Boolean({ description: 'Whether the server is supported' }),
  enabled: t.Optional(t.Boolean({ description: 'Whether the server is enabled', default: true })),
  endpoints: FhirEndpoints,
  capabilities: t.Optional(t.Array(t.String(), { description: 'FHIR capabilities/interactions' })),
  lastUpdated: t.Optional(t.String({ description: 'Last update timestamp (ISO 8601)' }))
}, { title: 'FhirServerConfig' })

export const AddFhirServerRequest = t.Object({
  url: t.String({ description: 'Base URL of the FHIR server to add' }),
  name: t.Optional(t.String({ description: 'Optional custom name for the server' }))
}, { title: 'AddFhirServerRequest' })

export const UpdateFhirServerRequest = t.Object({
  url: t.String({ description: 'New base URL for the FHIR server' }),
  name: t.Optional(t.String({ description: 'New name for the server' }))
}, { title: 'UpdateFhirServerRequest' })

export const ServerIdParam = t.Object({
  server_id: t.String({ description: 'Server identifier' })
}, { title: 'ServerIdParam' })

// TypeScript type inference helpers
export type FhirServerResponseType = Static<typeof FhirServerResponse>
export type FhirServerListResponseType = Static<typeof FhirServerListResponse>
export type FhirServerInfoResponseType = Static<typeof FhirServerInfoResponse>
export type FhirServerConfigType = Static<typeof FhirServerConfig>
export type AddFhirServerRequestType = Static<typeof AddFhirServerRequest>
export type UpdateFhirServerRequestType = Static<typeof UpdateFhirServerRequest>
