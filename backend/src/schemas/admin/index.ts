/**
 * Admin schemas - Re-export all admin-related schemas
 * 
 * This index file provides a single entry point for all admin schemas
 * while maintaining the modular structure in separate files.
 */

// Common/Shared schemas
export * from './common'

// Domain-specific schemas
export * from './users'
export * from './smart-apps'
export * from './roles'
export * from './fhir-servers'
export * from './mtls'
export * from './identity-providers'
export * from './launch-context'
export * from './keycloak'