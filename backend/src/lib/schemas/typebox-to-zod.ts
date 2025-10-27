import type { TSchema } from '@sinclair/typebox'
import { z, type ZodTypeAny } from 'zod'

type TB = {
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object'
  format?: string
  enum?: string[]
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  items?: TSchema | TSchema[]
  minItems?: number
  maxItems?: number
  properties?: Record<string, TSchema>
  required?: string[]
  additionalProperties?: boolean
}

function zodEnum(values: string[]): ZodTypeAny {
  if (values.length === 0) return z.never()
  const literals = values.map((v) => z.literal(v)) as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]] | ZodTypeAny[]
  if (literals.length === 1) return literals[0] as ZodTypeAny
  const [first, second, ...rest] = literals as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]
  return z.union([first, second, ...rest])
}

// Minimal TypeBox -> Zod converter for common shapes we use in tools
export function typeboxToZod(schema: TSchema): ZodTypeAny {
  const tb = schema as unknown as TB
  const kind = tb.type
  switch (kind) {
    case 'string': {
      let s = z.string()
      // If z.string().datetime() exists (zod v3.23+), use it; otherwise, keep as string
      if (tb.format === 'date-time' && typeof (s as unknown as { datetime?: () => typeof s }).datetime === 'function') {
        s = (s as unknown as { datetime: () => typeof s }).datetime()
      }
      if (Array.isArray(tb.enum)) s = zodEnum(tb.enum) as unknown as typeof s
      if (typeof tb.minLength === 'number') s = s.min(tb.minLength)
      if (typeof tb.maxLength === 'number') s = s.max(tb.maxLength)
      return s
    }
    case 'number': {
      let s = z.number()
      if (typeof tb.minimum === 'number') s = s.min(tb.minimum)
      if (typeof tb.maximum === 'number') s = s.max(tb.maximum)
      return s
    }
    case 'integer': {
      let s = z.number().int()
      if (typeof tb.minimum === 'number') s = s.min(tb.minimum)
      if (typeof tb.maximum === 'number') s = s.max(tb.maximum)
      return s
    }
    case 'boolean':
      return z.boolean()
    case 'array': {
      if (Array.isArray(tb.items)) {
        // Tuple-like
        const tupleItems = tb.items.map((it) => typeboxToZod(it))
        return z.tuple(tupleItems as [ZodTypeAny, ...ZodTypeAny[]])
      }
      const itemSchema = tb.items ? typeboxToZod(tb.items) : z.any()
      let s = z.array(itemSchema)
      if (typeof tb.minItems === 'number') s = s.min(tb.minItems)
      if (typeof tb.maxItems === 'number') s = s.max(tb.maxItems)
      return s
    }
    case 'object': {
      const properties = tb.properties || {}
      const required = Array.isArray(tb.required) ? tb.required : []
      const shape: Record<string, ZodTypeAny> = {}
      for (const [key, value] of Object.entries<TSchema>(properties)) {
        let prop = typeboxToZod(value)
        if (!required.includes(key)) prop = prop.optional()
        shape[key] = prop
      }
  const s = z.object(shape)
  // Zod's .strict() exists on objects
  if (tb.additionalProperties === false) return s.strict() as unknown as ZodTypeAny
  return s as unknown as ZodTypeAny
    }
    default:
      return z.any()
  }
}
