# SmartApp


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Internal ID | [optional] 
**client_id** | **str** | OAuth2 client ID | [optional] 
**name** | **str** | Application name | [optional] 
**description** | **str** | Application description | [optional] 
**enabled** | **bool** | Whether the app is enabled | [optional] 
**protocol** | **str** | Protocol (openid-connect) | [optional] 
**public_client** | **bool** | Whether this is a public client | [optional] 
**redirect_uris** | **List[str]** | Allowed redirect URIs | [optional] 
**web_origins** | **List[str]** | Allowed web origins (CORS) | [optional] 
**attributes** | **object** |  | [optional] 
**client_authenticator_type** | **str** | Client authentication method | [optional] 
**service_accounts_enabled** | **bool** | Enable service accounts | [optional] 
**standard_flow_enabled** | **bool** | Enable authorization code flow | [optional] 
**implicit_flow_enabled** | **bool** | Enable implicit flow | [optional] 
**direct_access_grants_enabled** | **bool** | Enable direct access grants | [optional] 
**default_client_scopes** | **List[str]** | Default scopes | [optional] 
**optional_client_scopes** | **List[str]** | Optional scopes | [optional] 
**app_type** | **str** |  | [optional] 
**client_type** | **str** |  | [optional] 
**secret** | **str** | Client secret for symmetric authentication (only for confidential clients) | [optional] 
**access** | **object** | Keycloak admin console permissions (configure, manage, view) - informational only | [optional] 
**launch_url** | **str** | SMART App launch URL | [optional] 
**logo_uri** | **str** | Logo URI for application display | [optional] 
**tos_uri** | **str** | Terms of Service URI | [optional] 
**policy_uri** | **str** | Privacy Policy URI | [optional] 
**contacts** | **List[str]** | Contact emails or names | [optional] 
**server_access_type** | **str** |  | [optional] 
**allowed_server_ids** | **List[str]** | List of allowed FHIR server IDs | [optional] 
**scope_set_id** | **str** | Reference to a predefined scope set configuration | [optional] 
**require_pkce** | **bool** | Require PKCE for public clients | [optional] 
**allow_offline_access** | **bool** | Allow offline access (refresh tokens) | [optional] 

## Example

```python
from api_client.models.smart_app import SmartApp

# TODO update the JSON string below
json = "{}"
# create an instance of SmartApp from a JSON string
smart_app_instance = SmartApp.from_json(json)
# print the JSON string representation of the object
print(SmartApp.to_json())

# convert the object into a dict
smart_app_dict = smart_app_instance.to_dict()
# create an instance of SmartApp from a dict
smart_app_from_dict = SmartApp.from_dict(smart_app_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


