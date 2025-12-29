/**
 * AI Assistant - OpenAI integration with function calling
 * 
 * This replaces the Python MCP server by implementing function calling
 * directly in Node.js with direct access to your database and APIs.
 * 
 * Uses Vercel AI SDK with streaming and automatic function execution.
 */

import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { createToolExecutor, type ToolMetadata } from './tool-registry'

// Helper to ensure API key is configured
function ensureAPIKey(): string {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required for AI assistant functionality')
  }
  return process.env.OPENAI_API_KEY
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
 * Generate AI response with automatic function calling using AI SDK
 */
export async function* generateAIResponse(
  message: string,
  tools: Map<string, ToolMetadata>,
  context: AIContext,
  conversationId?: string,
  pageContext?: string
): AsyncGenerator<StreamChunk> {
  ensureAPIKey()
  
  // Create tool executor with user context
  const executor = createToolExecutor(tools, context)
  const toolDefinitions = executor.getToolDefinitions()
  
  // Build system prompt
  const systemPrompt = buildSystemPrompt(pageContext)
  
  // Convert tool definitions to AI SDK format with execute functions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aiSdkTools: Record<string, any> = {}
  
  for (const toolDef of toolDefinitions) {
    const td = toolDef as unknown as { name: string; description: string; input_schema: unknown }
    
    // Use passthrough schema to accept any properties
    const schema = z.object({}).passthrough()
    
    // Create tool with execute function
    const toolName = td.name
    aiSdkTools[toolName] = tool({
      description: td.description,
      parameters: schema,
      // @ts-expect-error - AI SDK types are complex, but this is the correct usage
      execute: async (args: Record<string, unknown>) => {
        return await executor.execute(toolName, args)
      },
    })
  }

  let usedTools = false

  try {
    const modelName = process.env.OPENAI_MODEL || 'gpt-5-mini'
    
    const result = await streamText({
      model: openai(modelName),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      tools: aiSdkTools,
      maxRetries: 5,
      onStepFinish: async (step) => {
        // Track if tools were used
        if (step.toolCalls && step.toolCalls.length > 0) {
          usedTools = true
        }
      }
    })

    // Stream the response
    for await (const chunk of result.fullStream) {
      switch (chunk.type) {
        case 'text-delta':
          yield {
            type: 'content',
            content: chunk.text
          }
          break
          
        case 'tool-call':
          yield {
            type: 'tool_call_started',
            toolName: chunk.toolName,
            toolCallId: chunk.toolCallId
          }
          break
          
        case 'tool-result':
          yield {
            type: 'tool_call_completed',
            toolName: chunk.toolName,
            toolCallId: chunk.toolCallId,
            success: true // AI SDK handles errors internally
          }
          break
          
        case 'error': {
          const errorMessage = chunk.error && typeof chunk.error === 'object' && 'message' in chunk.error 
            ? (chunk.error as Error).message 
            : String(chunk.error)
          yield {
            type: 'error',
            error: errorMessage
          }
          break
        }
      }
    }

    // Done
    yield {
      type: 'done',
      usedTools
    }
  } catch (error) {
    yield {
      type: 'error',
      error: error instanceof Error ? error.message : String(error)
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
