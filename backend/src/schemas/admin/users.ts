import { t, type Static } from 'elysia'
import { AttributesMap } from './common'

/**
 * Healthcare User Management schemas
 */

export const HealthcareUser = t.Object({
  id: t.String({ description: 'User ID' }),
  username: t.String({ description: 'Username' }),
  email: t.String({ description: 'Email address' }),
  firstName: t.String({ description: 'First name' }),
  lastName: t.String({ description: 'Last name' }),
  enabled: t.Boolean({ description: 'Whether the user is enabled' }),
  attributes: t.Optional(AttributesMap),
  createdTimestamp: t.Optional(t.Number({ description: 'Creation timestamp (Unix milliseconds)' })),
  lastLogin: t.Optional(t.Union([t.Number(), t.Null()], { description: 'Last login timestamp' })),
  realmRoles: t.Optional(t.Array(t.String(), { description: 'Realm-level roles' })),
  clientRoles: t.Optional(t.Record(t.String(), t.Array(t.String()))),
  organization: t.Optional(t.String({ description: 'Organization identifier' })),
  fhirUser: t.Optional(t.String({ description: 'FHIR user reference (e.g., Practitioner/123)' }))
}, { title: 'HealthcareUser' })

export const CreateHealthcareUserRequest = t.Object({
  username: t.String({ description: 'Username (must be unique)' }),
  email: t.String({ format: 'email', description: 'Email address' }),
  firstName: t.String({ description: 'First name' }),
  lastName: t.String({ description: 'Last name' }),
  organization: t.Optional(t.String({ description: 'Organization identifier' })),
  fhirUser: t.Optional(t.String({ description: 'FHIR user reference' })),
  password: t.Optional(t.String({ description: 'User password' })),
  temporaryPassword: t.Optional(t.Boolean({ description: 'Whether password is temporary and must be changed' })),
  realmRoles: t.Optional(t.Array(t.String(), { description: 'Realm-level roles to assign' })),
  clientRoles: t.Optional(t.Record(t.String(), t.Array(t.String())))
}, { title: 'CreateHealthcareUserRequest' })

export const UpdateHealthcareUserRequest = t.Object({
  firstName: t.Optional(t.String({ description: 'First name' })),
  lastName: t.Optional(t.String({ description: 'Last name' })),
  email: t.Optional(t.String({ format: 'email', description: 'Email address' })),
  enabled: t.Optional(t.Boolean({ description: 'Whether the user is enabled' })),
  organization: t.Optional(t.String({ description: 'Organization identifier' })),
  fhirUser: t.Optional(t.String({ description: 'FHIR user reference' })),
  realmRoles: t.Optional(t.Array(t.String(), { description: 'Realm-level roles' })),
  clientRoles: t.Optional(t.Record(t.String(), t.Array(t.String())))
}, { title: 'UpdateHealthcareUserRequest' })

export const UserIdParam = t.Object({
  userId: t.String({ description: 'User ID' })
}, { title: 'UserIdParam' })

// TypeScript type inference helpers
export type HealthcareUserType = Static<typeof HealthcareUser>
export type CreateHealthcareUserRequestType = Static<typeof CreateHealthcareUserRequest>
export type UpdateHealthcareUserRequestType = Static<typeof UpdateHealthcareUserRequest>
