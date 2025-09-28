# Route error handling and validation (template)

Copy into `backend/test/routes.error.test.ts` and wire to your real app/handler.

```ts
import { describe, it, expect } from 'bun:test'
import { Elysia } from 'elysia'

// Prefer importing your real app. Example:
// import { createApp } from '../src/server'
// const app = createApp()
// For demonstration, we create a minimal app with validation/error paths.
const createMockApp = () => {
  const app = new Elysia()
    .post('/items', ({ body, set }) => {
      // Example validation: require name
      if (!body || typeof body !== 'object' || !('name' in body) || !body.name) {
        set.status = 400
        return { error: 'name is required' }
      }
      return { ok: true }
    })
    .get('/boom', () => {
      throw new Error('internal crash')
    })
  return app
}

describe('Route error handling and validation', () => {
  it('returns 400/422 for missing required body fields on POST /items', async () => {
    const app = createMockApp()
    const res = await app.handle(new Request('http://localhost/items', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({})
    }))
    expect([400, 422]).toContain(res.status)
  })

  it('returns 404 for unknown routes', async () => {
    const app = createMockApp()
    const res = await app.handle(new Request('http://localhost/does-not-exist'))
    expect([404, 405]).toContain(res.status)
  })

  it('propagates internal server errors as 500', async () => {
    const app = createMockApp()
    const res = await app.handle(new Request('http://localhost/boom'))
    expect(res.status).toBeGreaterThanOrEqual(500)
    expect(res.status).toBeLessThan(600)
  })
})
```

Notes:
- Replace `createMockApp` with your real app instance if available to increase real coverage.
- Adjust validation logic and endpoints to match your implementation.
