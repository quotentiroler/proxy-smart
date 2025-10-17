import { t, type Static } from 'elysia'

/**
 * OAuth WebSocket monitoring schemas
 */

// ==================== WebSocket Info Response ====================

export const WebSocketInfoResponse = t.Object({
  endpoint: t.String({ description: 'WebSocket endpoint URL path' }),
  protocol: t.String({ description: 'Protocol (ws or wss)' }),
  supportedMessages: t.Array(t.String(), { description: 'Supported message types' }),
  subscriptionTypes: t.Array(t.String(), { description: 'Available subscription types' })
}, { title: 'WebSocketInfoResponse' })

export type WebSocketInfoResponseType = Static<typeof WebSocketInfoResponse>
