# PostAdminSmartAppsRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**client_id** | **str** | Unique client identifier | 
**name** | **str** | Application name | 
**description** | **str** | Application description | [optional] 
**public_client** | **bool** | Whether this is a public client (default: false) | [optional] 
**redirect_uris** | **List[str]** |  | [optional] 
**web_origins** | **List[str]** |  | [optional] 
**default_scopes** | **List[str]** |  | [optional] 
**optional_scopes** | **List[str]** |  | [optional] 
**smart_version** | **str** | SMART version (default: 2.0.0) | [optional] 
**fhir_version** | **str** | FHIR version (default: STU3) | [optional] 
**app_type** | **str** |  | [optional] 
**client_type** | **str** |  | [optional] 
**public_key** | **str** | PEM-formatted public key for JWT authentication (required for backend-service) | [optional] 
**jwks_uri** | **str** | JWKS URI for public key discovery (alternative to publicKey) | [optional] 
**system_scopes** | **List[str]** |  | [optional] 

## Example

```python
from api_client.models.post_admin_smart_apps_request import PostAdminSmartAppsRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostAdminSmartAppsRequest from a JSON string
post_admin_smart_apps_request_instance = PostAdminSmartAppsRequest.from_json(json)
# print the JSON string representation of the object
print(PostAdminSmartAppsRequest.to_json())

# convert the object into a dict
post_admin_smart_apps_request_dict = post_admin_smart_apps_request_instance.to_dict()
# create an instance of PostAdminSmartAppsRequest from a dict
post_admin_smart_apps_request_from_dict = PostAdminSmartAppsRequest.from_dict(post_admin_smart_apps_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


