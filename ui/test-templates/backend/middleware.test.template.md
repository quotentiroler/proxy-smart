# Auth middleware guard (template)

Copy into `backend/test/middleware.test.ts` and adapt signatures to match your middleware.

```ts
import { describe, it, expect } from 'bun:test'
// Replace with actual middleware import path
import { authMiddleware } from '../src/middleware/auth'

describe('Auth middleware guard', () => {
  it('returns 401/403 when Authorization header is missing', async () => {
    const req = new Request('http://localhost/protected')

    let nextCalled = false
    const next = async () => { nextCalled = true; return new Response('ok') }

    // Adjust call signature to match your middleware framework (Elysia context vs express-style)
    const result = await authMiddleware({ request: req } as any, next as any)

    if (result instanceof Response) {
      expect([401, 403]).toContain(result.status)
      expect(nextCalled).toBe(false)
    } else {
      // If your middleware throws or signals via context, ensure next not called
      expect(nextCalled).toBe(false)
    }
  })

  it('calls next when valid Authorization header set', async () => {
    const req = new Request('http://localhost/protected', {
      headers: { Authorization: 'Bearer test-token' }
    })

    let nextCalled = false
    const next = async () => { nextCalled = true; return new Response('ok') }

    const res = await authMiddleware({ request: req } as any, next as any)

    expect(nextCalled).toBe(true)
    if (res instanceof Response) {
      expect(res.status).toBe(200)
    }
  })
})
```

Notes:
- Elysia middleware/plugins typically receive a Context (`{ request, set, store, ... }`). Adjust invocation accordingly.
- If you’re using a different framework pattern, adapt the test harness to fit your middleware signature.
