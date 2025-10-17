# Issue: Elysia Generates Incomplete Schema References in OpenAPI Spec

## Summary
Elysia generates incomplete schema references (`$ref: "Response"`) in the OpenAPI specification instead of the proper full JSON Pointer reference (`$ref: "#/components/schemas/Response"`). This causes OpenAPI Generator to fail with warnings about undefined schemas.

## Problem Description
When Elysia routes don't have an explicit response schema defined, it auto-generates a default response with an incomplete schema reference:

**Generated (INVALID):**
```json
{
  "responses": {
    "200": {
      "description": "Response for status 200",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "Response"
          }
        }
      }
    }
  }
}
```

**Expected (VALID OpenAPI 3.0.3):**
```json
{
  "responses": {
    "200": {
      "description": "Response for status 200",
      "content": {
        "application/json": {
          "schema": {
            "$ref": "#/components/schemas/Response"
          }
        }
      }
    }
  }
}
```

## Impact
This causes OpenAPI Generator to emit 16+ warnings during code generation:
```
[main] WARN  o.o.codegen.utils.ModelUtils - #/components/schemas/Response is not defined
```

While the generator still produces output, these warnings indicate the specification is invalid and may cause issues with other OpenAPI tools.

## Root Cause
When a route handler doesn't explicitly define a `response` schema, Elysia generates a default response that references a non-existent `Response` schema with an incomplete JSON Pointer reference.

## Examples Affected
This occurs on endpoints like:
- Redirect endpoints (OAuth `/authorize`, `/login`, `/logout`)
- Endpoints with implicit responses
- Any route without explicit response schema definition

## Example Code That Triggers This
```typescript
.get('/authorize', ({ query, redirect }) => redirect(url.href), {
  query: AuthorizationQuery,
  // No explicit response schema -> Elysia generates incomplete $ref
  detail: { summary: 'OAuth Authorization Endpoint' }
})
```

## Expected Behavior
1. Use proper JSON Pointer references: `#/components/schemas/Response`
2. Or: Don't generate a schema reference if the schema doesn't exist in components
3. Or: Auto-generate a proper Response schema in components/schemas
4. Or: Use inline schema instead of $ref for auto-generated responses

## Workaround
Explicitly define response schemas for all routes to avoid auto-generation:
```typescript
.get('/authorize', ({ query, redirect }) => redirect(url.href), {
  query: AuthorizationQuery,
  response: t.Void(),  // Explicit schema prevents auto-generation
  detail: { summary: 'OAuth Authorization Endpoint' }
})
```

However, this workaround has its own issue (t.Void() generates `"type": "void"` which is invalid).

## Environment
- Elysia version: Latest
- OpenAPI version: 3.0.3
- OpenAPI Generator version: 7.x

## Related Standards
- OpenAPI 3.0.3 Spec: https://spec.openapis.org/oas/v3.0.3#schema-object
- JSON Pointer (RFC 6901): https://tools.ietf.org/html/rfc6901

## Suggested Fix
Modify Elysia's OpenAPI generation to:
1. Use full JSON Pointer references: `#/components/schemas/Response`
2. Or ensure the referenced schema exists in `components.schemas`
3. Or use inline schema definitions instead of $ref for generated responses

## Files That Would Need Changes
- Elysia OpenAPI plugin code that generates default response schemas
- The logic that creates the `$ref` should use full pointer syntax
