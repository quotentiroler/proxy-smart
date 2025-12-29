import { describe, it, expect } from 'bun:test'
import { t } from 'elysia'
import { typeboxToZod } from '@/lib/schemas/typebox-to-zod'

describe('typeboxToZod converter', () => {
  it('converts object with required/optional and strictness', () => {
    const tb = t.Object({
      a: t.String(),
      b: t.Optional(t.Number()),
    }, { additionalProperties: false })

    const z = typeboxToZod(tb)

    // Accepts required only
    expect(() => z.parse({ a: 'x' })).not.toThrow()
    // Accepts optional present
    expect(() => z.parse({ a: 'x', b: 2 })).not.toThrow()
    // Rejects missing required
    expect(() => z.parse({})).toThrow()
    // Rejects unknown props due to strict
    expect(() => z.parse({ a: 'x', c: 'nope' })).toThrow()
  })

  it('converts arrays with item type and size constraints', () => {
    const tb = t.Object({
      tags: t.Array(t.String(), { minItems: 1, maxItems: 3 })
    })
    const z = typeboxToZod(tb)
    expect(() => z.parse({ tags: ['a'] })).not.toThrow()
    expect(() => z.parse({ tags: [] })).toThrow()
    expect(() => z.parse({ tags: ['a', 'b', 'c', 'd'] })).toThrow()
  })
})
