import { Elysia } from 'elysia'
import fetch from 'cross-fetch'
import { config } from '@/config'
import { validateToken } from '@/lib/auth'
import { getAllServers, ensureServersInitialized } from '@/lib/fhir-server-store'
import { logger } from '@/lib/logger'
import { oauthMetricsLogger } from '@/lib/oauth-metrics-logger'
import {
  TokenRequest,
  IntrospectRequest,
  IntrospectResponse,
  AuthorizationQuery,
  LoginQuery,
  LogoutQuery,
  PublicIdentityProvidersResponse,
  TokenResponse,
  UserInfoHeader,
  UserInfoResponse,
  UserInfoErrorResponse
} from '@/schemas'

interface TokenPayload {
  sub?: string
  smart_patient?: string
  smart_encounter?: string
  smart_fhir_user?: string
  smart_fhir_context?: string | object
  smart_intent?: string
  smart_style_url?: string
  smart_tenant?: string
  smart_need_patient_banner?: string | boolean
  smart_scope?: string
  [key: string]: unknown
}

interface AuthorizationDetail {
  type: string
  locations: string[]
  fhirVersions: string[]
  scope?: string
  patient?: string
  encounter?: string
  fhirContext?: Array<{
    reference?: string
    canonical?: string
    identifier?: object
    type?: string
    role?: string
  }>
}

/**
 * Generate authorization details from token claims (pure proxy approach)
 */
async function generateAuthorizationDetailsFromToken(
  tokenPayload: TokenPayload
): Promise<AuthorizationDetail[] | undefined> {
  try {
    // Ensure servers are initialized
    await ensureServersInitialized()

    // Get all servers from the store
    const serverInfos = await getAllServers()

    // Generate authorization details based on available FHIR servers
    const authDetails: AuthorizationDetail[] = []

    // Create authorization details for each configured FHIR server
    for (const serverInfo of serverInfos) {
      const serverDetail: AuthorizationDetail = {
        type: 'smart_on_fhir',
        locations: [`${config.baseUrl}/${config.name}/${serverInfo.identifier}/${serverInfo.metadata.fhirVersion}`],
        fhirVersions: [serverInfo.metadata.fhirVersion]
      }

      // Add launch context from token claims
      if (tokenPayload.smart_patient) {
        serverDetail.patient = tokenPayload.smart_patient
      }
      if (tokenPayload.smart_encounter) {
        serverDetail.encounter = tokenPayload.smart_encounter
      }
      if (tokenPayload.smart_scope) {
        serverDetail.scope = tokenPayload.smart_scope
      }

      authDetails.push(serverDetail)
    }

    return authDetails.length > 0 ? authDetails : undefined
  } catch (error) {
    logger.auth.warn('Failed to generate authorization details from token', { error })
    return undefined
  }
}

/**
 * OAuth2/OIDC proxy routes - handles token exchange and introspection
 */
