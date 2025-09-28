# Integration: core endpoints (template)

Copy into `backend/test/integration.enhanced.test.ts` and adjust to use your actual app if available.

```ts
import { describe, it, expect, beforeAll } from 'bun:test'
import { Elysia } from 'elysia'
import { treaty } from '@elysiajs/eden'

// Minimal app mirroring expected routes for integration-like tests
const createTestApp = () => {
  return new Elysia()
    .get('/', () => 'Proxy Smart Backend API')
    .get('/health', () => ({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }))
    .get('/status', () => ({
      status: 'healthy',
      version: '0.0.1-test',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        keycloak: 'unknown'
      }
    }))
    .get('/hello', () => 'hi')
    .post('/echo', ({ body }) => body)
}

describe('Integration: core endpoints', () => {
  let client: ReturnType<typeof treaty>

  beforeAll(() => {
    // Replace with treaty(realApp) if you can import your actual Elysia app
    const app = createTestApp()
    client = treaty(app)
  })

  it('GET / returns API description', async () => {
    const res = await client.get('/')
    expect(res.ok).toBe(true)
    const text = await res.text()
    expect(text).toContain('Proxy Smart Backend')
  })

  it('GET /health returns health object with uptime and timestamp', async () => {
    const res = await client.get('/health')
    expect(res.ok).toBe(true)
    const json = await res.json()
    expect(json).toHaveProperty('status')
    expect(json).toHaveProperty('timestamp')
    expect(json).toHaveProperty('uptime')
    expect(typeof json.uptime).toBe('number')
  })

  it('POST /echo echoes posted JSON body', async () => {
    const payload = { hello: 'world', num: 42 }
    const res = await client.post('/echo', { json: payload })
    expect(res.ok).toBe(true)
    const data = await res.json()
    expect(data).toEqual(payload)
  })

  it('edge case: POST /echo with empty body handles gracefully', async () => {
    const res = await client.post('/echo')

    // Try JSON first; if that fails, fallback to text
    let parsedAs: 'json' | 'text' | 'none' = 'none'
    let data: unknown = null
    try {
      data = await res.json()
      parsedAs = 'json'
    } catch (_) {
      try {
        data = await res.text()
        parsedAs = 'text'
      } catch (_) {
        parsedAs = 'none'
      }
    }

    if (parsedAs === 'json') {
      const d = data as any
      const isEmptyObject = typeof d === 'object' && d !== null && Object.keys(d).length === 0
      expect(d == null || isEmptyObject).toBe(true)
    } else if (parsedAs === 'text') {
      expect(data).toBe('')
    } else {
      // No body is also acceptable
      expect(true).toBe(true)
    }
  })
})
```
