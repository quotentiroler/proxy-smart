#!/usr/bin/env bun
/**
 * Post-processes the Elysia-generated OpenAPI spec to fix validation issues
 * that prevent openapi-generator from parsing it correctly.
 * 
 * Known issues with Elysia's OpenAPI generation:
 * 1. Parameter schemas use both `type` and `schema` fields (should be one or the other)
 * 2. Some response content-types are marked as unexpected
 * 3. RequestBody structures don't match OpenAPI 3.0.3 spec exactly
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

type OpenAPISpec = Record<string, unknown>;
type Parameter = Record<string, unknown>;
type Responses = Record<string, unknown>;
type RequestBody = Record<string, unknown>;
type PathItem = Record<string, unknown>;
type Operation = Record<string, unknown>;

const specPath = join(import.meta.dir, '../dist/openapi.json');

console.log('Reading OpenAPI spec from:', specPath);
const spec = JSON.parse(readFileSync(specPath, 'utf-8')) as OpenAPISpec;

let fixCount = 0;

/**
 * Fix parameter definitions - remove duplicate type/schema fields
 */
function fixParameters(parameters: Parameter[] | undefined): Parameter[] | undefined {
  if (!parameters || !Array.isArray(parameters)) return parameters;

  return parameters.map(param => {
    if (param.schema && param.type) {
      // If both schema and type exist, keep schema and remove type
      const { type: _type, ...rest } = param;
      fixCount++;
      return rest;
    }
    if (param.schema && typeof param.schema === 'object' && !(param.schema as Record<string, unknown>).type && param.type) {
      // If schema exists but has no type, move type into schema
      const { type, ...rest } = param;
      fixCount++;
      return {
        ...rest,
        schema: {
          ...(param.schema as Record<string, unknown>),
          type
        }
      };
    }
    return param;
  });
}

/**
 * Fix response definitions - ensure content is properly structured
 */
function fixResponses(responses: Responses): Responses {
  if (!responses || typeof responses !== 'object') return responses;

  const fixed: Record<string, unknown> = {};

  for (const [code, response] of Object.entries(responses)) {
    if (code === 'responses') {
      // Skip invalid 'responses' key that shouldn't exist
      continue;
    }

    if (typeof response === 'object' && response !== null) {
      const fixedResponse = { ...(response as Record<string, unknown>) };

      // Ensure content is properly structured
      if (fixedResponse.content && typeof fixedResponse.content === 'object') {
        const fixedContent: Record<string, unknown> = {};
        for (const [mediaType, mediaTypeObj] of Object.entries(fixedResponse.content as Record<string, unknown>)) {
          if (typeof mediaTypeObj === 'object' && mediaTypeObj !== null) {
            fixedContent[mediaType] = mediaTypeObj;
          }
        }
        fixedResponse.content = fixedContent;
      }

      fixed[code] = fixedResponse;
    }
  }

  return Object.keys(fixed).length > 0 ? fixed : responses;
}

/**
 * Fix request body definitions
 */
function fixRequestBody(requestBody: RequestBody): RequestBody {
  if (!requestBody || typeof requestBody !== 'object') return requestBody;

  // Ensure content is properly structured
  if (requestBody.content && typeof requestBody.content === 'object') {
    const fixedContent: Record<string, unknown> = {};
    for (const [mediaType, mediaTypeObj] of Object.entries(requestBody.content as Record<string, unknown>)) {
      if (typeof mediaTypeObj === 'object' && mediaTypeObj !== null) {
        fixedContent[mediaType] = mediaTypeObj;
      }
    }
    return {
      ...requestBody,
      content: fixedContent
    };
  }

  return requestBody;
}

/**
 * Process all paths in the spec
 */
if (spec.paths && typeof spec.paths === 'object') {
  for (const pathItem of Object.values(spec.paths as Record<string, PathItem>)) {
    if (typeof pathItem !== 'object' || pathItem === null) continue;

    for (const [method, operation] of Object.entries(pathItem)) {
      if (method === 'ws') {
        // Remove WebSocket endpoints - not part of OpenAPI 3.0.3
        delete pathItem[method];
        fixCount++;
        continue;
      }

      if (typeof operation === 'object' && operation !== null) {
        const op = operation as Operation;

        // Fix parameters
        if (op.parameters) {
          op.parameters = fixParameters(op.parameters as Parameter[]);
        }

        // Fix responses
        if (op.responses) {
          op.responses = fixResponses(op.responses as Responses);
        }

        // Fix request body
        if (op.requestBody) {
          op.requestBody = fixRequestBody(op.requestBody as RequestBody);
        }
      }
    }
  }
}

/**
 * Remove swagger field if it exists (should be openapi)
 */
if ('swagger' in spec) {
  delete spec.swagger;
  fixCount++;
}

/**
 * Ensure required top-level fields exist
 */
if (!spec.openapi) {
  spec.openapi = '3.0.3';
  fixCount++;
}

if (!spec.info) {
  spec.info = {
    title: 'API',
    version: '1.0.0'
  };
  fixCount++;
}

console.log(`Applied ${fixCount} fixes to the OpenAPI spec`);

// Write the fixed spec back
writeFileSync(specPath, JSON.stringify(spec, null, 2));
console.log('Fixed OpenAPI spec written to:', specPath);
