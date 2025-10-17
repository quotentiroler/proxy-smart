import { t, type Static } from 'elysia'

/**
 * OAuth and OpenID Connect schemas
 * Includes authorization flows, token management, and user information
 */

// ==================== OAuth Token Exchange ====================

export const TokenRequest = t.Object({
  grant_type: t.String({ description: 'OAuth2 grant type (authorization_code, refresh_token, client_credentials, password)' }),
  code: t.Optional(t.String({ description: 'Authorization code (for authorization_code grant)' })),
  redirect_uri: t.Optional(t.String({ description: 'Redirect URI used in authorization request' })),
  client_id: t.Optional(t.String({ description: 'OAuth2 client ID' })),
  client_secret: t.Optional(t.String({ description: 'OAuth2 client secret' })),
  code_verifier: t.Optional(t.String({ description: 'PKCE code verifier' })),
  refresh_token: t.Optional(t.String({ description: 'Refresh token (for refresh_token grant)' })),
  scope: t.Optional(t.String({ description: 'Requested scopes (space-separated)' })),
  audience: t.Optional(t.String({ description: 'Target audience for the token' })),
  username: t.Optional(t.String({ description: 'Username (for password grant)' })),
  password: t.Optional(t.String({ description: 'Password (for password grant)' })),
  client_assertion_type: t.Optional(t.String({ description: 'Client assertion type for JWT authentication' })),
  client_assertion: t.Optional(t.String({ description: 'Client assertion JWT for authentication' }))
}, { title: 'TokenRequest' })
export type TokenRequestType = Static<typeof TokenRequest>

export const IntrospectRequest = t.Object({
  token: t.String({ description: 'Token to introspect' }),
  token_type_hint: t.Optional(t.String({ description: 'Hint about token type (access_token, refresh_token)' })),
  client_id: t.Optional(t.String({ description: 'OAuth2 client ID' })),
  client_secret: t.Optional(t.String({ description: 'OAuth2 client secret' }))
}, { title: 'IntrospectRequest' })
export type IntrospectRequestType = Static<typeof IntrospectRequest>

export const IntrospectResponse = t.Object({
  active: t.Boolean({ description: 'Whether the token is active' }),
  sub: t.Optional(t.String({ description: 'Subject (user ID) of the token' })),
  aud: t.Optional(t.String({ description: 'Audience (intended recipient)' })),
  exp: t.Optional(t.Number({ description: 'Expiration time (Unix timestamp)' })),
  scope: t.Optional(t.String({ description: 'Granted scopes (space-separated)' }))
}, { title: 'IntrospectResponse' })
export type IntrospectResponseType = Static<typeof IntrospectResponse>

// ==================== OAuth Query Parameters ====================

export const AuthorizationQuery = t.Object({
  response_type: t.Optional(t.String({ description: 'OAuth response type' })),
  client_id: t.Optional(t.String({ description: 'OAuth client ID' })),
  redirect_uri: t.Optional(t.String({ description: 'OAuth redirect URI' })),
  scope: t.Optional(t.String({ description: 'OAuth scope' })),
  state: t.Optional(t.String({ description: 'OAuth state parameter' })),
  code_challenge: t.Optional(t.String({ description: 'PKCE code challenge' })),
  code_challenge_method: t.Optional(t.String({ description: 'PKCE code challenge method' })),
  authorization_details: t.Optional(t.String({ description: 'Authorization details JSON string for multiple FHIR servers' })),
  kc_idp_hint: t.Optional(t.String({ description: 'Keycloak Identity Provider hint to skip provider selection' }))
}, { title: 'AuthorizationQuery' })
export type AuthorizationQueryType = Static<typeof AuthorizationQuery>

export const LoginQuery = t.Object({
  client_id: t.Optional(t.String({ description: 'OAuth client ID (defaults to admin-ui)' })),
  redirect_uri: t.Optional(t.String({ description: 'OAuth redirect URI (defaults to base URL)' })),
  scope: t.Optional(t.String({ description: 'OAuth scope (defaults to openid profile email)' })),
  state: t.Optional(t.String({ description: 'OAuth state parameter (auto-generated if not provided)' })),
  code_challenge: t.Optional(t.String({ description: 'PKCE code challenge' })),
  code_challenge_method: t.Optional(t.String({ description: 'PKCE code challenge method' })),
  authorization_details: t.Optional(t.String({ description: 'Authorization details JSON string for multiple FHIR servers' }))
}, { title: 'LoginQuery' })
export type LoginQueryType = Static<typeof LoginQuery>

export const LogoutQuery = t.Object({
  post_logout_redirect_uri: t.Optional(t.String({ description: 'Post-logout redirect URI (defaults to base URL)' })),
  id_token_hint: t.Optional(t.String({ description: 'ID token hint for logout' })),
  client_id: t.Optional(t.String({ description: 'OAuth client ID' }))
}, { title: 'LogoutQuery' })
export type LogoutQueryType = Static<typeof LogoutQuery>

// ==================== Identity Provider Schemas ====================

