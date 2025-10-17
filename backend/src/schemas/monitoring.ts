import { t, type Static } from 'elysia'

/**
 * OAuth monitoring and analytics response schemas
 */

// ==================== Stream Response ====================

export const StreamResponse = t.Object({}, { additionalProperties: true, title: 'StreamResponse' })

export type StreamResponseType = Static<typeof StreamResponse>

// ==================== Alert Response ====================

export const AlertInfo = t.Object({
  type: t.String({ description: 'Alert type (info, warning, error)' }),
  message: t.String({ description: 'Alert message' })
}, { title: 'AlertInfo' })

export type AlertInfoType = Static<typeof AlertInfo>

// ==================== Monitoring Health Response ====================

export const MonitoringHealthResponse = t.Object({
  oauthServer: t.Object({
    status: t.String({ description: 'OAuth server status' }),
    uptime: t.Number({ description: 'Server uptime in seconds' }),
    responseTime: t.Number({ description: 'Average response time in ms' })
  }),
  tokenStore: t.Object({
    status: t.String({ description: 'Token store status' }),
    activeTokens: t.Number({ description: 'Number of active tokens' }),
    storageUsed: t.Number({ description: 'Storage used percentage' })
  }),
  network: t.Object({
    status: t.String({ description: 'Network status' }),
    throughput: t.String({ description: 'Requests per minute' }),
    errorRate: t.Number({ description: 'Error rate percentage' })
  }),
  alerts: t.Array(AlertInfo, { description: 'System alerts' }),
  timestamp: t.String({ description: 'Timestamp (ISO 8601)' })
}, { title: 'MonitoringHealthResponse' })

export type MonitoringHealthResponseType = Static<typeof MonitoringHealthResponse>

// ==================== Export Response ====================

export const ExportResponse = t.Object({
  format: t.String({ description: 'Export format (json, csv)' }),
  data: t.Any()
}, { title: 'ExportResponse' })

export type ExportResponseType = Static<typeof ExportResponse>

// ==================== OAuth Events Response ====================

export const OAuthEventFhirContext = t.Object({
  patient: t.Optional(t.String({ description: 'Patient ID' })),
  encounter: t.Optional(t.String({ description: 'Encounter ID' })),
  location: t.Optional(t.String({ description: 'Location ID' })),
  fhirUser: t.Optional(t.String({ description: 'FHIR User ID' }))
}, { title: 'OAuthEventFhirContext' })

export type OAuthEventFhirContextType = Static<typeof OAuthEventFhirContext>

export const OAuthEvent = t.Object({
  id: t.String({ description: 'Event ID' }),
  timestamp: t.String({ description: 'Event timestamp' }),
  type: t.String({ description: 'Event type' }),
  status: t.String({ description: 'Event status' }),
  clientId: t.String({ description: 'OAuth client ID' }),
  clientName: t.Optional(t.String({ description: 'Client display name' })),
  userId: t.Optional(t.String({ description: 'User ID' })),
  userName: t.Optional(t.String({ description: 'User name' })),
  scopes: t.Array(t.String(), { description: 'Requested scopes' }),
  grantType: t.String({ description: 'OAuth grant type' }),
  responseTime: t.Number({ description: 'Response time in ms' }),
  ipAddress: t.String({ description: 'Client IP address' }),
  userAgent: t.String({ description: 'User agent' }),
  errorMessage: t.Optional(t.String({ description: 'Error message if failed' })),
  errorCode: t.Optional(t.String({ description: 'Error code' })),
  tokenType: t.Optional(t.String({ description: 'Token type' })),
  expiresIn: t.Optional(t.Number({ description: 'Token expiration in seconds' })),
  refreshToken: t.Optional(t.Boolean({ description: 'Whether refresh token was issued' })),
  fhirContext: t.Optional(OAuthEventFhirContext)
}, { title: 'OAuthEvent' })

export type OAuthEventType = Static<typeof OAuthEvent>

export const OAuthEventsResponse = t.Object({
  events: t.Array(OAuthEvent, { description: 'Array of events' }),
  total: t.Number({ description: 'Total number of events' }),
  timestamp: t.String({ description: 'Response timestamp' })
}, { title: 'OAuthEventsResponse' })

export type OAuthEventsResponseType = Static<typeof OAuthEventsResponse>

// ==================== OAuth Analytics Response ====================

export const OAuthAnalyticsTopClient = t.Object({
  clientId: t.String({ description: 'OAuth client ID' }),
  clientName: t.String({ description: 'Client display name' }),
  count: t.Number({ description: 'Number of requests' }),
  successRate: t.Number({ description: 'Success rate percentage' })
}, { title: 'OAuthAnalyticsTopClient' })

export type OAuthAnalyticsTopClientType = Static<typeof OAuthAnalyticsTopClient>

export const OAuthAnalyticsHourlyStats = t.Object({
  hour: t.String({ description: 'Hour timestamp (ISO 8601)' }),
  success: t.Number({ description: 'Successful requests' }),
  error: t.Number({ description: 'Failed requests' }),
  total: t.Number({ description: 'Total requests' })
}, { title: 'OAuthAnalyticsHourlyStats' })

export type OAuthAnalyticsHourlyStatsType = Static<typeof OAuthAnalyticsHourlyStats>

export const OAuthAnalyticsResponse = t.Object({
  totalRequests: t.Number({ description: 'Total requests in period' }),
  successfulRequests: t.Number({ description: 'Successful requests' }),
  failedRequests: t.Number({ description: 'Failed requests' }),
  successRate: t.Number({ description: 'Success rate percentage' }),
  averageResponseTime: t.Number({ description: 'Average response time in ms' }),
  activeTokens: t.Number({ description: 'Currently active tokens' }),
  topClients: t.Array(OAuthAnalyticsTopClient, { description: 'Top OAuth clients by request count' }),
  flowsByType: t.Record(t.String(), t.Number(), { description: 'OAuth flows by type' }),
  errorsByType: t.Record(t.String(), t.Number(), { description: 'Errors by type' }),
  hourlyStats: t.Array(OAuthAnalyticsHourlyStats, { description: 'Hourly statistics' }),
  timestamp: t.String({ description: 'Response timestamp' })
}, { title: 'OAuthAnalyticsResponse' })

export type OAuthAnalyticsResponseType = Static<typeof OAuthAnalyticsResponse>

