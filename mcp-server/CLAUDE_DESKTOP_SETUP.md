# Claude Desktop Integration Guide

## Quick Setup (5 minutes)

### 1. Test Your MCP Server

```powershell
cd mcp-server
uv run python test_claude_integration.py
```

Expected output:
```
🔍 Testing MCP Server Configuration...

✅ Found 6 tools:
  - list_healthcare_users: List all healthcare users with optional filtering
  - get_healthcare_user: Get details of a specific healthcare user by ID
  - create_healthcare_user: Create a new healthcare user
  - list_smart_apps: List all registered SMART applications
  - list_fhir_servers: List all configured FHIR servers
  - list_roles: List all available roles

✅ All tools registered correctly!
```

### 2. Configure Claude Desktop

**Location:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "smart-fhir-backend": {
      "command": "uv",
      "args": [
        "run",
        "python",
        "C:\\Users\\MaximilianNussbaumer\\Workspace\\smart-on-fhir-proxy\\mcp-server\\src\\backend_mcp_server.py"
      ],
      "env": {
        "BACKEND_API_URL": "http://localhost:8445",
        "KEYCLOAK_URL": "http://localhost:8080"
      }
    }
  }
}
```

**⚠️ Important:** Replace the path with your actual workspace location!

### 3. Start Your Backend

```powershell
# Terminal 1: Backend server
cd backend
npm run dev

# Terminal 2 (optional): Check logs
```

### 4. Restart Claude Desktop

Close and reopen Claude Desktop completely.

### 5. Test Integration

Ask Claude:

```
Can you list all healthcare users?
```

```
Show me the SMART apps configured in the system
```

```
What FHIR servers do we have?
```

## Troubleshooting

### "Command not found: uv"

Install uv:
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### "Connection refused to localhost:8445"

Make sure backend is running:
```powershell
cd backend
npm run dev
```

### "MCP server not appearing in Claude"

1. Check Claude Desktop logs: `%APPDATA%\Claude\logs\`
2. Verify path in config matches your workspace
3. Ensure `uv` is in your PATH
4. Restart Claude Desktop completely

### "401 Unauthorized" errors

This is expected without authentication. For now, Claude can still:
- List tools
- Show available operations
- Understand your system structure

To fix, implement service account auth (see main README).

## What You Can Do

### ✅ Currently Working:
- Claude can see all 6 backend tools
- Tool descriptions and parameters
- Understand your SMART on FHIR architecture

### ⚠️ Needs Auth (Future):
- Actually list users/apps/servers
- Create new resources
- Modify existing data

## Architecture

```
Claude Desktop
    ↓ (stdio)
Backend MCP Server (Python/FastMCP)
    ↓ (HTTP)
Backend API (Elysia, port 8445)
    ↓
PostgreSQL + Keycloak
```

## Benefits

1. **Natural Language Interface**: Ask questions in plain English
2. **Tool Discovery**: Claude knows what operations are available
3. **Context Aware**: Claude understands your SMART on FHIR system
4. **Standard Protocol**: Uses official MCP SDK
5. **Extensible**: Easy to add more tools

## Next Steps

1. **Test basic integration** (this guide)
2. **Implement service account auth** (see MCP_MIGRATION_STATUS.md)
3. **Add more tools** (patients, observations, etc.)
4. **Configure for production** (secure tokens, rate limiting)

---

**Last Updated:** 2025-01-20  
**Status:** ✅ Ready to test (auth pending)