export const PublicIdentityProvider = t.Object({
  alias: t.String({ description: 'Provider alias' }),
  providerId: t.String({ description: 'Provider type' }),
  displayName: t.String({ description: 'Display name' }),
  enabled: t.Boolean({ description: 'Whether provider is enabled' })
}, { title: 'PublicIdentityProvider' })
export type PublicIdentityProviderType = Static<typeof PublicIdentityProvider>

export const PublicIdentityProvidersResponse = t.Array(PublicIdentityProvider)
export type PublicIdentityProvidersResponseType = Static<typeof PublicIdentityProvidersResponse>

// ==================== FHIR Context Schemas ====================

const FhirContextItem = t.Object({
  reference: t.Optional(t.String({ description: 'FHIR resource reference' })),
  canonical: t.Optional(t.String({ description: 'Canonical URL' })),
  identifier: t.Optional(t.Object({}, { description: 'FHIR Identifier' })),
  type: t.Optional(t.String({ description: 'FHIR resource type' })),
  role: t.Optional(t.String({ description: 'Role URI' }))
}, { title: 'FhirContextItem' })

const AuthorizationDetail = t.Object({
  type: t.String({ description: 'Authorization details type (smart_on_fhir)' }),
  locations: t.Array(t.String({ description: 'Array of FHIR base URLs where token can be used' })),
  fhirVersions: t.Array(t.String({ description: 'Array of FHIR version codes (e.g., 4.0.1, 1.0.2)' })),
  scope: t.Optional(t.String({ description: 'Space-separated SMART scopes for these locations' })),
  patient: t.Optional(t.String({ description: 'Patient context for these locations' })),
  encounter: t.Optional(t.String({ description: 'Encounter context for these locations' })),
  fhirContext: t.Optional(t.Array(FhirContextItem, { description: 'FHIR context for these locations' }))
}, { title: 'AuthorizationDetail' })
export type AuthorizationDetailType = Static<typeof AuthorizationDetail>

// ==================== Token Response Schemas ====================

export const TokenResponse = t.Object({
  access_token: t.Optional(t.String({ description: 'JWT access token' })),
  token_type: t.Optional(t.String({ description: 'Token type (Bearer)' })),
  expires_in: t.Optional(t.Number({ description: 'Token expiration time in seconds' })),
  refresh_token: t.Optional(t.String({ description: 'Refresh token' })),
  refresh_expires_in: t.Optional(t.Number({ description: 'Refresh token expiration time in seconds' })),
  id_token: t.Optional(t.String({ description: 'OpenID Connect ID token' })),
  scope: t.Optional(t.String({ description: 'Granted scopes' })),
  session_state: t.Optional(t.String({ description: 'Keycloak session state' })),
  'not-before-policy': t.Optional(t.Number({ description: 'Not before policy timestamp' })),
  // SMART on FHIR launch context parameters (per SMART App Launch 2.2.0)
  patient: t.Optional(t.String({ description: 'Patient in context (e.g., Patient/123)' })),
  encounter: t.Optional(t.String({ description: 'Encounter in context (e.g., Encounter/456)' })),
  fhirUser: t.Optional(t.String({ description: 'FHIR user resource (e.g., Practitioner/789)' })),
  fhirContext: t.Optional(t.Array(FhirContextItem, { description: 'Additional FHIR resources in context' })),
  intent: t.Optional(t.String({ description: 'Launch intent (e.g., reconcile-medications)' })),
  smart_style_url: t.Optional(t.String({ description: 'URL to CSS stylesheet for styling' })),
  tenant: t.Optional(t.String({ description: 'Tenant identifier' })),
  need_patient_banner: t.Optional(t.Boolean({ description: 'Whether patient banner is required' })),
  // Authorization details for multiple FHIR servers (RFC 9396)
  authorization_details: t.Optional(t.Array(AuthorizationDetail, { description: 'Authorization details for multiple FHIR servers' })),
  error: t.Optional(t.String({ description: 'Error code if request failed' })),
  error_description: t.Optional(t.String({ description: 'Error description if request failed' }))
}, { title: 'TokenResponse' })
export type TokenResponseType = Static<typeof TokenResponse>

// ==================== User Info Schemas ====================

export const UserInfoHeader = t.Object({
  authorization: t.String({ description: 'Bearer token' })
}, { title: 'UserInfoHeader' })
export type UserInfoHeaderType = Static<typeof UserInfoHeader>

const UserName = t.Object({
  text: t.String({ description: 'Display name' })
}, { title: 'UserName' })

export const UserInfoResponse = t.Object({
  id: t.String({ description: 'User ID' }),
  fhirUser: t.Optional(t.String({ description: 'FHIR user resource reference (e.g., Practitioner/123)' })),
  name: t.Array(UserName),
  username: t.String({ description: 'Username' }),
  email: t.Optional(t.String({ description: 'Email address' })),
  firstName: t.Optional(t.String({ description: 'First name' })),
  lastName: t.Optional(t.String({ description: 'Last name' })),
  roles: t.Array(t.String({ description: 'User roles' }))
}, { title: 'UserInfoResponse' })
export type UserInfoResponseType = Static<typeof UserInfoResponse>

export const UserInfoErrorResponse = t.Object({
  error: t.String({ description: 'Error message' })
}, { title: 'UserInfoErrorResponse' })
export type UserInfoErrorResponseType = Static<typeof UserInfoErrorResponse>
