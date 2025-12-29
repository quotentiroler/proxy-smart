# Adding Custom MCP Tools

This guide shows how to add custom tools that the AI assistant can use.

## Method 1: Add Backend Route (Recommended)

The easiest way is to add a new route - it automatically becomes an MCP tool!

### Example: Weather Tool

```typescript
// backend/src/routes/admin/weather.ts
import { Elysia, t } from 'elysia'
import { logger } from '@/lib/logger'

export const weatherRoutes = new Elysia({ prefix: '/admin/weather', tags: ['weather'] })
  .get('/current', async ({ query }) => {
    const { city } = query
    
    logger.server.info('Getting weather', { city })
    
    // Call weather API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`
    )
    
    const data = await response.json()
    
    return {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity
    }
  }, {
    query: t.Object({
      city: t.String({ description: 'City name to get weather for' })
    }),
    detail: {
      summary: 'Get current weather for a city',
      description: 'Fetches current weather conditions including temperature, humidity, and description.'
    }
  })
```

### Register the route

```typescript
// backend/src/app-factory.ts
import { weatherRoutes } from './routes/admin/weather'

export const createApp = () => {
  return new Elysia()
    // ... other routes
    .use(weatherRoutes)
    // ...
}
```

### Result

The AI can now call this tool:

```typescript
// Tool name: getCurrentWeather
// Parameters: { city: string }
// Description: Get current weather for a city

// AI usage:
User: "What's the weather in London?"
AI: [calls getCurrentWeather({ city: "London" })]
AI: "The current weather in London is partly cloudy with a temperature of 15°C and 75% humidity."
```

## Method 2: Create External MCP Server

For tools that don't fit as backend routes (e.g., filesystem access, external APIs), create a separate MCP server.

### Example: Filesystem MCP Server

```typescript
// separate-mcp-server/filesystem-mcp.ts
import { Elysia } from 'elysia'
import { readFile, writeFile, readdir } from 'fs/promises'

const app = new Elysia()
  .post('/mcp', async ({ body }) => {
    if (body.type === 'listTools') {
      return {
        tools: [
          {
            type: 'function',
            function: {
              name: 'readFile',
              description: 'Read contents of a file',
              parameters: {
                type: 'object',
                properties: {
                  path: { type: 'string', description: 'File path to read' }
                },
                required: ['path']
              }
            }
          },
          {
            type: 'function',
            function: {
              name: 'listDirectory',
              description: 'List files in a directory',
              parameters: {
                type: 'object',
                properties: {
                  path: { type: 'string', description: 'Directory path' }
                },
                required: ['path']
              }
            }
          }
        ]
      }
    }
    
    if (body.type === 'callTool') {
      const { name, args } = body
      
      if (name === 'readFile') {
        const content = await readFile(args.path, 'utf-8')
        return {
          content: [{ type: 'text', text: content }]
        }
      }
      
      if (name === 'listDirectory') {
        const files = await readdir(args.path)
        return {
          content: [{ type: 'text', text: JSON.stringify(files) }]
        }
      }
      
      throw new Error(`Unknown tool: ${name}`)
    }
  })
  .listen(3000)
```

### Connect to Backend

```typescript
// backend/src/routes/admin/ai-mcp.ts
// In POST /chat handler:

const mcpManager = new McpConnectionManager()

// Internal backend tools
mcpManager.addServer('internal-backend', 
  McpClient.createInternalClient(token))

// External filesystem tools
mcpManager.addServer('filesystem',
  McpClient.createExternalClient(
    'http://localhost:3000/mcp',
    'filesystem-mcp',
    { token: process.env.FILESYSTEM_MCP_TOKEN }
  ))
```

## Method 3: Direct Tool Registration (Advanced)

For one-off tools without HTTP overhead:

```typescript
// backend/src/routes/admin/ai-mcp.ts

// In POST /chat handler, after tool discovery:
const toolsList = await mcpManager.getAllTools()

// Add custom tool directly
const customTools = [
  {
    type: 'function' as const,
    function: {
      name: 'internal-backend__calculateShipping',
      description: 'Calculate shipping cost based on weight and distance',
      parameters: {
        type: 'object',
        properties: {
          weight: { type: 'number', description: 'Package weight in kg' },
          distance: { type: 'number', description: 'Distance in km' }
        },
        required: ['weight', 'distance']
      }
    },
    serverName: 'internal-backend'
  }
]

const allTools = [...toolsList, ...customTools]

// Add execution handler
const tools: Record<string, any> = {}

