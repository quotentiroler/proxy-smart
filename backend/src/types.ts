import type KcAdminClient from '@keycloak/keycloak-admin-client'

export interface AppDecorators {
  getAdmin(): KcAdminClient
}
