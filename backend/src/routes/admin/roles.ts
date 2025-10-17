import { Elysia, t } from 'elysia'
import { keycloakPlugin } from '../../lib/keycloak-plugin'
import { 
  CommonErrorResponses, 
  CreateRoleRequest, 
  UpdateRoleRequest,
  RoleResponse,
  SuccessResponse,
  type RoleResponseType,
  type SuccessResponseType,
  type ErrorResponseType
} from '../../schemas'
import { handleAdminError } from '../../lib/admin-error-handler'

/**
 * Healthcare Roles & Permissions Management
 * 
 * All routes now use the user's access token to perform operations,
 * acting as a secure proxy for Keycloak admin operations.
 */
export const rolesRoutes = new Elysia({ prefix: '/roles' })
  .use(keycloakPlugin)

  .get('/', async ({ getAdmin, headers, set }): Promise<RoleResponseType[] | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      const realmRoles = await admin.roles.find()

      return realmRoles;
    } catch (error) {
      return handleAdminError(error, set)
    }
  }, {
    response: {
      200: t.Array(RoleResponse),
      ...CommonErrorResponses
    },
    detail: {
      summary: 'List All Roles',
      description: 'Get all roles',
      tags: ['roles']
    }
  })

  .post('/', async ({ getAdmin, body, headers, set }): Promise<RoleResponseType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      const roleData = {
        name: body.name,
        description: body.description,
        attributes: {
          smart_role: ['true'],
          fhir_scopes: body.fhirScopes || []
        }
      }

      await admin.roles.create(roleData)
      // Return the created role object (fetch by name)
      const created = await admin.roles.findOneByName({ name: body.name })
      return created ?? {}
    } catch (error) {
      set.status = 400
      return { error: 'Failed to create role', details: error }
    }
  }, {
    body: CreateRoleRequest,
    response: {
      200: RoleResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Create Healthcare Role',
      description: 'Create a new healthcare-specific role',
      tags: ['roles']
    }
  })

  .get('/:roleName', async ({ getAdmin, params, headers, set }): Promise<RoleResponseType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      const role = await admin.roles.findOneByName({ name: params.roleName })

      if (!role) {
        set.status = 404
        return { error: 'Role not found' }
      }

      return role
    } catch (error) {
      return handleAdminError(error, set)
    }
  }, {
    response: {
      200: RoleResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Get Healthcare Role',
      description: 'Get a healthcare-specific role by name',
      tags: ['roles']
    }
  })

  .put('/:roleName', async ({ getAdmin, params, body, headers, set }): Promise<SuccessResponseType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      const role = await admin.roles.findOneByName({ name: params.roleName })

      if (!role) {
        set.status = 404
        return { error: 'Role not found' }
      }

      const updateData = {
        description: body.description,
        attributes: {
          ...role.attributes,
          fhir_scopes: body.fhirScopes || role.attributes?.fhir_scopes || []
        }
      }

      await admin.roles.updateByName({ name: params.roleName }, updateData)
      return { success: true }
    } catch (error) {
      set.status = 400
      return { error: 'Failed to update role', details: error }
    }
  }, {
    body: UpdateRoleRequest,
    response: {
      200: SuccessResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Update Healthcare Role',
      description: 'Update a healthcare-specific role by name',
      tags: ['roles']
    }
  })

  .delete('/:roleName', async ({ getAdmin, params, headers, set }): Promise<SuccessResponseType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)

      // Check if role exists before deletion
      const role = await admin.roles.findOneByName({ name: params.roleName })
      if (!role) {
        set.status = 404
        return { error: 'Role not found' }
      }

      await admin.roles.delByName({ name: params.roleName })
      return { success: true }
    } catch (error) {
      set.status = 400
      return { error: 'Failed to delete role', details: error }
    }
  }, {
    response: {
      200: SuccessResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Delete Healthcare Role',
      description: 'Delete a healthcare-specific role by name',
      tags: ['roles']
    }
  })