for (const tool of allTools) {
  tools[tool.function.name] = {
    description: tool.function.description,
    parameters: tool.function.parameters,
    execute: async (args: Record<string, unknown>) => {
      if (tool.function.name === 'internal-backend__calculateShipping') {
        const { weight, distance } = args as { weight: number; distance: number }
        const cost = weight * 0.5 + distance * 0.1
        return JSON.stringify({ cost, currency: 'USD' })
      }
      
      // Default: route to MCP server
      return (await mcpManager.callTool(tool.function.name, args))
        .content[0]?.text || ''
    }
  }
}
```

## Best Practices

### 1. Tool Naming
- Use descriptive names: `getCurrentWeather` not `weather`
- Use camelCase: `getUserById` not `get-user-by-id`
- Prefix with verb: `listUsers`, `createApp`, `updateServer`

### 2. Tool Descriptions
- Be specific: "Get current weather for a city" not "Weather"
- Include units: "Temperature in Celsius", "Distance in km"
- Mention side effects: "Creates a new user in the database"

### 3. Parameters
- Mark required parameters clearly
- Provide good descriptions for each parameter
- Use appropriate types (string, number, boolean, object, array)
- Add constraints: min/max, pattern, enum

### 4. Error Handling
```typescript
.get('/users/:id', async ({ params, set }) => {
  try {
    const user = await getUserById(params.id)
    if (!user) {
      set.status = 404
      return { error: 'User not found' }
    }
    return user
  } catch (error) {
    logger.server.error('Failed to get user', { error, userId: params.id })
    set.status = 500
    return { error: 'Failed to retrieve user' }
  }
}, {
  params: t.Object({
    id: t.String({ description: 'User ID' })
  }),
  detail: {
    summary: 'Get user by ID',
    description: 'Retrieves detailed information about a specific user.'
  }
})
```

### 5. Authentication & Authorization
```typescript
// Tools under /admin/* require admin scope automatically
// For custom authorization:

.get('/admin/sensitive-data', async ({ headers, set }) => {
  // Validate token
  const token = headers.authorization?.slice(7)
  if (!token) {
    set.status = 401
    return { error: 'Authentication required' }
  }
  
  const payload = await validateToken(token)
  
  // Check specific permission
  if (!hasPermission(payload, 'view:sensitive-data')) {
    set.status = 403
    return { error: 'Insufficient permissions' }
  }
  
  // Proceed...
}, {
  detail: {
    summary: 'Get sensitive data',
    description: 'Requires view:sensitive-data permission'
  }
})
```

### 6. Response Format
```typescript
// Good: Structured, parseable
return {
  success: true,
  data: {
    id: '123',
    name: 'John',
    email: 'john@example.com'
  },
  timestamp: new Date().toISOString()
}

// Bad: Unstructured string
return "User John with email john@example.com"
```

## Tool Discovery

To see what tools are available:

```typescript
// Test endpoint
.get('/admin/ai/tools', async ({ headers }) => {
  const token = headers.authorization?.slice(7)
  if (!token) return { error: 'Authentication required' }
  
  const mcpManager = new McpConnectionManager()
  mcpManager.addServer('internal-backend', 
    McpClient.createInternalClient(token))
  
  const tools = await mcpManager.getAllTools()
  
  return {
    count: tools.length,
    tools: tools.map(t => ({
      name: t.function.name,
      description: t.function.description,
      parameters: t.function.parameters
    }))
  }
})
```

## Example Conversation

```
User: "What's the weather in Paris and how many users do we have?"

AI thinks:
1. Need weather → call getCurrentWeather({ city: "Paris" })
2. Need user count → call listUsers({})

AI executes:
[Tool: internal-backend__getCurrentWeather]
Args: { city: "Paris" }
Result: { city: "Paris", temperature: 18, description: "clear sky" }

[Tool: internal-backend__listUsers]
Args: {}
Result: [{ id: "1", ... }, { id: "2", ... }, ...] (25 users)

AI responds:
"The current weather in Paris is clear sky with a temperature of 18°C. 
You currently have 25 users registered in the system."
```

## Testing New Tools

```bash
# 1. Test the route directly
curl http://localhost:8445/admin/weather/current?city=London \
  -H "Authorization: Bearer $TOKEN"

# 2. Test MCP tool discovery
curl http://localhost:8445/mcp \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"listTools"}'

# 3. Test MCP tool execution
curl http://localhost:8445/mcp \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "callTool",
    "name": "getCurrentWeather",
    "args": { "city": "London" }
  }'

# 4. Test via AI assistant
curl http://localhost:8445/admin/ai/chat \
  -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the weather in London?"
  }'
```

## Common Issues

### Tool not appearing in list
- Check route is registered in `app-factory.ts`
- Verify route has correct prefix (`/admin/*` or `/fhir-servers/*`)
- Check route has `detail` metadata with summary/description

### "Tool execution failed"
- Test route directly first (bypass MCP)
- Check logs for detailed error
- Verify parameters match schema
- Ensure authentication token is valid

### AI not using tool
- Improve tool description (be more specific)
- Ensure parameters are well-documented
- Check if AI has context to know when to use it
- Try explicitly mentioning the tool capability in system prompt

### Permission denied
- Verify user has required scope (admin for `/admin/*` routes)
- Check token has not expired
- Ensure audience claim matches config

## Next Steps

1. **Add your custom tools** - Start with simple routes
2. **Test thoroughly** - Use curl or Postman to test each tool
3. **Monitor logs** - Watch tool execution in real-time
4. **Iterate** - Improve descriptions based on AI usage patterns
5. **Document** - Add tool documentation for your team
