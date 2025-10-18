import { Elysia, t } from 'elysia'
import { keycloakPlugin } from '@/lib/keycloak-plugin'
import { 
  CommonErrorResponses,
  CreateIdentityProviderRequest, 
  UpdateIdentityProviderRequest,
  IdentityProviderResponse,
  CountResponse,
  SuccessResponse,
  type CountResponseType,
  type IdentityProviderResponseType,
  type SuccessResponseType,
  type ErrorResponseType
} from '@/schemas'
import { handleAdminError } from '@/lib/admin-error-handler'
import type { IdentityProvider } from '@/types'

/**
 * Identity Provider Management - handles external IdP integrations
 */
export const identityProvidersRoutes = new Elysia({ prefix: '/idps' })
  .use(keycloakPlugin)

  .get('/count', async ({ getAdmin, headers, set }): Promise<CountResponseType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      const providers = await admin.identityProviders.find()
      // Count only enabled providers
      const enabledCount = providers.filter(provider => provider.enabled !== false).length
      return { count: enabledCount, total: providers.length }
    } catch (error) {
      return handleAdminError(error, set)
    }
  }, {
    response: {
      200: CountResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Get Identity Providers Count',
      description: 'Get the count of enabled and total identity providers',
      tags: ['identity-providers']
    }
  })

  .get('/', async ({ getAdmin, headers, set }): Promise<IdentityProviderResponseType[] | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      const providers = await admin.identityProviders.find()
      return providers.map(provider => ({
        alias: provider.alias ?? '',
        providerId: provider.providerId ?? '',
        displayName: provider.displayName ?? '',
        enabled: provider.enabled ?? false,
        config: provider.config ?? {}
      }));
    } catch (error) {
      set.status = 500
      return { error: 'Failed to fetch identity providers', details: error }
    }
  }, {
    response: {
      200: t.Array(IdentityProviderResponse),
      ...CommonErrorResponses
    },
    detail: {
      summary: 'List Identity Providers',
      description: 'Get all configured identity providers',
      tags: ['identity-providers']
    }
  })

  .post('/', async ({ getAdmin, body, headers, set }): Promise<IdentityProviderResponseType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      await admin.identityProviders.create(body)
      const created = await admin.identityProviders.findOne({ alias: (body as IdentityProvider).alias })
      return {
        alias: created?.alias ?? (body as IdentityProvider).alias ?? '',
        providerId: created?.providerId ?? (body as IdentityProvider).providerId ?? '',
        displayName: created?.displayName ?? '',
        enabled: created?.enabled ?? false,
        config: created?.config ?? {}
      }
    } catch (error) {
      set.status = 400
      return { error: 'Failed to create identity provider', details: error }
    }
  }, {
    body: CreateIdentityProviderRequest,
    response: {
      200: IdentityProviderResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Create Identity Provider',
      description: 'Create a new identity provider',
      tags: ['identity-providers']
    }
  })

  .get('/:alias', async ({ getAdmin, params, headers, set }): Promise<IdentityProviderResponseType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      const provider = await admin.identityProviders.findOne({ alias: params.alias })
      if (!provider) {
        set.status = 404
        return { error: 'Identity provider not found' }
      }
      return {
        alias: provider.alias ?? params.alias ?? '',
        providerId: provider.providerId ?? '',
        displayName: provider.displayName ?? '',
        enabled: provider.enabled ?? false,
        config: provider.config ?? {}
      }
    } catch (error) {
      set.status = 500
      return { error: 'Failed to fetch identity provider', details: error }
    }
  }, {
    response: {
      200: IdentityProviderResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Get Identity Provider',
      description: 'Get an identity provider by alias',
      tags: ['identity-providers']
    }
  })

  .put('/:alias', async ({ getAdmin, params, body, headers, set }): Promise<SuccessResponseType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      await admin.identityProviders.update({ alias: params.alias }, body)
      return { success: true }
    } catch (error) {
      set.status = 400
      return { error: 'Failed to update identity provider', details: error }
    }
  }, {
    body: UpdateIdentityProviderRequest,
    response: {
      200: SuccessResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Update Identity Provider',
      description: 'Update an identity provider by alias',
      tags: ['identity-providers']
    }
  })

  .delete('/:alias', async ({ getAdmin, params, headers, set }): Promise<SuccessResponseType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      await admin.identityProviders.del({ alias: params.alias })
      return { success: true }
    } catch (error) {
      set.status = 404
      return { error: 'Identity provider not found or could not be deleted', details: error }
    }
  }, {
    response: {
      200: SuccessResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Delete Identity Provider',
      description: 'Delete an identity provider by alias',
      tags: ['identity-providers']
    }
  })
