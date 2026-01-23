import { Elysia, t } from 'elysia'
import { validateToken } from '@/lib/auth'
import { getConsentConfig, getConsentCacheStats, invalidateConsentCache, consentCache } from '@/lib/consent'
import { CommonErrorResponses, ConsentConfig, ConsentCacheStats } from '@/schemas'
import { logger } from '@/lib/logger'

/**
 * Consent response for config update
 */
const ConsentConfigUpdateResponse = t.Object({
  message: t.String(),
  config: ConsentConfig,
  timestamp: t.String()
})

/**
 * Consent cache invalidation request
 */
const ConsentCacheInvalidateRequest = t.Object({
  patientId: t.Optional(t.String({ description: 'Patient ID to invalidate (optional)' })),
  serverName: t.Optional(t.String({ description: 'Server name to invalidate (optional)' })),
  all: t.Optional(t.Boolean({ description: 'Clear entire cache (default: false)' }))
})

/**
 * Consent cache invalidation response
 */
const ConsentCacheInvalidateResponse = t.Object({
  message: t.String(),
  entriesInvalidated: t.Number(),
  timestamp: t.String()
})

/**
 * Consent Admin Routes
 * 
 * Endpoints for managing consent enforcement configuration and cache.
 */
export const consentAdminRoutes = new Elysia({ prefix: '/consent', tags: ['admin', 'consent'] })
  /**
   * GET /admin/consent/config
   * Get current consent enforcement configuration
   */
  .get('/config', async ({ set, headers }) => {
    const auth = headers.authorization?.replace('Bearer ', '')
    if (!auth) {
      set.status = 401
      return { error: 'Authentication required' }
    }

    try {
      await validateToken(auth)
      const config = getConsentConfig()
      
      return {
        message: 'Consent configuration retrieved',
        config,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      logger.consent.error('Failed to get consent config', { error })
      set.status = 500
      return { error: 'Failed to get consent configuration', details: error }
    }
  }, {
    response: {
      200: ConsentConfigUpdateResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Get Consent Configuration',
      description: 'Retrieve the current consent enforcement configuration',
      tags: ['admin', 'consent'],
      security: [{ BearerAuth: [] }]
    }
  })

  /**
   * GET /admin/consent/cache/stats
   * Get consent cache statistics
   */
  .get('/cache/stats', async ({ set, headers }) => {
    const auth = headers.authorization?.replace('Bearer ', '')
    if (!auth) {
      set.status = 401
      return { error: 'Authentication required' }
    }

    try {
      await validateToken(auth)
      const stats = getConsentCacheStats()
      
      return stats
    } catch (error) {
      logger.consent.error('Failed to get cache stats', { error })
      set.status = 500
      return { error: 'Failed to get consent cache statistics', details: error }
    }
  }, {
    response: {
      200: ConsentCacheStats,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Get Consent Cache Statistics',
      description: 'Retrieve statistics about the consent cache including entry count and TTLs',
      tags: ['admin', 'consent'],
      security: [{ BearerAuth: [] }]
    }
  })

  /**
   * POST /admin/consent/cache/invalidate
   * Invalidate consent cache entries
   */
  .post('/cache/invalidate', async ({ set, headers, body }) => {
    const auth = headers.authorization?.replace('Bearer ', '')
    if (!auth) {
      set.status = 401
      return { error: 'Authentication required' }
    }

    try {
      await validateToken(auth)
      
      let entriesInvalidated = 0
      
      if (body?.all) {
        // Clear entire cache
        const stats = getConsentCacheStats()
        entriesInvalidated = stats.size
        consentCache.clear()
        logger.consent.info('Consent cache cleared via admin API', { entriesInvalidated })
      } else if (body?.patientId) {
        // Invalidate specific patient
        entriesInvalidated = consentCache.invalidatePatient(body.patientId, body.serverName)
        logger.consent.info('Patient consent cache invalidated via admin API', { 
          patientId: body.patientId, 
          serverName: body.serverName,
          entriesInvalidated 
        })
      } else if (body?.serverName) {
        // Invalidate specific server
        entriesInvalidated = consentCache.invalidateServer(body.serverName)
        logger.consent.info('Server consent cache invalidated via admin API', { 
          serverName: body.serverName,
          entriesInvalidated 
        })
      } else {
        set.status = 400
        return { error: 'Must specify patientId, serverName, or all=true' }
      }
      
      return {
        message: 'Consent cache invalidated successfully',
        entriesInvalidated,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      logger.consent.error('Failed to invalidate consent cache', { error })
      set.status = 500
      return { error: 'Failed to invalidate consent cache', details: error }
    }
  }, {
    body: ConsentCacheInvalidateRequest,
    response: {
      200: ConsentCacheInvalidateResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Invalidate Consent Cache',
      description: 'Invalidate consent cache entries. Use when Consent resources are updated externally.',
      tags: ['admin', 'consent'],
      security: [{ BearerAuth: [] }]
    }
  })

  /**
   * POST /admin/consent/cache/cleanup
   * Clean up expired cache entries
   */
  .post('/cache/cleanup', async ({ set, headers }) => {
    const auth = headers.authorization?.replace('Bearer ', '')
    if (!auth) {
      set.status = 401
      return { error: 'Authentication required' }
    }

    try {
      await validateToken(auth)
      
      const entriesCleaned = consentCache.cleanup()
      logger.consent.info('Consent cache cleanup via admin API', { entriesCleaned })
      
      return {
        message: 'Consent cache cleanup completed',
        entriesInvalidated: entriesCleaned,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      logger.consent.error('Failed to cleanup consent cache', { error })
      set.status = 500
      return { error: 'Failed to cleanup consent cache', details: error }
    }
  }, {
    response: {
      200: ConsentCacheInvalidateResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Cleanup Expired Consent Cache Entries',
      description: 'Remove expired entries from the consent cache',
      tags: ['admin', 'consent'],
      security: [{ BearerAuth: [] }]
    }
  })

  /**
   * POST /admin/consent/webhook
   * Webhook endpoint for external consent updates (e.g., from FHIR server)
   */
  .post('/webhook', async ({ set, headers, body }) => {
    // Webhook can use API key or Bearer token
    const auth = headers.authorization?.replace('Bearer ', '')
    const apiKey = headers['x-api-key']
    
    // For now, require Bearer token (could add API key support later)
    if (!auth) {
      set.status = 401
      return { error: 'Authentication required' }
    }

    try {
      await validateToken(auth)
      
      // Extract patient ID from webhook payload
      // Supports FHIR subscription notification format
      const patientId = body?.patientId || 
                       body?.resource?.patient?.reference?.replace('Patient/', '') ||
                       body?.focus?.reference?.replace('Patient/', '')
      
      if (!patientId) {
        set.status = 400
        return { error: 'Could not determine patientId from webhook payload' }
      }
      
      // Invalidate cache for this patient
      const entriesInvalidated = consentCache.invalidatePatient(patientId)
      
      logger.consent.info('Consent webhook received', { 
        patientId, 
        entriesInvalidated,
        eventType: body?.type || 'unknown'
      })
      
      return {
        message: 'Consent cache invalidated for patient',
        entriesInvalidated,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      logger.consent.error('Failed to process consent webhook', { error })
      set.status = 500
      return { error: 'Failed to process consent webhook', details: error }
    }
  }, {
    body: t.Object({
      patientId: t.Optional(t.String()),
      type: t.Optional(t.String()),
      resource: t.Optional(t.Object({
        patient: t.Optional(t.Object({
          reference: t.Optional(t.String())
        }))
      })),
      focus: t.Optional(t.Object({
        reference: t.Optional(t.String())
      }))
    }),
    response: {
      200: ConsentCacheInvalidateResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Consent Update Webhook',
      description: 'Webhook endpoint to receive notifications when Consent resources are updated. Automatically invalidates the cache for the affected patient.',
      tags: ['admin', 'consent'],
      security: [{ BearerAuth: [] }]
    }
  })
