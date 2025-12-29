# Interactive Actions for AI Assistant

The AI assistant can provide interactive buttons, links, and forms directly in chat responses. Users can click these elements to perform actions without typing additional commands.

## Action Syntax

Actions are embedded in markdown responses using special syntax: `[action:TYPE:PARAMS]`

## Available Action Types

### 1. Navigation Actions

Navigate users to different tabs in the application.

**Syntax:**
```
[action:navigate:BUTTON_LABEL:TARGET_TAB]
```

**Example:**
```
You can view all registered SMART apps here: [action:navigate:Go to SMART Apps:smart-apps]
```

**Valid Tabs:**
- `dashboard` - Main dashboard
- `smart-apps` - SMART Apps Manager
- `users` - Healthcare Users Manager
- `fhir-servers` - FHIR Servers Configuration
- `idp` - Identity Providers
- `scopes` - Scopes Manager
- `launch-context` - Launch Context Configuration
- `oauth-monitoring` - OAuth Monitoring Dashboard

**More Examples:**
```
To manage users, [action:navigate:click here:users]

Check the OAuth monitoring dashboard: [action:navigate:View Monitoring:oauth-monitoring]
```

---

### 2. Refresh Actions

Trigger a page refresh to reload data.

**Syntax:**
```
[action:refresh:BUTTON_LABEL]
```

**Examples:**
```
After making changes, [action:refresh:Refresh Page] to see the updates.

Click here to reload: [action:refresh:Reload Data]
```

---

### 3. External Links

Open external documentation or resources in a new tab.

**Syntax:**
```
[action:external:BUTTON_LABEL:URL]
```

**Examples:**
```
For more details, see the [action:external:SMART App Launch Specification:https://hl7.org/fhir/smart-app-launch/] documentation.

Learn about OAuth 2.0: [action:external:Read OAuth Guide:https://oauth.net/2/]
```

---

### 4. API Call Actions (Simple)

Execute API calls with user's authentication. For simple GET requests without parameters.

**Syntax:**
```
[action:api:BUTTON_LABEL:METHOD:ENDPOINT]
```

**Examples:**
```
To fetch current stats: [action:api:Get Statistics:GET:/admin/oauth/stats]

Refresh the token cache: [action:api:Clear Cache:POST:/admin/cache/clear]
```

---

### 5. API Call Actions (With Form)

Execute API calls that require user input. Shows a form before making the request.

**Syntax:**
```
[action:api:BUTTON_LABEL:METHOD:ENDPOINT:FIELD_DEFINITIONS]
```

**Field Definition Format:**
```
field_name|field_type|field_label|required|options
```

**Field Types:**
- `text` - Text input
- `email` - Email input
- `number` - Number input
- `select` - Dropdown (requires options)

**Options Format (for select):**
```
option1;option2;option3
```

**Examples:**

Simple form with text fields:
```
[action:api:Create User:POST:/admin/users:name|text|Full Name|true,email|email|Email Address|true,role|select|Role|true|admin;user;viewer]
```

Complex form:
```
[action:api:Register SMART App:POST:/admin/smart-apps:client_id|text|Client ID|true,redirect_uri|text|Redirect URI|true,app_type|select|App Type|true|confidential;public]
```

---

### 6. Form Actions (Standalone)

Display a form to collect user input without immediately calling an API. Useful for multi-step processes or validation.

**Syntax:**
```
[action:form:BUTTON_LABEL:FIELD_DEFINITIONS]
```

**Examples:**
```
Fill out this information: [action:form:Enter Details:username|text|Username|true,server_url|text|FHIR Server URL|true]
```

---

## Best Practices

### When to Use Actions

✅ **Do use actions when:**
- User asks "how do I..." → Provide action to navigate there
- User asks for data → Provide action to fetch it
- User needs to configure something → Provide form action
- Referring to external docs → Provide external link

❌ **Don't use actions when:**
- Just having a conversation
- Explaining concepts without concrete next steps
- User hasn't asked for specific help

### Action Placement

**Good:**
```
To register a new SMART app:

1. Fill out the application details
2. Configure the redirect URIs
3. Set the appropriate scopes

Ready to start? [action:navigate:Open SMART Apps Manager:smart-apps]
```

**Also Good:**
```
I can help you create a user. [action:api:Create User:POST:/admin/users:name|text|Name|true,email|email|Email|true]

Or you can manage users manually here: [action:navigate:Go to Users:users]
```

### Multiple Actions

You can provide multiple action options:

```
You have several options:

- [action:navigate:View Dashboard:dashboard] to see an overview
- [action:navigate:Manage Users:users] to configure permissions  
- [action:external:Read Documentation:https://docs.example.com] for detailed guides
```

### Contextual Actions

Tailor actions to the user's question:

**User asks:** "How do I see OAuth metrics?"
**Response:**
```
OAuth metrics show token usage, grant types, and authorization flows.

[action:navigate:View OAuth Monitoring:oauth-monitoring]
```

**User asks:** "Can you create a test user?"
**Response:**
```
I can help you create a user. Please provide the details:

[action:api:Create User:POST:/admin/users:name|text|Full Name|true,email|email|Email|true,role|select|Role|true|admin;user]
```

---

## Form Field Examples

### Text Input
```
username|text|Username|true
```

### Email with Validation
```
email|email|Email Address|true
```

### Optional Number
```
port|number|Port Number|false
```

### Required Select/Dropdown
```
role|select|User Role|true|admin;editor;viewer
```

### Complex Multi-Field Form
```
[action:api:Create Server:POST:/admin/servers:name|text|Server Name|true,url|text|FHIR Base URL|true,auth|select|Auth Type|true|none;basic;bearer,timeout|number|Timeout (ms)|false]
```

---

## Security Considerations

- All API calls use the user's current authentication token
- Users can see what data will be sent before submitting forms
- External links always open in new tabs with `noopener,noreferrer`
- Form validation happens before API calls
- Required fields are clearly marked with asterisks

---

## Testing Actions

To test if actions render correctly, use these examples in chat:

```
Navigate: [action:navigate:Test Navigation:dashboard]
Refresh: [action:refresh:Test Refresh]
External: [action:external:Test Link:https://google.com]
Simple API: [action:api:Test API:GET:/admin/stats]
API with Form: [action:api:Test Form:POST:/admin/test:field1|text|Test Field|true]
```
