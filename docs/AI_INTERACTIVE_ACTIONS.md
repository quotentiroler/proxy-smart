# AI Assistant Interactive Actions

## Overview

The AI assistant supports **interactive elements** in chat responses, allowing users to perform actions directly from the chat interface without typing additional commands. This creates a more intuitive and productive user experience.

## Features

### 🎯 Navigation Buttons
Click to instantly navigate to different sections of the application.

### 🔄 Action Buttons
Trigger page refreshes or API calls with a single click.

### 📝 Interactive Forms
Fill out forms within the chat to create or update resources.

### 🔗 External Links
Access relevant documentation and resources that open in new tabs.

---

## User Guide

### How to Use Interactive Actions

When you ask the AI assistant for help, it may provide interactive buttons in its responses. Simply click these buttons to perform actions.

**Example Interaction:**

**You:** "How do I add a new user?"

**AI:**
```
I can help you create a new user. Please provide the details:

[Create User Button with Form]
  • Full Name (required)
  • Email Address (required)  
  • User Role (dropdown: admin/user)

Or manage users manually: [Go to User Management]
```

### Types of Actions You'll See

#### 1. **Navigation Buttons**
- Blue buttons with a chevron icon (→)
- Click to jump to specific sections like "SMART Apps" or "User Management"
- Browser back button works to return

#### 2. **Refresh Buttons**  
- Gray outlined buttons with refresh icon
- Click to reload the current page with fresh data
- Useful after making changes

#### 3. **External Link Buttons**
- Gray outlined buttons with external link icon
- Opens documentation or resources in a new tab
- Always safe - uses `noopener` and `noreferrer`

#### 4. **API Action Buttons**
- Primary colored buttons with send icon
- May show a form first if input is required
- Shows success/error feedback after execution

#### 5. **Form Buttons**
- Opens an inline form in the chat
- Required fields marked with red asterisk (*)
- Validates input before submission
- Shows loading state while processing

### Example Queries That Trigger Actions

Try asking the AI:

- **"How do I register a SMART app?"** → Get navigation button to SMART Apps manager + form to create one
- **"Show me OAuth metrics"** → Get navigation button to OAuth monitoring dashboard
- **"Can you create a test user?"** → Get form to create user with name, email, role fields
- **"Where can I configure FHIR servers?"** → Get navigation button to FHIR servers section
- **"Refresh the data"** → Get refresh button
- **"Show me the SMART App Launch specification"** → Get external link button

---

## Developer Guide

### Architecture

```
┌─────────────────┐
│   User Types    │
│   Question      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Assistant   │
│  (MCP Server)   │  ← Enhanced with action syntax knowledge
└────────┬────────┘
         │
         ▼ Markdown with [action:...] syntax
┌─────────────────┐
│ActionMarkdown   │
│   Renderer      │  ← Parses actions, renders buttons
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ActionButton    │
│  Component      │  ← Executes actions (navigate, API, form)
└─────────────────┘
```

### Action Syntax Reference

All actions use the format: `[action:TYPE:PARAMETERS]`

#### Navigate
```
[action:navigate:Button Label:target-tab]
```
Valid tabs: `dashboard`, `smart-apps`, `users`, `fhir-servers`, `idp`, `scopes`, `launch-context`, `oauth-monitoring`

#### Refresh
```
[action:refresh:Button Label]
```

#### External Link
```
[action:external:Button Label:https://example.com]
```

#### Simple API Call
```
[action:api:Button Label:METHOD:/endpoint]
```
Methods: `GET`, `POST`, `PUT`, `DELETE`

#### API Call with Form
```
[action:api:Button Label:METHOD:/endpoint:field1|type|label|required,field2|type|label|required]
```

Field format: `name|type|label|required|options`
- Types: `text`, `email`, `number`, `select`
- Required: `true` or `false`
- Options (for select): semicolon-separated, e.g., `admin;user;viewer`

#### Standalone Form
```
[action:form:Button Label:field1|type|label|required,field2|type|label|required]
```

### Implementation Details

#### Files

**Frontend:**
- `ui/src/components/ai/ActionButton.tsx` - Button component that handles all action types
- `ui/src/components/ai/ActionMarkdownRenderer.tsx` - Custom markdown renderer that parses action syntax
- `ui/src/components/AIChatOverlay.tsx` - Chat interface using ActionMarkdownRenderer

**Backend:**
- `mcp-server/src/services/ai_assistant.py` - System prompt includes action syntax instructions
- `backend/src/ai/interactive-actions.md` - Comprehensive action syntax documentation

#### How Actions Are Parsed

