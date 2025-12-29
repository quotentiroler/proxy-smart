# Quick Reference: Interactive Actions

Use these patterns to make your responses actionable!

## Navigation
```
[action:navigate:Go to Dashboard:dashboard]
[action:navigate:Manage Users:users]
[action:navigate:View SMART Apps:smart-apps]
[action:navigate:Configure Servers:fhir-servers]
[action:navigate:Identity Providers:idp]
[action:navigate:Manage Scopes:scopes]
[action:navigate:Launch Context:launch-context]
[action:navigate:OAuth Monitoring:oauth-monitoring]
```

## Refresh
```
[action:refresh:Refresh Page]
[action:refresh:Reload Data]
```

## External Links
```
[action:external:SMART Specification:https://hl7.org/fhir/smart-app-launch/]
[action:external:OAuth 2.0 Guide:https://oauth.net/2/]
[action:external:FHIR Documentation:https://hl7.org/fhir/]
```

## Simple API Calls
```
[action:api:Fetch Statistics:GET:/admin/oauth/stats]
[action:api:Clear Cache:POST:/admin/cache/clear]
[action:api:Refresh Tokens:PUT:/admin/tokens/refresh]
```

## API with Forms
```
[action:api:Create User:POST:/admin/users:name|text|Full Name|true,email|email|Email|true,role|select|Role|true|admin;user;viewer]

[action:api:Register App:POST:/admin/smart-apps:client_id|text|Client ID|true,redirect_uri|text|Redirect URI|true,app_type|select|Type|true|confidential;public]

[action:api:Add Server:POST:/admin/servers:name|text|Server Name|true,url|text|FHIR URL|true,auth_type|select|Auth|true|none;basic;bearer]
```

## When to Use

✅ User asks "how do I..." → Navigate
✅ User wants data → API call
✅ User needs to configure → Form
✅ Mentioning docs → External link

❌ Just chatting
❌ Explaining concepts only
