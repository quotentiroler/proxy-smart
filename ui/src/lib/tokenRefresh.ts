/**
 * Token refresh service - breaks circular dependency between apiClient and authStore
 * This module is imported by apiClient to handle token refresh without directly importing authStore
 */

import { getItem } from './storage';

// Type for the refresh function that will be injected
type RefreshTokensFn = () => Promise<void>;

let refreshTokensImpl: RefreshTokensFn | null = null;

/**
 * Register the token refresh implementation from authStore
 * This should be called during authStore initialization
 */
export function registerRefreshHandler(refreshFn: RefreshTokensFn) {
  refreshTokensImpl = refreshFn;
}

/**
 * Attempt to refresh tokens using the registered handler
 * Returns true if refresh was attempted (regardless of success)
 */
export async function attemptTokenRefresh(): Promise<boolean> {
  if (!refreshTokensImpl) {
    console.warn('⚠️ Token refresh handler not registered');
    return false;
  }

  try {
    const tokens = await getItem<{refresh_token?: string}>('openid_tokens');
    
    if (!tokens?.refresh_token) {
      console.debug('No refresh token available');
      return false;
    }

    console.debug('🔄 Attempting token refresh...');
    await refreshTokensImpl();
    console.debug('✅ Token refresh completed');
    return true;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    return false;
  }
}
