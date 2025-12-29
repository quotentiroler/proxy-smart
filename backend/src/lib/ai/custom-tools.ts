/**
 * Custom AI Tools - Tools that don't map to API routes
 * 
 * This module defines special-purpose tools that integrate with external services.
 * 
 * Note: Documentation search has been moved to public HTTP routes:
 * - GET /docs → Table of contents
 * - GET /docs/:filename → Raw markdown files
 * - GET /docs/search/keyword?q=query → Keyword search
 * - GET /docs/search/semantic?q=query → Semantic/vector search
 */

import type { ToolMetadata } from './tool-registry'

/**
 * Get all custom tools (non-route tools)
 */
export function getCustomTools(): Map<string, ToolMetadata> {
  const tools = new Map<string, ToolMetadata>()

  // Custom tools can be added here as needed
  // Documentation search has been moved to public HTTP routes (see /docs endpoints)
  
  return tools
}

/**
 * Tool metadata for OpenAPI documentation
 */
export const customToolDescriptions = {
  // Custom tool descriptions can be added here as needed
}
