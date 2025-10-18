# UpdateSmartAppRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | Application name | [optional] 
**description** | **str** | Application description | [optional] 
**enabled** | **bool** | Whether the app is enabled | [optional] 
**public_client** | **bool** | Whether this is a public client | [optional] 
**redirect_uris** | **List[str]** | Allowed redirect URIs | [optional] 
**web_origins** | **List[str]** | Allowed web origins | [optional] 
**default_client_scopes** | **List[str]** | Default SMART scopes | [optional] 
**optional_client_scopes** | **List[str]** | Optional SMART scopes | [optional] 
**smart_version** | **str** | SMART App Launch version | [optional] 
**fhir_version** | **str** | FHIR version | [optional] 
**app_type** | **str** |  | [optional] 
**client_type** | **str** |  | [optional] 
**secret** | **str** | Client secret for symmetric authentication (only for confidential clients) | [optional] 
**public_key** | **str** | Public key for JWT authentication (PEM format) | [optional] 
**jwks_uri** | **str** | JWKS URI for JWT authentication | [optional] 
**system_scopes** | **List[str]** | System-level scopes for backend services | [optional] 
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
from api_client.models.update_smart_app_request import UpdateSmartAppRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateSmartAppRequest from a JSON string
update_smart_app_request_instance = UpdateSmartAppRequest.from_json(json)
# print the JSON string representation of the object
print(UpdateSmartAppRequest.to_json())

# convert the object into a dict
update_smart_app_request_dict = update_smart_app_request_instance.to_dict()
# create an instance of UpdateSmartAppRequest from a dict
update_smart_app_request_from_dict = UpdateSmartAppRequest.from_dict(update_smart_app_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


