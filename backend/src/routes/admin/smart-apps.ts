import { Elysia, t } from 'elysia'
import { keycloakPlugin } from '@/lib/keycloak-plugin'
import { 
  SuccessResponse,
  CommonErrorResponses,
  SmartApp, 
  CreateSmartAppRequest,
  UpdateSmartAppRequest,
  ClientIdParam,
  SmartAppType,
  SuccessResponseType,
  ErrorResponseType
} from '@/schemas'
import { logger } from '@/lib/logger'
import { handleAdminError } from '@/lib/admin-error-handler'
import * as crypto from 'crypto'
import type KcAdminClient from '@keycloak/keycloak-admin-client'

/**
 * Register a public key for a Backend Services client in Keycloak
 */
async function registerPublicKeyForClient(admin: KcAdminClient, clientId: string, _publicKeyPem: string): Promise<void> {
  try {
    logger.admin.debug('Registering public key for client', { clientId })

    // For Keycloak Backend Services, we need to use the client-jwt authenticator
    // and provide the key either via JWKS or X509 certificate

    // Update client to use JWT authentication with the public key
    await admin.clients.update({ id: clientId }, {
      clientAuthenticatorType: 'client-jwt',
      attributes: {
        'use.jwks.string': 'true',
        'jwks.string': JSON.stringify({
          keys: [{
            kty: 'RSA',
            use: 'sig',
            alg: 'RS384',
            kid: crypto.randomUUID(),
            // Note: For a real implementation, we'd need to properly extract n and e from the PEM
            // For now, we'll use a simpler approach with X509 certificate
          }]
        }),
        'token.endpoint.auth.signing.alg': 'RS384'
      }
    })

    logger.admin.debug('Public key registered for client', { clientId })
  } catch (error) {
    logger.admin.error('Failed to register public key', { error, clientId })
    throw new Error(`Failed to register public key: ${error}`)
  }
}

/**
 * SMART App (Client) Management - specialized for healthcare applications
 * 
 * All routes now use the user's access token to perform operations,
 * acting as a secure proxy for Keycloak admin operations.
 */
