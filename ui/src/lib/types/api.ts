/* tslint:disable */
 
/**
 * Type definitions and re-exports for the SMART on FHIR Proxy API client
 */

// Re-export all models from the API client
export * from '../api-client/models';

// Re-export API classes and request types
export * from '../api-client/apis';

// Import types needed for extending
import type { 
  FhirServerListServersInner, 
  SmartApp as ApiSmartApp,
  CreateSmartAppRequest,
  CreateHealthcareUserRequest
} from '../api-client/models';

// Additional type aliases for compatibility
export type {
  ClientRegistrationSettings,
  FhirServer,
  FhirServerList,
  HealthcareUser,
  PublicIdentityProvider,
  OAuthEvent,
  UserInfoResponse as UserProfile,
  ChatResponse,
  TokenResponse,
  CreateSmartAppRequest,
  UpdateSmartAppRequest,
  CreateHealthcareUserRequest,
  UpdateHealthcareUserRequest,
} from '../api-client/models';

// Extended SmartApp with UI-specific properties
export interface SmartApp extends ApiSmartApp {
  scopeSetId?: string;
  status?: 'active' | 'inactive';
  serverAccessType?: 'all-servers' | 'selected-servers' | 'user-person-servers';
  authenticationType?: AuthenticationType;
  allowedServerIds?: string[];
  lastUsed?: string;
}

// Extended FhirServerWithState with UI-specific properties
export interface FhirServerWithState extends FhirServerListServersInner {
  connectionStatus?: string;
  loading?: boolean;
  error?: string;
}

// Additional custom types not directly from OpenAPI

export interface FhirPersonAssociation {
  serverName: string;
  personId: string;
  display?: string;
  created?: string;
}

// HealthcareUserFormData extends from generated CreateHealthcareUserRequest with UI-specific additions
export interface HealthcareUserFormData extends CreateHealthcareUserRequest {
  // Additional UI-specific fields not in the backend model
  enabled?: boolean;
  emailVerified?: boolean;
  npi?: string;
  practitionerId?: string;
  fhirPersons?: FhirPersonAssociation[];
  primaryRole?: string;
  clientRoles?: Record<string, string[]>; // Override the generic 'object' type with more specific type
}

// SmartAppFormData extends from generated CreateSmartAppRequest with UI-specific additions
export interface SmartAppFormData extends CreateSmartAppRequest {
  // Additional UI-specific fields not in the backend model
  id?: string;
  enabled?: boolean;
  scopeSetId?: string;
  allowedServerIds?: string[];
  authType?: AuthenticationType;
  authenticationType?: AuthenticationType;
  serverAccessType?: 'all-servers' | 'selected-servers' | 'user-person-servers';
  launchUrl?: string;
  logoUri?: string;
  tosUri?: string;
  policyUri?: string;
  contacts?: string[];
  type?: SmartAppType;
  defaultClientScopes?: string[];
  optionalClientScopes?: string[];
  requirePkce?: boolean;
  allowOfflineAccess?: boolean;
}

export interface ScopeSet {
  id: string;
  name: string;
  description?: string;
  scopes: string[];
}

// Import and re-export the API client's enum types
import type { SmartAppAppTypeEnum } from '../api-client/models';
import { SmartAppAppTypeEnum as SmartAppTypeEnum } from '../api-client/models';
export type SmartAppType = SmartAppAppTypeEnum;
export { SmartAppTypeEnum };
export type AuthenticationType = 'public' | 'confidential' | 'backend-service' | 'asymmetric' | 'symmetric' | 'none';

/**
 * FHIR server details response - uses generated type from OpenAPI spec
 */
export type { FhirServerDetails } from '../api-client/models';

export interface DashboardData {
  loading: boolean;
  error: string | null;
  stats: {
    totalApps: number;
    activeUsers: number;
    connectedServers: number;
    todayRequests: number;
  };
  serverStatus: {
    keycloak: 'healthy' | 'unhealthy' | 'unknown';
    fhir: 'healthy' | 'unhealthy' | 'unknown';
    database: 'healthy' | 'unhealthy' | 'unknown';
  };
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
  smartAppsCount: number;
  usersCount: number;
  serversCount: number;
  identityProvidersCount: number;
}

// Additional missing types
export type { FhirServerList as FhirServersListResponse } from '../api-client/models';
export type { KeycloakConfigResponse } from '../api-client/models';
export type { SystemStatusResponse } from '../api-client/models';
export type { OAuthAnalyticsResponse } from '../api-client/models';
export type { OAuthEventsResponse as OAuthEventsListResponse } from '../api-client/models';
