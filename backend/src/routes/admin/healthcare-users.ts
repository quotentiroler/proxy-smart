import { Elysia, t } from 'elysia'
import { keycloakPlugin } from '../../lib/keycloak-plugin'
import { UserProfile, ErrorResponse, SuccessResponse, PaginationQuery } from '../../schemas/common'
import { extractBearerToken, UNAUTHORIZED_RESPONSE, getValidatedAdmin, mapUserProfile, AuthenticationError } from '../../lib/admin-utils'
import { logger } from '../../lib/logger'

/**
 * Healthcare User Management - specialized for healthcare professionals
 */
export const healthcareUsersRoutes = new Elysia({ prefix: '/healthcare-users' })
  .use(keycloakPlugin)
  
  .get('/', async ({ getAdmin, query, set, headers }) => {
    try {
      // Extract user's token from Authorization header
      const token = extractBearerToken(headers)
      logger.admin.debug('Healthcare users request - token present', { tokenPresent: !!token })
      
      if (!token) {
        logger.admin.warn('No token found in healthcare users request')
        set.status = 401
        return UNAUTHORIZED_RESPONSE
      }

      logger.admin.debug('Attempting to get admin client with token...')
      const admin = await getValidatedAdmin(getAdmin, token)
      logger.admin.debug('Admin client obtained successfully')
      
      logger.admin.debug('Fetching users from Keycloak...')
      const allUsers = await admin.users.find({
        max: Number(query.limit) || 50,
        first: Number(query.offset) || 0
      })
      
      logger.admin.info(`Found ${allUsers.length} users`)
      
      // Fetch complete user details (including timestamps) for each user
      const completeUsers = await Promise.all(
        allUsers.map(async (user) => {
          try {
            // Get complete user details including timestamps
            const completeUser = await admin.users.findOne({ id: user.id! })
            logger.admin.debug(`Complete user data for ${user.username}`, {
              id: completeUser?.id,
              username: completeUser?.username,
              createdTimestamp: completeUser?.createdTimestamp,
              created: completeUser?.createdTimestamp ? new Date(completeUser.createdTimestamp).toISOString() : 'null/undefined'
            })
            return completeUser || user
          } catch (error) {
            logger.admin.warn(`Failed to get complete details for user ${user.username}`, { error })
            return user
          }
        })
      )
      
      // Filter for healthcare users and map them with role information
      const healthcareUsers = await Promise.all(completeUsers.map(async (user) => {
        const profile = mapUserProfile(user)
        
        // Try to get user sessions for last login info
        let lastLogin: number | null = null
        try {
          const sessions = await admin.users.listSessions({ id: user.id! })
          if (sessions && sessions.length > 0) {
            // Find the most recent session
            const latestSession = sessions.reduce((latest, session) => 
              (session.lastAccess || 0) > (latest.lastAccess || 0) ? session : latest
            )
            lastLogin = latestSession.lastAccess || null
          }
        } catch (sessionError) {
          logger.admin.warn(`Could not get sessions for user ${user.username}`, { error: sessionError })
        }
        
        // Get user's realm roles and client roles
        let realmRoles: string[] = []
        const clientRoles: Record<string, string[]> = {}
        try {
          const userRoles = await admin.users.listRealmRoleMappings({ id: user.id! })
          realmRoles = userRoles.map(role => role.name || '').filter(Boolean)
          
          // Get client role mappings for admin-ui client
          try {
            const clients = await admin.clients.find({ clientId: 'admin-ui' })
            if (clients.length > 0) {
              const clientId = clients[0].id!
              const userClientRoles = await admin.users.listClientRoleMappings({ id: user.id!, clientUniqueId: clientId })
              clientRoles['admin-ui'] = userClientRoles.map(role => role.name || '').filter(Boolean)
            }
          } catch (clientRoleError) {
            logger.admin.warn(`Could not get client roles for user ${user.username}`, { error: clientRoleError })
          }
        } catch (roleError) {
          logger.admin.warn(`Could not get roles for user ${user.username}`, { error: roleError })
        }
        
        // Use custom attributes for additional info
        const organization = user.attributes?.organization?.[0] || ''
        const fhirUser = user.attributes?.fhirUser?.[0] || ''
        
        return {
          ...profile,
          realmRoles,
          clientRoles,
          organization,
          fhirUser,
          lastLogin: lastLogin
        }
      }))
      
      logger.admin.info(`Returning ${healthcareUsers.length} healthcare users`)
      return healthcareUsers
    } catch (error) {
      logger.admin.error('Error in healthcare users endpoint', { error })
      
      // Check if it's an authentication error
      if (error instanceof AuthenticationError) {
        logger.admin.warn('AuthenticationError detected, returning 401')
        set.status = 401
        return UNAUTHORIZED_RESPONSE
      }
      
      // Extract actual HTTP status from Keycloak response if available
      const errorObj = error as Record<string, unknown>;
      const response = errorObj?.response as Record<string, unknown> | undefined;
      const keycloakStatus = response?.status as number | undefined;
      
      if (keycloakStatus && typeof keycloakStatus === 'number') {
        logger.admin.warn(`Returning Keycloak status: ${keycloakStatus}`)
        set.status = keycloakStatus
        
        // Return appropriate response based on status
        if (keycloakStatus === 401) {
          return UNAUTHORIZED_RESPONSE
        } else if (keycloakStatus === 403) {
          return { error: 'Forbidden - Insufficient permissions' }
        } else {
          return { error: 'Keycloak error', details: error }
        }
      }
      
      // Fallback to 500 for unknown errors
      logger.admin.error('Unknown error, returning 500')
      set.status = 500
      return { error: 'Failed to fetch healthcare users', details: error }
    }
  }, {
    query: PaginationQuery,
    responses: {
      200: t.Array(UserProfile, { description: 'List of healthcare users' }),
      401: ErrorResponse,
      403: ErrorResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'List Healthcare Users',
      description: 'Get all healthcare users with optional pagination',
      tags: ['healthcare-users'],
      security: [{ BearerAuth: [] }],
      responses: { 
        200: { description: 'A list of all healthcare users.' },
        401: { description: 'Unauthorized - Bearer token required' },
        403: { description: 'Forbidden - Insufficient permissions' },
        500: { description: 'Internal server error' }
      }
    }
  })
  
  .post('/', async ({ getAdmin, body, set, headers }) => {
    try {
      // Extract user's token from Authorization header
      const token = extractBearerToken(headers)
      if (!token) {
        set.status = 401
        return UNAUTHORIZED_RESPONSE
      }

      const userData = {
        username: body.username,
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        enabled: true,
        attributes: {
          organization: body.organization ? [body.organization] : [],
          fhirUser: body.fhirUser ? [body.fhirUser] : []
        },
        credentials: body.password ? [{
          type: 'password',
          value: body.password,
          temporary: body.temporaryPassword || false
        }] : []
      }
      
      const admin = await getValidatedAdmin(getAdmin, token)
      const result = await admin.users.create(userData)
      
      // Assign roles if specified
      if (result.id && (body.realmRoles || body.clientRoles)) {
        try {
          // Assign realm roles
          if (body.realmRoles && body.realmRoles.length > 0) {
            const allRealmRoles = await admin.roles.find()
            const rolesToAssign = allRealmRoles.filter(role => 
              body.realmRoles!.includes(role.name || '')
            ).map(role => ({ id: role.id!, name: role.name! }))
            if (rolesToAssign.length > 0) {
              await admin.users.addRealmRoleMappings({
                id: result.id,
                roles: rolesToAssign
              })
            }
          }
          
          // Assign client roles
          if (body.clientRoles) {
            for (const [clientId, roleNames] of Object.entries(body.clientRoles)) {
              try {
                const clients = await admin.clients.find({ clientId })
                if (clients.length > 0) {
                  const client = clients[0]
                  const clientRoles = await admin.clients.listRoles({ id: client.id! })
                  const rolesToAssign = clientRoles.filter(role => 
                    (roleNames as string[]).includes(role.name || '')
                  ).map(role => ({ id: role.id!, name: role.name! }))
                  if (rolesToAssign.length > 0) {
                    await admin.users.addClientRoleMappings({
                      id: result.id,
                      clientUniqueId: client.id!,
                      roles: rolesToAssign
                    })
                  }
                }
              } catch (clientError) {
                logger.admin.warn(`Could not assign client roles for ${clientId}`, { clientId, error: clientError })
              }
            }
          }
        } catch (roleError) {
          logger.admin.warn('Could not assign roles', { error: roleError })
        }
      }
      
      // Return the created user object (fetch by id)
      const created = result.id ? await admin.users.findOne({ id: result.id }) : undefined
      return created ? mapUserProfile(created) : { error: 'Failed to retrieve created user' }
    } catch (error) {
      logger.admin.error('Error creating healthcare user', { error })
      
      // Check if it's an authentication error
      if (error instanceof AuthenticationError) {
        set.status = 401
        return UNAUTHORIZED_RESPONSE
      }
      
      // Extract actual HTTP status from Keycloak response if available
      const errorObj = error as Record<string, unknown>;
      const response = errorObj?.response as Record<string, unknown> | undefined;
      const keycloakStatus = response?.status as number | undefined;
      
      if (keycloakStatus && typeof keycloakStatus === 'number') {
        logger.admin.warn(`Returning Keycloak status: ${keycloakStatus}`)
        set.status = keycloakStatus
        
        if (keycloakStatus === 401) {
          return UNAUTHORIZED_RESPONSE
        } else if (keycloakStatus === 403) {
          return { error: 'Forbidden - Insufficient permissions' }
        } else {
          return { error: 'Keycloak error', details: error }
        }
      }
      
      // For validation or other client errors
      set.status = 400
      return { error: 'Failed to create healthcare user', details: error }
    }
  }, {
    body: t.Object({
      username: t.String({ description: 'Unique username' }),
      email: t.String({ description: 'Email address', format: 'email' }),
      firstName: t.String({ description: 'First name' }),
      lastName: t.String({ description: 'Last name' }),
      organization: t.Optional(t.String({ description: 'Organization' })),
      fhirUser: t.Optional(t.String({ description: 'FHIR User identifiers in format "server1:Person/123,server2:Person/456"' })),
      password: t.Optional(t.String({ description: 'Initial password' })),
      temporaryPassword: t.Optional(t.Boolean({ description: 'Whether password is temporary' })),
      realmRoles: t.Optional(t.Array(t.String({ description: 'Realm roles to assign' }))),
      clientRoles: t.Optional(t.Object({}, { 
        description: 'Client roles to assign as key-value pairs (clientId: string[])',
        additionalProperties: t.Array(t.String())
      }))
    }),
    responses: {
      200: UserProfile,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Create Healthcare User',
      description: 'Create a new healthcare user',
      tags: ['healthcare-users'],
      security: [{ BearerAuth: [] }],
      responses: { 
        200: { description: 'Healthcare user created.' },
        400: { description: 'Invalid request data' },
        401: { description: 'Unauthorized - Bearer token required' },
        403: { description: 'Forbidden - Insufficient permissions' },
        500: { description: 'Internal server error' }
      }
    }
  })
  
  .get('/:userId', async ({ getAdmin, params, set, headers }) => {
    try {
      // Extract user's token from Authorization header
      const token = extractBearerToken(headers)
      if (!token) {
        set.status = 401
        return UNAUTHORIZED_RESPONSE
      }

      const admin = await getValidatedAdmin(getAdmin, token)
      const user = await admin.users.findOne({ id: params.userId })
      if (!user) {
        set.status = 404
        return { error: 'Healthcare user not found' }
      }
      return mapUserProfile(user)
    } catch (error) {
      // Extract actual HTTP status from Keycloak response if available
      const errorObj = error as Record<string, unknown>;
      const response = errorObj?.response as Record<string, unknown> | undefined;
      const keycloakStatus = response?.status as number | undefined;
      
      if (keycloakStatus && typeof keycloakStatus === 'number') {
        logger.admin.warn(`Get user - returning Keycloak status: ${keycloakStatus}`)
        set.status = keycloakStatus
        
        if (keycloakStatus === 401) {
          return UNAUTHORIZED_RESPONSE
        } else if (keycloakStatus === 403) {
          return { error: 'Forbidden - Insufficient permissions' }
        } else if (keycloakStatus === 404) {
          return { error: 'Healthcare user not found' }
        } else {
          return { error: 'Keycloak error', details: error }
        }
      }
      
      set.status = 500
      return { error: 'Failed to fetch healthcare user', details: error }
    }
  }, {
    params: t.Object({
      userId: t.String({ description: 'User ID' })
    }),
    responses: {
      200: UserProfile,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Get Healthcare User',
      description: 'Get a healthcare user by userId',
      tags: ['healthcare-users'],
      security: [{ BearerAuth: [] }],
      responses: { 
        200: { description: 'Healthcare user details.' },
        401: { description: 'Unauthorized - Bearer token required' },
        403: { description: 'Forbidden - Insufficient permissions' },
        404: { description: 'User not found' },
        500: { description: 'Internal server error' }
      }
    }
  })
  
  .put('/:userId', async ({ getAdmin, params, body, set, headers }) => {
    try {
      // Extract user's token from Authorization header
      const token = extractBearerToken(headers)
      if (!token) {
        set.status = 401
        return UNAUTHORIZED_RESPONSE
      }

      const updateData = {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        enabled: body.enabled,
        attributes: {
          organization: body.organization ? [body.organization] : undefined,
          fhirUser: body.fhirUser ? [body.fhirUser] : undefined
        }
      }
      
      const admin = await getValidatedAdmin(getAdmin, token)
      await admin.users.update({ id: params.userId }, updateData)
      
      // Handle role updates if specified
      if (body.realmRoles !== undefined || body.clientRoles !== undefined) {
        try {
          // Update realm roles
          if (body.realmRoles !== undefined) {
            // Remove all existing realm roles
            const existingRoles = await admin.users.listRealmRoleMappings({ id: params.userId })
            if (existingRoles.length > 0) {
              await admin.users.delRealmRoleMappings({
                id: params.userId,
                roles: existingRoles.map(role => ({ id: role.id!, name: role.name! }))
              })
            }
            
            // Add new realm roles
            if (body.realmRoles.length > 0) {
              const allRealmRoles = await admin.roles.find()
              const rolesToAssign = allRealmRoles.filter(role => 
                body.realmRoles!.includes(role.name || '')
              ).map(role => ({ id: role.id!, name: role.name! }))
              if (rolesToAssign.length > 0) {
                await admin.users.addRealmRoleMappings({
                  id: params.userId,
                  roles: rolesToAssign
                })
              }
            }
          }
          
          // Update client roles
          if (body.clientRoles !== undefined) {
            for (const [clientId, roleNames] of Object.entries(body.clientRoles)) {
              try {
                const clients = await admin.clients.find({ clientId })
                if (clients.length > 0) {
                  const client = clients[0]
                  
                  // Remove existing client roles
                  const existingClientRoles = await admin.users.listClientRoleMappings({ 
                    id: params.userId, 
                    clientUniqueId: client.id! 
                  })
                  if (existingClientRoles.length > 0) {
                    await admin.users.delClientRoleMappings({
                      id: params.userId,
                      clientUniqueId: client.id!,
                      roles: existingClientRoles.map(role => ({ id: role.id!, name: role.name! }))
                    })
                  }
                  
                  // Add new client roles
                  if ((roleNames as string[]).length > 0) {
                    const clientRoles = await admin.clients.listRoles({ id: client.id! })
                    const rolesToAssign = clientRoles.filter(role => 
                      (roleNames as string[]).includes(role.name || '')
                    ).map(role => ({ id: role.id!, name: role.name! }))
                    if (rolesToAssign.length > 0) {
                      await admin.users.addClientRoleMappings({
                        id: params.userId,
                        clientUniqueId: client.id!,
                        roles: rolesToAssign
                      })
                    }
                  }
                }
              } catch (clientError) {
                logger.admin.warn(`Could not update client roles for ${clientId}`, { clientId, userId: params.userId, error: clientError })
              }
            }
          }
        } catch (roleError) {
          logger.admin.warn('Could not update roles', { userId: params.userId, error: roleError })
        }
      }
      
      // Return the updated user object
      const updated = await admin.users.findOne({ id: params.userId })
      if (!updated) {
        set.status = 404
        return { error: 'Healthcare user not found' }
      }
      return mapUserProfile(updated)
    } catch (error) {
      // Extract actual HTTP status from Keycloak response if available
      const errorObj = error as Record<string, unknown>;
      const response = errorObj?.response as Record<string, unknown> | undefined;
      const keycloakStatus = response?.status as number | undefined;
      
      if (keycloakStatus && typeof keycloakStatus === 'number') {
        logger.admin.warn(`Update user - returning Keycloak status: ${keycloakStatus}`)
        set.status = keycloakStatus
        
        if (keycloakStatus === 401) {
          return UNAUTHORIZED_RESPONSE
        } else if (keycloakStatus === 403) {
          return { error: 'Forbidden - Insufficient permissions' }
        } else if (keycloakStatus === 404) {
          return { error: 'Healthcare user not found' }
        } else {
          return { error: 'Keycloak error', details: error }
        }
      }
      
      set.status = 400
      return { error: 'Failed to update healthcare user', details: error }
    }
  }, {
    params: t.Object({
      userId: t.String({ description: 'User ID' })
    }),
    body: t.Object({
      firstName: t.Optional(t.String({ description: 'First name' })),
      lastName: t.Optional(t.String({ description: 'Last name' })),
      email: t.Optional(t.String({ description: 'Email address', format: 'email' })),
      enabled: t.Optional(t.Boolean({ description: 'Whether user is enabled' })),
      organization: t.Optional(t.String({ description: 'Organization' })),
      fhirUser: t.Optional(t.String({ description: 'FHIR User identifiers in format "server1:Person/123,server2:Person/456"' })),
      realmRoles: t.Optional(t.Array(t.String({ description: 'Realm roles to assign' }))),
      clientRoles: t.Optional(t.Object({}, { 
        description: 'Client roles to assign as key-value pairs (clientId: string[])',
        additionalProperties: t.Array(t.String())
      }))
    }),
    responses: {
      200: UserProfile,
      400: ErrorResponse,
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Update Healthcare User',
      description: 'Update a healthcare user by userId',
      tags: ['healthcare-users'],
      security: [{ BearerAuth: [] }],
      responses: { 
        200: { description: 'Healthcare user updated.' },
        400: { description: 'Invalid request data' },
        401: { description: 'Unauthorized - Bearer token required' },
        403: { description: 'Forbidden - Insufficient permissions' },
        404: { description: 'User not found' },
        500: { description: 'Internal server error' }
      }
    }
  })
  
  .delete('/:userId', async ({ getAdmin, params, set, headers }) => {
    try {
      // Extract user's token from Authorization header
      const token = extractBearerToken(headers)
      if (!token) {
        set.status = 401
        return UNAUTHORIZED_RESPONSE
      }

      const admin = await getValidatedAdmin(getAdmin, token)
      await admin.users.del({ id: params.userId })
      return { success: true, message: 'Healthcare user deleted successfully' }
    } catch (error) {
      // Extract actual HTTP status from Keycloak response if available
      const errorObj = error as Record<string, unknown>;
      const response = errorObj?.response as Record<string, unknown> | undefined;
      const keycloakStatus = response?.status as number | undefined;
      
      if (keycloakStatus && typeof keycloakStatus === 'number') {
        logger.admin.warn(`Delete user - returning Keycloak status: ${keycloakStatus}`)
        set.status = keycloakStatus
        
        if (keycloakStatus === 401) {
          return UNAUTHORIZED_RESPONSE
        } else if (keycloakStatus === 403) {
          return { error: 'Forbidden - Insufficient permissions' }
        } else if (keycloakStatus === 404) {
          return { error: 'Healthcare user not found or could not be deleted' }
        } else {
          return { error: 'Keycloak error', details: error }
        }
      }
      
      set.status = 404
      return { error: 'Healthcare user not found or could not be deleted', details: error }
    }
  }, {
    params: t.Object({
      userId: t.String({ description: 'User ID' })
    }),
    responses: {
      200: t.Object({
        success: t.Boolean({ description: 'Whether the operation was successful' }),
        message: t.Optional(t.String({ description: 'Success message' }))
      }, { description: 'User deleted successfully' }),
      401: ErrorResponse,
      403: ErrorResponse,
      404: ErrorResponse,
      500: ErrorResponse
    },
    detail: {
      summary: 'Delete Healthcare User',
      description: 'Delete a healthcare user by userId',
      tags: ['healthcare-users'],
      security: [{ BearerAuth: [] }],
      responses: { 
        200: { description: 'Healthcare user deleted.' },
        401: { description: 'Unauthorized - Bearer token required' },
        403: { description: 'Forbidden - Insufficient permissions' },
        404: { description: 'User not found' },
        500: { description: 'Internal server error' }
      }
    }
  })
