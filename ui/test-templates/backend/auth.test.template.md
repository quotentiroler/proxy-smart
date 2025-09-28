# Auth Routes tests (template)

Copy into `backend/test/auth.test.ts` and adjust imports.

```ts
import { describe, it, expect } from 'bun:test'
// Adjust this path to your actual backend routes file
import { authRoutes } from '../src/routes/auth'

describe('Auth Routes - config and error handling', () => {
  it('returns auth config with keycloak info and isConfigured boolean', async () => {
    const req = new Request('http://localhost/auth/config')
    const res = await authRoutes.handle(req)

    expect(res.status).toBe(200)
    const ct = res.headers.get('content-type') || ''
    expect(ct).toContain('application/json')

    const data = await res.json()
    expect(data).toHaveProperty('keycloak')
    expect(data.keycloak).toHaveProperty('isConfigured')
    expect(typeof data.keycloak.isConfigured).toBe('boolean')

    if ('clientId' in data.keycloak && data.keycloak.clientId != null) {
      expect(typeof data.keycloak.clientId).toBe('string')
    }
  })

  it('gracefully indicates not configured when required env is missing', async () => {
    // Adjust the env vars to match what your implementation reads
    const originalClientId = process.env.KEYCLOAK_CLIENT_ID
    delete process.env.KEYCLOAK_CLIENT_ID

    try {
      const res = await authRoutes.handle(new Request('http://localhost/auth/config'))
      expect(res.status).toBe(200)
      const data = await res.json()
      // Most implementations set isConfigured=false when essential env is missing
      expect(data?.keycloak?.isConfigured).toBe(false)
    } finally {
      if (originalClientId !== undefined) process.env.KEYCLOAK_CLIENT_ID = originalClientId
      else delete process.env.KEYCLOAK_CLIENT_ID
    }
  })
})
```

Notes:
- If your route depends on helpers (e.g., `getAuthConfig`) and you want to test error paths, stub/mocking those helpers is preferred. You can organize such tests near the helper modules.
