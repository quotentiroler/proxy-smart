import { t, type Static } from 'elysia'
import { AttributesMap } from './common'

/**
 * Role Management schemas
 */

export const Role = t.Object({
  id: t.Optional(t.String({ description: 'Role ID' })),
  name: t.Optional(t.String({ description: 'Role name' })),
  description: t.Optional(t.String({ description: 'Role description' })),
  attributes: t.Optional(AttributesMap)
}, { title: 'Role' })

export const RoleResponse = t.Object({
  id: t.Optional(t.String({ description: 'Role ID' })),
  name: t.Optional(t.String({ description: 'Role name' })),
  description: t.Optional(t.String({ description: 'Role description' })),
  attributes: t.Optional(AttributesMap)
}, { title: 'RoleResponse' })

export const CreateRoleRequest = t.Object({
  name: t.String({ description: 'Role name (must be unique)' }),
  description: t.Optional(t.String({ description: 'Role description' })),
  fhirScopes: t.Optional(t.Array(t.String(), { description: 'FHIR scopes associated with this role' }))
}, { title: 'CreateRoleRequest' })

export const UpdateRoleRequest = t.Object({
  description: t.Optional(t.String({ description: 'Role description' })),
  fhirScopes: t.Optional(t.Array(t.String(), { description: 'FHIR scopes associated with this role' }))
}, { title: 'UpdateRoleRequest' })

// TypeScript type inference helpers
export type RoleType = Static<typeof Role>
export type RoleResponseType = Static<typeof RoleResponse>
export type CreateRoleRequestType = Static<typeof CreateRoleRequest>
export type UpdateRoleRequestType = Static<typeof UpdateRoleRequest>