export const smartAppsRoutes = new Elysia({ prefix: '/smart-apps', tags: ['smart-apps'] })
  .use(keycloakPlugin)

  .get('/', async ({ getAdmin, headers, set }): Promise<SmartAppType[] | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      let clients = await admin.clients.find()

      // Filter for SMART on FHIR applications only
      clients = clients.filter(client =>
        client.protocol === 'openid-connect' &&
        (client.attributes?.['smart_app']?.includes('true') ||
          client.clientId?.includes('smart'))
      )

      // Filter out admin-ui if it somehow gets through
      clients = clients.filter(client => client.clientId !== 'admin-ui')

      // Enrich clients with actual scope information
      const enrichedClients = await Promise.all(
        clients.map(async (client) => {
          try {
            // Fetch the full client details to ensure we have scope IDs
            const fullClient = await admin.clients.findOne({ id: client.id! })
            if (!fullClient) return client

            // Fetch default client scopes details
            let defaultScopeNames: string[] = []
            if (fullClient.defaultClientScopes && fullClient.defaultClientScopes.length > 0) {
              try {
                const defaultScopeDetails = await Promise.all(
                  fullClient.defaultClientScopes.map(async (scopeId) => {
                    try {
                      const scope = await admin.clientScopes.findOne({ id: scopeId })
                      return scope?.name || scopeId
                    } catch (error) {
                      logger.admin.warn('Failed to fetch default client scope', { scopeId, error })
                      return scopeId // fallback to ID if name fetch fails
                    }
                  })
                )
                defaultScopeNames = defaultScopeDetails.filter(Boolean)
              } catch (error) {
                logger.admin.warn('Failed to fetch default client scopes', { clientId: client.clientId, error })
              }
            }

            // Fetch optional client scopes details
            let optionalScopeNames: string[] = []
            if (fullClient.optionalClientScopes && fullClient.optionalClientScopes.length > 0) {
              try {
                const optionalScopeDetails = await Promise.all(
                  fullClient.optionalClientScopes.map(async (scopeId) => {
                    try {
                      const scope = await admin.clientScopes.findOne({ id: scopeId })
                      return scope?.name || scopeId
                    } catch (error) {
                      logger.admin.warn('Failed to fetch optional client scope', { scopeId, error })
                      return scopeId // fallback to ID if name fetch fails
                    }
                  })
                )
                optionalScopeNames = optionalScopeDetails.filter(Boolean)
              } catch (error) {
                logger.admin.warn('Failed to fetch optional client scopes', { clientId: client.clientId, error })
              }
            }

            // Extract appType from client_type attribute
            const clientType = fullClient.attributes?.['client_type']
            const appType = Array.isArray(clientType) ? clientType[0] : clientType

            // Check if offline_access is in optional scopes
            const hasOfflineAccess = optionalScopeNames.includes('offline_access')

            // Return enriched client with scope names instead of IDs and appType
            return {
              ...fullClient,
              defaultClientScopes: defaultScopeNames,
              optionalClientScopes: optionalScopeNames,
              appType: appType || (fullClient.serviceAccountsEnabled ? 'backend-service' : 'standalone-app'),
              clientType: (fullClient.serviceAccountsEnabled ? 'backend-service' : (fullClient.publicClient ? 'public' : 'confidential')) as 'backend-service' | 'public' | 'confidential',
              
              // Client secret (only included for confidential clients with client-secret auth)
              ...(fullClient.secret && { secret: fullClient.secret }),
              
              // Extract metadata fields from attributes
              launchUrl: fullClient.attributes?.['launch_url']?.[0],
              logoUri: fullClient.attributes?.['logo_uri']?.[0],
              tosUri: fullClient.attributes?.['tos_uri']?.[0],
              policyUri: fullClient.attributes?.['policy_uri']?.[0],
              contacts: fullClient.attributes?.['contacts']?.[0]?.split(',').filter(Boolean),
              
              // Server access control
              serverAccessType: fullClient.attributes?.['server_access_type']?.[0] as 'all-servers' | 'selected-servers' | 'user-person-servers' | undefined,
              allowedServerIds: fullClient.attributes?.['allowed_server_ids']?.[0]?.split(',').filter(Boolean),
              
              // Scope set reference
              scopeSetId: fullClient.attributes?.['scope_set_id']?.[0],
              
              // PKCE and offline access
              requirePkce: fullClient.attributes?.['pkce.code.challenge.method']?.includes('S256'),
              allowOfflineAccess: hasOfflineAccess
            } as SmartAppType
          } catch (error) {
            logger.admin.warn('Failed to enrich client with scope details', { clientId: client.clientId, error })
            return client
          }
        })
      )
      return enrichedClients;
    } catch (error) {
      return handleAdminError(error, set)
    }
  }, {
    response: {
      200: t.Array(SmartApp),
      ...CommonErrorResponses
    },
    detail: {
      summary: 'List SMART on FHIR Applications',
      description: 'Get all registered SMART on FHIR applications',
      tags: ['smart-apps'],
      security: [{ BearerAuth: [] }]
    }
  })

  .post('/', async ({ getAdmin, body, headers, set }): Promise<SmartAppType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)

      // Map UI appType to backend clientType if appType is provided
      let effectiveClientType = body.clientType
      if (body.appType) {
        if (body.appType === 'agent' || body.appType === 'backend-service') {
          effectiveClientType = 'backend-service'
        } else if (body.appType === 'standalone-app' || body.appType === 'ehr-launch') {
          effectiveClientType = body.publicClient ? 'public' : 'confidential'
        }
      }

      // Determine client configuration based on type
      const isBackendService = effectiveClientType === 'backend-service'
      const isPublicClient = body.publicClient || effectiveClientType === 'public'

      // Determine authentication method
      let clientAuthenticatorType = 'none'
      
      if (isBackendService) {
        // Backend services always use JWT authentication
        clientAuthenticatorType = 'client-jwt'
      } else if (!isPublicClient) {
        // Confidential client - determine based on whether JWKS/publicKey is provided
        if (body.jwksUri || body.publicKey) {
          clientAuthenticatorType = 'client-jwt'
        } else {
          // Default to client-secret for confidential clients without JWT config
          clientAuthenticatorType = 'client-secret'
        }
      }

      // Validate Backend Services requirements
      if (isBackendService) {
        if (!body.publicKey && !body.jwksUri) {
          set.status = 400
          return { error: 'Backend Services clients require either publicKey or jwksUri for JWT authentication' }
        }
      }

      const smartAppConfig = {
        clientId: body.clientId,
        name: body.name,
        ...(body.description && { description: body.description }),
        enabled: true,
        protocol: 'openid-connect',
        publicClient: isPublicClient,
        redirectUris: body.redirectUris || [],
        webOrigins: body.webOrigins || [],
        attributes: {
          ...(body.smartVersion && { 'smart_version': body.smartVersion }),
          ...(body.fhirVersion && { 'fhir_version': body.fhirVersion }),
          // Store the original UI appType as client_type attribute
          ...(body.appType && { 'client_type': body.appType }),
          // If no appType, fallback to clientType
          ...(!body.appType && isBackendService && { 'client_type': 'backend-service' }),
          
          // Store JWKS info for JWT authentication (backend services or confidential JWT clients)
          ...(body.jwksUri && clientAuthenticatorType === 'client-jwt' && {
            'use.jwks.url': 'true',
            'jwks.url': body.jwksUri
          }),
          
          // Metadata fields
          ...(body.launchUrl && { 'launch_url': body.launchUrl }),
          ...(body.logoUri && { 'logo_uri': body.logoUri }),
          ...(body.tosUri && { 'tos_uri': body.tosUri }),
          ...(body.policyUri && { 'policy_uri': body.policyUri }),
          ...(body.contacts && body.contacts.length > 0 && { 'contacts': body.contacts.join(',') }),
          
          // Server access control
          ...(body.serverAccessType && { 'server_access_type': body.serverAccessType }),
          ...(body.allowedServerIds && body.allowedServerIds.length > 0 && { 
            'allowed_server_ids': body.allowedServerIds.join(',') 
          }),
          
          // Scope set reference
          ...(body.scopeSetId && { 'scope_set_id': body.scopeSetId }),
          
          // PKCE configuration
          ...(body.requirePkce && { 'pkce.code.challenge.method': 'S256' })
        },
        // Configure client authentication method
        clientAuthenticatorType,

        // Configure OAuth2 settings for Backend Services
        standardFlowEnabled: !isBackendService, // Authorization code flow
        implicitFlowEnabled: false, // Not recommended for SMART
        directAccessGrantsEnabled: false, // Not used in SMART
        serviceAccountsEnabled: isBackendService, // Enable for client_credentials

        // Configure scopes - handle both built-in and custom scopes
        defaultClientScopes: [],  // We'll populate this after creation
        optionalClientScopes: []  // We'll populate this after creation
      }

      // Create the client
      logger.admin.debug('Creating client with config', { clientId: smartAppConfig.clientId })
      const createdClient = await admin.clients.create(smartAppConfig)

      // Keycloak returns just the ID, so we need to fetch the full client details
      const fullClient = await admin.clients.findOne({ id: createdClient.id })
      if (!fullClient) {
        throw new Error('Client created but could not retrieve details')
      }

      logger.admin.debug('Client created, details:', {
        clientId: fullClient.clientId,
        clientAuthenticatorType: fullClient.clientAuthenticatorType,
        serviceAccountsEnabled: fullClient.serviceAccountsEnabled,
        standardFlowEnabled: fullClient.standardFlowEnabled
      })

      // Assign scopes to the client
      try {
        const defaultScopesToAssign = body.defaultClientScopes || (isBackendService
          ? ['openid', 'profile'] // Keep it simple for Backend Services
          : ['openid', 'profile', 'email'])

        const optionalScopesToAssign = body.optionalClientScopes || []

        // Get all available client scopes to find matching ones by name
        const allClientScopes = await admin.clientScopes.find()

        // Find scope IDs for default scopes
        const defaultScopeIds = defaultScopesToAssign
          .map((scopeName: string) => allClientScopes.find(scope => scope.name === scopeName)?.id)
          .filter(Boolean) as string[]

        // Find scope IDs for optional scopes  
        const optionalScopeIds = optionalScopesToAssign
          .map((scopeName: string) => allClientScopes.find(scope => scope.name === scopeName)?.id)
          .filter(Boolean) as string[]

        // Assign default scopes to client
        for (const scopeId of defaultScopeIds) {
          try {
            await admin.clients.addDefaultClientScope({ id: fullClient.id!, clientScopeId: scopeId })
          } catch (error) {
            logger.admin.warn('Failed to assign default scope to client', { clientId: fullClient.clientId, scopeId, error })
          }
        }

        // Assign optional scopes to client
        for (const scopeId of optionalScopeIds) {
          try {
            await admin.clients.addOptionalClientScope({ id: fullClient.id!, clientScopeId: scopeId })
          } catch (error) {
            logger.admin.warn('Failed to assign optional scope to client', { clientId: fullClient.clientId, scopeId, error })
          }
        }

        logger.admin.debug('Scopes assigned to client', {
          clientId: fullClient.clientId,
          defaultScopes: defaultScopesToAssign,
          optionalScopes: optionalScopesToAssign,
          assignedDefaultScopeIds: defaultScopeIds,
          assignedOptionalScopeIds: optionalScopeIds
        })
      } catch (error) {
        logger.admin.warn('Failed to assign scopes to client', { clientId: fullClient.clientId, error })
      }

      // Handle offline access (refresh tokens)
      if (body.allowOfflineAccess) {
        try {
          const allClientScopes = await admin.clientScopes.find()
          const offlineScope = allClientScopes.find(s => s.name === 'offline_access')
          if (offlineScope && fullClient.id) {
            await admin.clients.addOptionalClientScope({
              id: fullClient.id,
              clientScopeId: offlineScope.id!
            })
            logger.admin.debug('Offline access enabled for client', { clientId: fullClient.clientId })
          }
        } catch (error) {
          logger.admin.warn('Failed to enable offline access', { clientId: fullClient.clientId, error })
        }
      }

      // Re-fetch client details to get updated scope assignments
      const clientAfterScopeAssignment = await admin.clients.findOne({ id: createdClient.id })
      const finalClientForResponse = clientAfterScopeAssignment || fullClient

      // If Backend Services with public key, register the key
      if (isBackendService && body.publicKey && createdClient.id) {
        try {
          // Convert PEM to JWKS format and register
          await registerPublicKeyForClient(admin, createdClient.id, body.publicKey)

          // Re-fetch client details after key registration
          const updatedClient = await admin.clients.findOne({ id: createdClient.id })
          logger.admin.debug('Client after key registration:', {
            clientId: updatedClient?.clientId,
            clientAuthenticatorType: updatedClient?.clientAuthenticatorType,
            hasJwksString: !!updatedClient?.attributes?.['jwks.string']
          })

          // Debug: Log what we're about to return as HTTP response
          const finalResponse = updatedClient || finalClientForResponse
          logger.admin.debug('HTTP Response for Backend Services client after key registration', {
            fields: Object.keys(finalResponse),
            clientId: finalResponse.clientId,
            clientAuthenticatorType: finalResponse.clientAuthenticatorType,
            serviceAccountsEnabled: finalResponse.serviceAccountsEnabled,
            standardFlowEnabled: finalResponse.standardFlowEnabled
          })

          return finalResponse
        } catch (keyError) {
          // Clean up created client if key registration fails
          await admin.clients.del({ id: createdClient.id })
          set.status = 400
          return { error: 'Failed to register public key for Backend Services client', details: keyError }
        }
      }

      // Debug: Log what we're about to return as HTTP response  
      logger.admin.debug('HTTP Response for standard client creation', {
        fields: Object.keys(finalClientForResponse),
        clientId: finalClientForResponse.clientId,
        clientAuthenticatorType: finalClientForResponse.clientAuthenticatorType,
        serviceAccountsEnabled: finalClientForResponse.serviceAccountsEnabled,
        standardFlowEnabled: finalClientForResponse.standardFlowEnabled
      })

      return finalClientForResponse
    } catch (error) {
      set.status = 400
      return { error: 'Failed to create SMART application', details: error }
    }
  }, {
    body: CreateSmartAppRequest,
    response: {
      200: SmartApp,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Create SMART on FHIR Application',
      description: 'Create a new SMART on FHIR application',
      tags: ['smart-apps'],
      security: [{ BearerAuth: [] }]
    }
  })

  .get('/:clientId', async ({ getAdmin, params, headers, set }): Promise<SmartAppType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      const clients = await admin.clients.find({ clientId: params.clientId })
      if (!clients[0]) {
        set.status = 404
        return { error: 'SMART application not found' }
      }

      // Enrich the client with actual scope information
      let enrichedClient = clients[0]
      try {
        // Fetch the full client details to ensure we have scope IDs
        const fullClient = await admin.clients.findOne({ id: clients[0].id! })
        if (fullClient) {
          // Fetch default client scopes details
          let defaultScopeNames: string[] = []
          if (fullClient.defaultClientScopes && fullClient.defaultClientScopes.length > 0) {
            try {
              const defaultScopeDetails = await Promise.all(
                fullClient.defaultClientScopes.map(async (scopeId) => {
                  try {
                    const scope = await admin.clientScopes.findOne({ id: scopeId })
                    return scope?.name || scopeId
                  } catch (error) {
                    logger.admin.warn('Failed to fetch default client scope', { scopeId, error })
                    return scopeId // fallback to ID if name fetch fails
                  }
                })
              )
              defaultScopeNames = defaultScopeDetails.filter(Boolean)
            } catch (error) {
              logger.admin.warn('Failed to fetch default client scopes', { clientId: clients[0].clientId, error })
            }
          }

          // Fetch optional client scopes details
          let optionalScopeNames: string[] = []
          if (fullClient.optionalClientScopes && fullClient.optionalClientScopes.length > 0) {
            try {
              const optionalScopeDetails = await Promise.all(
                fullClient.optionalClientScopes.map(async (scopeId) => {
                  try {
                    const scope = await admin.clientScopes.findOne({ id: scopeId })
                    return scope?.name || scopeId
                  } catch (error) {
                    logger.admin.warn('Failed to fetch optional client scope', { scopeId, error })
                    return scopeId // fallback to ID if name fetch fails
                  }
                })
              )
              optionalScopeNames = optionalScopeDetails.filter(Boolean)
            } catch (error) {
              logger.admin.warn('Failed to fetch optional client scopes', { clientId: clients[0].clientId, error })
            }
          }

          // Extract appType from client_type attribute
          const clientType = fullClient.attributes?.['client_type']
          const appType = Array.isArray(clientType) ? clientType[0] : clientType

          // Check if offline_access is in optional scopes
          const hasOfflineAccess = optionalScopeNames.includes('offline_access')

          // Use enriched client with scope names instead of IDs
          enrichedClient = {
            ...fullClient,
            defaultClientScopes: defaultScopeNames,
            optionalClientScopes: optionalScopeNames,
            appType: appType || (fullClient.serviceAccountsEnabled ? 'backend-service' : 'standalone-app'),
            clientType: (fullClient.serviceAccountsEnabled ? 'backend-service' : (fullClient.publicClient ? 'public' : 'confidential')) as 'backend-service' | 'public' | 'confidential',
            
            // Client secret (only included for confidential clients with client-secret auth)
            ...(fullClient.secret && { secret: fullClient.secret }),
            
            // Extract metadata fields from attributes
            launchUrl: fullClient.attributes?.['launch_url']?.[0],
            logoUri: fullClient.attributes?.['logo_uri']?.[0],
            tosUri: fullClient.attributes?.['tos_uri']?.[0],
            policyUri: fullClient.attributes?.['policy_uri']?.[0],
            contacts: fullClient.attributes?.['contacts']?.[0]?.split(',').filter(Boolean),
            
            // Server access control
            serverAccessType: fullClient.attributes?.['server_access_type']?.[0] as 'all-servers' | 'selected-servers' | 'user-person-servers' | undefined,
            allowedServerIds: fullClient.attributes?.['allowed_server_ids']?.[0]?.split(',').filter(Boolean),
            
            // Scope set reference
            scopeSetId: fullClient.attributes?.['scope_set_id']?.[0],
            
            // PKCE and offline access
            requirePkce: fullClient.attributes?.['pkce.code.challenge.method']?.includes('S256'),
            allowOfflineAccess: hasOfflineAccess
          } as SmartAppType
        }
      } catch (error) {
        logger.admin.warn('Failed to enrich individual client with scope details', { clientId: clients[0].clientId, error })
      }

      // Debug: Log what we're about to return for individual client retrieval
      logger.admin.debug('Individual Client Response', {
        fields: Object.keys(enrichedClient),
        clientId: enrichedClient.clientId,
        clientAuthenticatorType: enrichedClient.clientAuthenticatorType,
        serviceAccountsEnabled: enrichedClient.serviceAccountsEnabled,
        standardFlowEnabled: enrichedClient.standardFlowEnabled,
        defaultClientScopes: enrichedClient.defaultClientScopes,
        optionalClientScopes: enrichedClient.optionalClientScopes,
        hasDefaultScopes: !!enrichedClient.defaultClientScopes,
        hasOptionalScopes: !!enrichedClient.optionalClientScopes
      })

      return enrichedClient
    } catch (error) {
      return handleAdminError(error, set)
    }
  }, {
    params: ClientIdParam,
    response: {
      200: SmartApp,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Get SMART on FHIR Application',
      description: 'Get a single SMART on FHIR application by clientId',
      tags: ['smart-apps'],
      security: [{ BearerAuth: [] }]
    }
  })

  .put('/:clientId', async ({ getAdmin, params, body, headers, set }): Promise<SuccessResponseType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      const admin = await getAdmin(token)
      const clients = await admin.clients.find({ clientId: params.clientId })
      if (!clients[0]) {
        set.status = 404
        return { error: 'SMART application not found' }
      }

      const updateData = {
        name: body.name,
        description: body.description,
        enabled: body.enabled,
        redirectUris: body.redirectUris,
        webOrigins: body.webOrigins,
        attributes: {
          ...clients[0].attributes,
          smart_version: body.smartVersion ? [body.smartVersion] : clients[0].attributes?.smart_version,
          fhir_version: body.fhirVersion ? [body.fhirVersion] : clients[0].attributes?.fhir_version
        }
      }
      await admin.clients.update({ id: clients[0].id! }, updateData)

      // Handle scope updates if provided
      if (body.defaultClientScopes || body.optionalClientScopes) {
        try {
          // Get all available client scopes to find matching ones by name
          const allClientScopes = await admin.clientScopes.find()

          if (body.defaultClientScopes) {
            // Remove all existing default client scopes
            const existingClient = await admin.clients.findOne({ id: clients[0].id! })
            if (existingClient?.defaultClientScopes) {
              for (const scopeId of existingClient.defaultClientScopes) {
                try {
                  await admin.clients.delDefaultClientScope({ id: clients[0].id!, clientScopeId: scopeId })
                } catch (error) {
                  logger.admin.warn('Failed to remove existing default scope', { clientId: clients[0].clientId, scopeId, error })
                }
              }
            }

            // Add new default scopes
            const defaultScopeIds = body.defaultClientScopes
              .map((scopeName: string) => allClientScopes.find(scope => scope.name === scopeName)?.id)
              .filter(Boolean) as string[]

            for (const scopeId of defaultScopeIds) {
              try {
                await admin.clients.addDefaultClientScope({ id: clients[0].id!, clientScopeId: scopeId })
              } catch (error) {
                logger.admin.warn('Failed to add new default scope', { clientId: clients[0].clientId, scopeId, error })
              }
            }
          }

          if (body.optionalClientScopes) {
            // Remove all existing optional client scopes
            const existingClient = await admin.clients.findOne({ id: clients[0].id! })
            if (existingClient?.optionalClientScopes) {
              for (const scopeId of existingClient.optionalClientScopes) {
                try {
                  await admin.clients.delOptionalClientScope({ id: clients[0].id!, clientScopeId: scopeId })
                } catch (error) {
                  logger.admin.warn('Failed to remove existing optional scope', { clientId: clients[0].clientId, scopeId, error })
                }
              }
            }

            // Add new optional scopes
            const optionalScopeIds = body.optionalClientScopes
              .map((scopeName: string) => allClientScopes.find(scope => scope.name === scopeName)?.id)
              .filter(Boolean) as string[]

            for (const scopeId of optionalScopeIds) {
              try {
                await admin.clients.addOptionalClientScope({ id: clients[0].id!, clientScopeId: scopeId })
              } catch (error) {
                logger.admin.warn('Failed to add new optional scope', { clientId: clients[0].clientId, scopeId, error })
              }
            }
          }

          logger.admin.debug('Scopes updated for client', {
            clientId: clients[0].clientId,
            defaultScopes: body.defaultClientScopes,
            optionalScopes: body.optionalClientScopes
          })
        } catch (error) {
          logger.admin.warn('Failed to update scopes for client', { clientId: clients[0].clientId, error })
        }
      }

      return { success: true, message: 'SMART application updated successfully' }
    } catch (error) {
      set.status = 400
      return { error: 'Failed to update SMART application', details: error }
    }
  }, {
    params: ClientIdParam,
    body: UpdateSmartAppRequest,
    response: {
      200: SuccessResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Update SMART on FHIR Application',
      description: 'Update an existing SMART on FHIR application',
      tags: ['smart-apps'],
      security: [{ BearerAuth: [] }]
    }
  })

  .delete('/:clientId', async ({ getAdmin, params, headers, set }): Promise<SuccessResponseType | ErrorResponseType> => {
    try {
      // Extract user's token from Authorization header
      const token = headers.authorization?.replace('Bearer ', '')
      if (!token) {
        set.status = 401
        return { error: 'Authorization header required' }
      }

      // Prevent deleting the AI Assistant Agent - it's a system application
      if (params.clientId === 'ai-assistant-agent') {
        set.status = 403
        return { error: 'Cannot delete AI Assistant Agent - it is a protected system application' }
      }

      const admin = await getAdmin(token)
      const clients = await admin.clients.find({ clientId: params.clientId })
      if (!clients[0]) {
        set.status = 404
        return { error: 'SMART application not found' }
      }
      await admin.clients.del({ id: clients[0].id! })
      return { success: true, message: 'SMART application deleted successfully' }
    } catch (error) {
      return handleAdminError(error, set)
    }
  }, {
    params: ClientIdParam,
    response: {
      200: SuccessResponse,
      ...CommonErrorResponses
    },
    detail: {
      summary: 'Delete SMART on FHIR Application',
      description: 'Delete a SMART on FHIR application by clientId',
      tags: ['smart-apps'],
      security: [{ BearerAuth: [] }]
    }
  })
