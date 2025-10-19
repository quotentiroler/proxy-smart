import { Elysia } from 'elysia'
import { smartConfigService } from '@/lib/smart-config'
import { validateToken } from '@/lib/auth'
import { CommonErrorResponses, SmartConfigRefreshResponse, type SmartConfigurationResponseType } from '@/schemas'

/**
 * SMART Configuration Admin endpoints
 */
export const smartConfigAdminRoutes = new Elysia({ prefix: '/smart-config', tags: ['admin'] })
  .post('/refresh', async ({ set, headers }) => {
    // Require authentication for cache management
    const auth = headers.authorization?.replace('Bearer ', '')
    if (!auth) {
      set.status = 401
      return { error: 'Authentication required' }
    }

    try {
      await validateToken(auth)

      // Clear cache and fetch fresh data
      smartConfigService.clearCache()
      const freshConfig = await smartConfigService.getSmartConfiguration()

      return {
        message: 'SMART configuration cache refreshed successfully',
        timestamp: new Date().toISOString(),
        config: freshConfig as SmartConfigurationResponseType
      }
    } catch (error) {
      set.status = 500
      return { error: 'Failed to refresh SMART configuration cache', details: error }
    }
  }, {
    response: {
      200: SmartConfigRefreshResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Refresh SMART Configuration Cache',
      description: 'Manually refresh the cached SMART configuration from Keycloak',
      tags: ['admin', 'smart-apps'],
      security: [{ BearerAuth: [] }]
    }
  })