1. **AI generates response** with action syntax embedded in markdown
2. **ActionMarkdownRenderer** extracts actions using regex: `/\[action:(type):([^\]]+)\]/g`
3. **Parameters are parsed** based on action type
4. **Actions are replaced** with placeholders in markdown: `{{ACTION_id}}`
5. **ReactMarkdown renders** the processed content
6. **Custom text component** replaces placeholders with `<ActionButton>` components
7. **User clicks button** → ActionButton executes the action

#### Action Execution Flow

```typescript
// 1. User clicks button
// 2. ActionButton determines action type

switch (action.type) {
  case 'navigate':
    // Update hash and app state
    setActiveTab(action.tab);
    window.location.hash = action.tab;
    break;
    
  case 'refresh':
    window.location.reload();
    break;
    
  case 'external-link':
    window.open(action.target, '_blank', 'noopener,noreferrer');
    break;
    
  case 'api-call':
    // Show form if fields defined, otherwise call directly
    if (action.fields) {
      setShowForm(true);
    } else {
      await fetch(action.endpoint, { method: action.method });
    }
    break;
}
```

### Adding New Action Types

To add a new action type:

1. **Update TypeScript types** in `ActionButton.tsx`:
```typescript
export type ActionType = 'navigate' | 'refresh' | 'api-call' | 'form' | 'external-link' | 'your-new-type';
```

2. **Add parsing logic** in `ActionMarkdownRenderer.tsx`:
```typescript
case 'your-new-type':
  // Parse parameters
  action = {
    type: 'your-new-type',
    label: parts[0],
    // ... other properties
  };
  break;
```

3. **Add rendering logic** in `ActionButton.tsx`:
```typescript
case 'your-new-type':
  return (
    <Button onClick={handleYourNewAction}>
      {action.label}
    </Button>
  );
```

4. **Update system prompt** in `ai_assistant.py` to teach AI about the new action type

5. **Update documentation** in `interactive-actions.md`

### Testing

Test actions by sending these messages to the AI:

```
Test navigation: [action:navigate:Test:dashboard]
Test refresh: [action:refresh:Test Refresh]
Test external: [action:external:Test Link:https://google.com]
Test API: [action:api:Test API:GET:/admin/stats]
Test form: [action:api:Test Form:POST:/admin/test:name|text|Name|true]
```

### Security Considerations

- ✅ All API calls use user's authenticated session
- ✅ Form data is validated before submission (required fields, email format, etc.)
- ✅ External links use `noopener,noreferrer` attributes
- ✅ API endpoints are relative URLs (respect CORS and auth)
- ✅ No eval() or dangerous code execution
- ✅ User sees all data before submission (forms are transparent)

### Performance

- Actions are parsed once using `useMemo` (not on every render)
- Form state is local (doesn't trigger parent re-renders)
- Buttons use appropriate loading states
- Network requests are debounced/throttled where appropriate

---

## Roadmap

### Planned Enhancements

- [ ] **Confirmation Dialogs**: Optional confirmation for destructive actions
- [ ] **Multi-step Wizards**: Chains of forms for complex workflows
- [ ] **File Upload Actions**: Support for file inputs in forms
- [ ] **Batch Actions**: Execute multiple API calls in sequence
- [ ] **Keyboard Shortcuts**: Quick action execution via hotkeys
- [ ] **Action History**: Track which actions user has executed
- [ ] **Tooltips**: Show API endpoint/method on hover
- [ ] **Dark Mode Styling**: Ensure actions look great in both themes

### Future Action Types

- **Download**: Trigger file downloads
- **Copy**: Copy text/JSON to clipboard
- **Share**: Generate shareable links with pre-filled data
- **Schedule**: Set up recurring actions (e.g., daily stats refresh)

---

## Troubleshooting

### Actions Not Appearing

**Problem**: AI response contains action syntax but no button appears

**Solution**:
1. Check browser console for parsing errors
2. Verify action syntax matches format exactly (no extra spaces)
3. Ensure `ActionMarkdownRenderer` is being used (not plain `ReactMarkdown`)

### API Calls Failing

**Problem**: Click button but API call returns 401/403

**Solution**:
1. Check that user is authenticated
2. Verify endpoint exists and accepts the HTTP method
3. Check network tab for request details
4. Ensure Content-Type header is set correctly

### Forms Not Submitting

**Problem**: Form appears but submit button does nothing

**Solution**:
1. Check for required fields that aren't filled
2. Look for validation errors in console
3. Verify field names match what API expects
4. Check that email fields contain valid email addresses

---

## Examples

See `backend/src/ai/interactive-actions.md` for comprehensive syntax examples and best practices.

## Contributing

When adding new actions:
1. Update types in `ActionButton.tsx`
2. Add parsing in `ActionMarkdownRenderer.tsx`
3. Update system prompt in `ai_assistant.py`
4. Add tests
5. Update this documentation

## License

Part of the SMART on FHIR Proxy project. See main LICENSE file.
