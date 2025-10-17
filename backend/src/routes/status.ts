import { Elysia, t } from 'elysia'
import { collectSystemStatus } from '../lib/system-status'
import { 
  HealthResponse, 
  HealthErrorResponse, 
  SystemStatusResponse, 
  ErrorResponse,
  HealthResponseType,
  HealthErrorResponseType,
  SystemStatusResponseType
} from '../schemas'

// Legacy helper removed: FHIR server health collection centralized in system-status.ts

/**
 * General server information endpoints
 */
export const statusRoutes = new Elysia({ tags: ['server', 'info', 'health'] })

  // Health check endpoint - check if server is healthy
  .get('/health', async ({ set, query }): Promise<HealthResponseType | HealthErrorResponseType> => {
    const force = query.force === '1';
    try {
      const full = await collectSystemStatus(force);
      const payload = {
        status: full.overall,
        timestamp: full.timestamp,
        uptime: full.uptime
      };
      if (full.overall === 'unhealthy') set.status = 503;
      return payload;
    } catch {
      set.status = 503;
      return { status: 'unhealthy', timestamp: new Date().toISOString(), error: 'Health collection failed' };
    }
  }, {
    query: t.Object({
      force: t.Optional(t.String())
    }),
    response: {
      200: HealthResponse,
      503: HealthErrorResponse
    },
    detail: {
      summary: 'Health Check (lean)',
      description: 'Fast liveness/readiness probe. Use /status for detailed system information.',
      tags: ['server']
    }
  })

  // System status endpoint - comprehensive system health check
  .get('/status', async ({ set }): Promise<SystemStatusResponseType> => {
    const status = await collectSystemStatus(true);
    if (status.overall === 'unhealthy') set.status = 503;
    return status;
  }, {
    response: {
      200: SystemStatusResponse,
      503: ErrorResponse
    },
    detail: {
      summary: 'System Status',
      description: 'Comprehensive system status (cached components)',
      tags: ['server']
    }
  })

