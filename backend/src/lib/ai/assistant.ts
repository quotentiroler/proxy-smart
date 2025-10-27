/**
 * AI Assistant - OpenAI integration with function calling
 * 
 * This replaces the Python MCP server by implementing function calling
 * directly in Node.js with direct access to your database and APIs.
 * 
 * Uses OpenAI's Responses API with automatic function execution.
 */

import OpenAI from 'openai'
import { createToolExecutor, type ToolMetadata } from './tool-registry'

// Lazy initialization - only create client when needed
let _openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!_openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required for AI assistant functionality')
    }
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return _openai
}

export interface AIContext {
  userId: string
  roles: string[]
  email?: string
}

export interface StreamChunk {
  type: 'content' | 'tool_call_started' | 'tool_call_completed' | 'done' | 'error'
  content?: string
  toolName?: string
  toolCallId?: string
  success?: boolean
  error?: string
  usedTools?: boolean
}

/**
 * Generate AI response with automatic function calling using Responses API
 */
export async function* generateAIResponse(
  message: string,
  tools: Map<string, ToolMetadata>,
  context: AIContext,
  conversationId?: string,
  pageContext?: string
): AsyncGenerator<StreamChunk> {
  // Create tool executor with user context
  const executor = createToolExecutor(tools, context)
  const toolDefinitions = executor.getToolDefinitions()
  
  // Build system prompt (instructions in Responses API)
  const instructions = buildSystemPrompt(pageContext)
  
  // Build input for Responses API
  const input = [{ role: 'user' as const, content: message }]

  let usedTools = false
  const maxIterations = 5 // Prevent infinite loops
  let iteration = 0

  try {
    // Track all output items from first turn (needed for reasoning models)
    let allOutputItems: unknown[] = []

    while (iteration < maxIterations) {
      iteration++

      // Build API parameters
      const apiParams: {
        model: string
        instructions: string
        input: unknown[]
        stream: boolean
        tools?: unknown[]
        reasoning?: { effort?: string; summary?: string }
      } = {
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        instructions,
        input: iteration === 1 ? input : allOutputItems.concat([{ role: 'user' as const, content: message }]),
        stream: true,
      }

      // Add tools if available
      if (toolDefinitions.length > 0) {
        apiParams.tools = toolDefinitions
      }

      // Add reasoning config for GPT-5 models
      if (apiParams.model.toLowerCase().includes('gpt-5') || apiParams.model.toLowerCase().includes('o1')) {
        apiParams.reasoning = {
          effort: process.env.OPENAI_REASONING_EFFORT || 'medium',
        }
        if (process.env.OPENAI_REASONING_SUMMARY !== 'none') {
          apiParams.reasoning.summary = process.env.OPENAI_REASONING_SUMMARY || 'auto'
        }
      }

      // Create streaming response
      const openai = getOpenAI()
      const stream = await openai.responses.create(apiParams as Parameters<typeof openai.responses.create>[0]) as AsyncIterable<unknown>

      const functionCalls: Record<string, { name: string; call_id: string; arguments: string }> = {}
      allOutputItems = []

      // Process stream
      for await (const rawEvent of stream) {
        const event = rawEvent as { type?: string; [key: string]: unknown }
        if (!event.type) continue

        const eventType = event.type

        // Collect all output items for next turn
        if (eventType === 'response.output_item.added' && 'item' in event) {
          // Store item for next API call (required for reasoning models)
          allOutputItems.push(event.item)
        }

        // Stream reasoning summaries
        if (eventType === 'response.reasoning.summary.delta' && 'delta' in event) {
          yield {
            type: 'content',
            content: `[Reasoning: ${event.delta}]`,
          }
        }

        // Handle output item done
        if (eventType === 'response.output_item.done' && 'item' in event) {
          const item = event.item as { type?: string; name?: string; call_id?: string; arguments?: string }
          
          // Track function calls
          if (item.type === 'function_call' && item.name && item.call_id) {
            functionCalls[item.call_id] = {
              name: item.name,
              call_id: item.call_id,
              arguments: item.arguments || '{}',
            }

            yield {
              type: 'tool_call_started',
              toolName: item.name,
              toolCallId: item.call_id,
            }
          }
        }

        // Stream text deltas
        if (eventType === 'response.output_text.delta' && 'delta' in event) {
          yield {
            type: 'content',
            content: event.delta as string,
          }
        }

        // Response complete
        if (eventType === 'response.completed') {
          break
        }
      }

      // If no function calls, we're done
      if (Object.keys(functionCalls).length === 0) {
        break
      }

      usedTools = true

      // Execute function calls
      const functionOutputs: unknown[] = []
      for (const [callId, fc] of Object.entries(functionCalls)) {
        try {
          const args = JSON.parse(fc.arguments)
          const result = await executor.execute(fc.name, args)

          functionOutputs.push({
            type: 'function_call_output',
            call_id: callId,
            output: JSON.stringify(result),
          })

          yield {
            type: 'tool_call_completed',
            toolName: fc.name,
            toolCallId: callId,
            success: true,
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)

          functionOutputs.push({
            type: 'function_call_output',
            call_id: callId,
            output: JSON.stringify({ error: errorMessage }),
          })

          yield {
            type: 'tool_call_completed',
            toolName: fc.name,
            toolCallId: callId,
            success: false,
            error: errorMessage,
          }
        }
      }

      // Build input for next iteration (second turn)
      // Include ALL output items from first turn (required for reasoning models)
      allOutputItems = allOutputItems.concat(functionOutputs)
    }

    // Done
    yield {
      type: 'done',
      usedTools,
    }
  } catch (error) {
    yield {
      type: 'error',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Build system prompt with context
 */
function buildSystemPrompt(pageContext?: string): string {
  let prompt = `You are an AI assistant for the SMART on FHIR platform. You help users manage:

- Healthcare Users and FHIR associations
- SMART Applications and registrations
- FHIR Servers and configurations
- Identity Providers and authentication
- Launch Contexts for clinical workflows
- OAuth monitoring and analytics

You have access to two types of tools:

1. **Action Tools**: Create, update, delete resources in the system
   - Use these when users want to modify data
   - Example: "Create a new healthcare user"

2. **Search Tool** (search_documentation): Search technical documentation
   - Use this when users ask questions about specifications, concepts, or "how-to"
   - Example: "How does SMART launch context work?"
   - Example: "What is a FHIR Patient resource?"
   - The search uses semantic/RAG to find relevant docs
   - Always use the formatted_context from search results in your answer

**Strategy:**
- For questions → search_documentation first, then answer
- For commands → use action tools directly
- You can combine both: search for specs, then take action based on findings

Be concise and helpful. When using tools, explain what you're doing.`
  
  if (pageContext) {
    prompt += `\n\n[Current Page Context]\n${pageContext}`
  }
  
  return prompt
}