export const oauthRoutes = new Elysia({ tags: ['authentication'] })
  // redirect into Keycloak's /auth endpoint
  .get('/authorize', ({ query, redirect }) => {
    const url = new URL(
      `${config.keycloak.publicUrl}/realms/${config.keycloak.realm}/protocol/openid-connect/auth`
    )

    // Add all query parameters to the Keycloak URL
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, v as string)
      }
    })

    return redirect(url.href)
  }, {
    query: AuthorizationQuery,
    detail: {
      summary: 'OAuth Authorization Endpoint',
      description: 'Redirects to Keycloak authorization endpoint for OAuth flow with support for authorization details',
      tags: ['authentication']
    }
  })

  // Login page redirect - provides a simple login endpoint for UIs
  .get('/login', ({ query, redirect }) => {
    const state = query.state || Math.random().toString(36).substring(2, 15)
    const clientId = query.client_id || 'admin-ui'
    const redirectUri = query.redirect_uri || `${config.baseUrl}/`
    const scope = query.scope || 'openid profile email'

    const url = new URL(
      `${config.keycloak.publicUrl}/realms/${config.keycloak.realm}/protocol/openid-connect/auth`
    )

    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', clientId)
    url.searchParams.set('redirect_uri', redirectUri)
    url.searchParams.set('scope', scope)
    url.searchParams.set('state', state)

    // Add any additional parameters passed through
    Object.entries(query).forEach(([k, v]) => {
      if (!['state', 'client_id', 'redirect_uri', 'scope'].includes(k)) {
        url.searchParams.set(k, v as string)
      }
    })

    return redirect(url.href)
  }, {
    query: LoginQuery,
    detail: {
      summary: 'Login Page Redirect',
      description: 'Simplified login endpoint that redirects to Keycloak with sensible defaults for UI applications',
      tags: ['authentication']
    }
  })

  // Logout endpoint - proxy to Keycloak logout
  .get('/logout', ({ query, redirect }) => {
    logger.auth.debug('Logout endpoint called', { query })

    const postLogoutRedirectUri = query.post_logout_redirect_uri || `${config.baseUrl}/`

    const url = new URL(
      `${config.keycloak.publicUrl}/realms/${config.keycloak.realm}/protocol/openid-connect/logout`
    )

    if (postLogoutRedirectUri) {
      url.searchParams.set('post_logout_redirect_uri', postLogoutRedirectUri)
    }

    // Only pass valid id_token_hint if present and looks like a JWT
    if (query.id_token_hint) {
      // Basic validation: JWTs have 3 parts separated by dots
      const isValidJwtFormat = typeof query.id_token_hint === 'string' &&
        query.id_token_hint.split('.').length === 3 &&
        query.id_token_hint.length > 50 // Reasonable minimum length

      if (isValidJwtFormat) {
        url.searchParams.set('id_token_hint', query.id_token_hint)
        logger.auth.debug('Added valid id_token_hint to logout URL')
      } else {
        logger.auth.warn('Invalid id_token_hint format, skipping', {
          hintLength: query.id_token_hint?.length,
          hintParts: query.id_token_hint?.split?.('.')?.length
        })
      }
    }

    // Add other safe parameters (excluding id_token_hint which we handled above)
    Object.entries(query).forEach(([k, v]) => {
      if (k !== 'post_logout_redirect_uri' && k !== 'id_token_hint' && k === 'client_id') {
        url.searchParams.set(k, v as string)
      }
    })

    logger.auth.debug('Redirecting to Keycloak logout URL', { url: url.href })
    return redirect(url.href)
  }, {
    query: LogoutQuery,
    detail: {
      summary: 'Logout Endpoint',
      description: 'Proxies logout requests to Keycloak with sensible defaults',
      tags: ['authentication']
    }
  })

  // Public identity providers endpoint - doesn't require authentication
  .get('/identity-providers', async () => {
    try {
      // Use Keycloak's public endpoint to get realm info which includes identity providers
      // This doesn't require admin authentication
      const realmUrl = `${config.keycloak.publicUrl}/realms/${config.keycloak.realm}`

      logger.auth.debug('Fetching realm info from public endpoint', { realmUrl })

      const response = await fetch(realmUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch realm info: ${response.status} ${response.statusText}`)
      }

      const realmInfo = await response.json()

      // Extract identity providers from realm info
      const identityProviders = realmInfo.identityProviders || []

      // Return only enabled providers with minimal information for public consumption
      const enabledProviders = identityProviders
        .filter((provider: { enabled?: boolean }) => provider.enabled !== false)
        .map((provider: { alias?: string; providerId?: string; displayName?: string; enabled?: boolean }) => ({
          alias: provider.alias ?? '',
          providerId: provider.providerId ?? '',
          displayName: provider.displayName ?? provider.alias ?? '',
          enabled: provider.enabled ?? false
        }))

      logger.auth.debug(`Returning ${enabledProviders.length} public identity providers`)
      return enabledProviders
    } catch (error) {
      logger.auth.error('Failed to fetch public identity providers', { error })
      // Return empty array on error - this is a public endpoint so we don't want to expose errors
      return []
    }
  }, {
    response: {
      200: PublicIdentityProvidersResponse
    },
    detail: {
      summary: 'Get Public Identity Providers',
      description: 'Get list of enabled identity providers for login page (public endpoint)',
      tags: ['authentication']
    }
  })

  // proxy token request
  .post('/token', async ({ body, set, headers }) => {
    const startTime = Date.now();
    const kcUrl = `${config.keycloak.baseUrl}/realms/${config.keycloak.realm}/protocol/openid-connect/token`
    logger.auth.debug('Token endpoint request received', {
      keycloakUrl: kcUrl,
      bodyKeys: Object.keys(body as Record<string, unknown>)
    })

    try {
      // Convert the parsed body back to form data with proper OAuth2 field names
      const formData = new URLSearchParams()
      const bodyObj = body as Record<string, string | undefined>

      // Handle both camelCase and snake_case field names for OAuth2 standard field names
      if (bodyObj.grant_type || bodyObj.grantType) formData.append('grant_type', bodyObj.grant_type || bodyObj.grantType!)
      if (bodyObj.code) formData.append('code', bodyObj.code)
      if (bodyObj.redirect_uri || bodyObj.redirectUri) formData.append('redirect_uri', bodyObj.redirect_uri || bodyObj.redirectUri!)
      if (bodyObj.client_id || bodyObj.clientId) formData.append('client_id', bodyObj.client_id || bodyObj.clientId!)
      if (bodyObj.client_secret || bodyObj.clientSecret) formData.append('client_secret', bodyObj.client_secret || bodyObj.clientSecret!)
      if (bodyObj.code_verifier || bodyObj.codeVerifier) formData.append('code_verifier', bodyObj.code_verifier || bodyObj.codeVerifier!)
      if (bodyObj.refresh_token || bodyObj.refreshToken) formData.append('refresh_token', bodyObj.refresh_token || bodyObj.refreshToken!)
      if (bodyObj.scope) formData.append('scope', bodyObj.scope)
      if (bodyObj.audience) formData.append('audience', bodyObj.audience)

      // Handle password grant fields
      if (bodyObj.username) formData.append('username', bodyObj.username)
      if (bodyObj.password) formData.append('password', bodyObj.password)

      // Handle Backend Services (client_credentials with JWT authentication)
      if (bodyObj.client_assertion_type) formData.append('client_assertion_type', bodyObj.client_assertion_type)
      if (bodyObj.client_assertion) formData.append('client_assertion', bodyObj.client_assertion)

      const rawBody = formData.toString()
      logger.auth.debug('Sending form data to Keycloak', {
        formFields: Array.from(formData.keys())
      })

      const resp = await fetch(kcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: rawBody
      })

      const responseTime = Date.now() - startTime;
      const data = await resp.json()
      logger.auth.debug('Keycloak response received', {
        status: resp.status,
        hasAccessToken: !!data.access_token,
        error: data.error
      })

      // Log OAuth event
      const clientId = bodyObj.client_id || bodyObj.clientId || 'unknown';
      const grantType = bodyObj.grant_type || bodyObj.grantType || 'unknown';
      const scopes = bodyObj.scope ? bodyObj.scope.split(' ') : [];

      try {
        await oauthMetricsLogger.logEvent({
          type: 'token',
          status: resp.status === 200 ? 'success' : 'error',
          clientId,
          clientName: clientId,
          scopes,
          grantType,
          responseTime,
          ipAddress: headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown',
          userAgent: headers['user-agent'] || 'unknown',
          errorMessage: data.error_description,
          errorCode: data.error,
          tokenType: data.token_type,
          expiresIn: data.expires_in,
          refreshToken: !!data.refresh_token,
          requestDetails: {
            path: '/auth/token',
            method: 'POST',
            headers: {
              'content-type': headers['content-type'] || '',
              'user-agent': headers['user-agent'] || ''
            }
          }
        });
      } catch (logError) {
        logger.auth.error('Failed to log OAuth event', { logError });
      }

      // Set the proper HTTP status code from Keycloak response
      set.status = resp.status

      // If there's an error, return it with the proper status code
      if (data.error) {
        logger.auth.warn('OAuth2 error from Keycloak', {
          error: data.error,
          description: data.error_description,
          status: resp.status
        })
        return data
      }

      // If token request was successful, add SMART launch context from token claims
      if (data.access_token && resp.status === 200) {
        try {
          const tokenPayload = await validateToken(data.access_token)

          // Add SMART launch context parameters from token claims (if available)
          // This requires proper Keycloak configuration with protocol mappers
          if (tokenPayload.smart_patient) {
            data.patient = tokenPayload.smart_patient
          }

          if (tokenPayload.smart_encounter) {
            data.encounter = tokenPayload.smart_encounter
          }

          if (tokenPayload.smart_fhir_user) {
            data.fhirUser = tokenPayload.smart_fhir_user
          }

          if (tokenPayload.smart_fhir_context) {
            try {
              data.fhirContext = typeof tokenPayload.smart_fhir_context === 'string'
                ? JSON.parse(tokenPayload.smart_fhir_context)
                : tokenPayload.smart_fhir_context
            } catch {
              // If parse fails, don't include invalid fhirContext
            }
          }

          if (tokenPayload.smart_intent) {
            data.intent = tokenPayload.smart_intent
          }

          if (tokenPayload.smart_style_url) {
            data.smart_style_url = tokenPayload.smart_style_url
          }

          if (tokenPayload.smart_tenant) {
            data.tenant = tokenPayload.smart_tenant
          }

          if (tokenPayload.smart_need_patient_banner) {
            data.need_patient_banner = tokenPayload.smart_need_patient_banner === 'true' || tokenPayload.smart_need_patient_banner === true
          }

          // Add authorization_details for multiple FHIR servers support (RFC 9396)
          // Generate based on configured FHIR servers and token claims
          const generatedDetails = await generateAuthorizationDetailsFromToken(tokenPayload)
          if (generatedDetails) {
            data.authorization_details = generatedDetails
          }
        } catch (contextError) {
          logger.auth.warn('Failed to add launch context to token response', { contextError })
          // Continue without launch context rather than failing the entire request
        }
      }

      return data
    } catch (error) {
      logger.auth.error('Token endpoint error', { error })
      set.status = 500
      return { error: 'internal_server_error', error_description: 'Failed to process token request' }
    }
  },
    {
      body: TokenRequest,
      response: {
        200: TokenResponse
      },
      detail: {
        summary: 'OAuth Token Exchange',
        description: 'Exchange authorization code for access token with SMART launch context and authorization details for multiple FHIR servers',
        tags: ['authentication']
      }
    })

  // proxy introspection
  .post('/introspect', async ({ body }) => {
    const kcUrl = `${config.keycloak.baseUrl}/realms/${config.keycloak.realm}/protocol/openid-connect/token/introspect`
    const resp = await fetch(kcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body as Record<string, string>).toString()
    })
    return resp.json()
  }, {
    body: IntrospectRequest,
    response: {
      200: IntrospectResponse
    },
    detail: {
      summary: 'Token Introspection',
      description: 'Validate and get information about an access token',
      tags: ['authentication']
    }
  })

  // Get current user info from token
  .get('/userinfo', async ({ headers, set }) => {
    if (!headers.authorization) {
      set.status = 401
      return { error: 'Unauthorized' }
    }

    const token = headers.authorization.replace('Bearer ', '')

    try {
      // Validate the token and extract user info
      const payload = await validateToken(token)

      // Create a user profile from token claims
      const displayName = payload.name ||
        (payload.given_name && payload.family_name ? `${payload.given_name} ${payload.family_name}` : '') ||
        payload.given_name ||
        payload.preferred_username ||
        payload.email ||
        'User'

      const profile = {
        id: payload.sub || '',
        fhirUser: payload.smart_fhir_user || '',
        name: [{
          text: displayName
        }],
        username: payload.preferred_username || '',
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        roles: payload.realm_access?.roles || []
      }

      return profile
    } catch {
      set.status = 401
      return { error: 'Invalid token' }
    }
  }, {
    headers: UserInfoHeader,
    response: {
      200: UserInfoResponse,
      401: UserInfoErrorResponse
    },
    detail: {
      summary: 'Get Current User Profile',
      description: 'Get authenticated user profile information from JWT token',
      tags: ['authentication'],
      security: [{ BearerAuth: [] }]
    }
  })
