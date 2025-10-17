# GetAdminSmartApps200ResponseInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Client ID | [optional] 
**client_id** | **str** | Client identifier | [optional] 
**name** | **str** | Application name | [optional] 
**description** | **str** | Application description | [optional] 
**enabled** | **bool** | Whether app is enabled | [optional] 
**protocol** | **str** | OAuth protocol | [optional] 
**public_client** | **bool** | Whether app is public client | [optional] 
**redirect_uris** | **List[str]** |  | [optional] 
**web_origins** | **List[str]** |  | [optional] 
**attributes** | **object** |  | [optional] 
**client_authenticator_type** | **str** | Client authentication method (client-jwt, client-secret, none) | [optional] 
**service_accounts_enabled** | **bool** | Whether service accounts (client_credentials) are enabled | [optional] 
**standard_flow_enabled** | **bool** | Whether authorization code flow is enabled | [optional] 
**implicit_flow_enabled** | **bool** | Whether implicit flow is enabled | [optional] 
**direct_access_grants_enabled** | **bool** | Whether password grants are enabled | [optional] 
**default_client_scopes** | **List[str]** | Default OAuth scopes | [optional] 
**optional_client_scopes** | **List[str]** | Optional OAuth scopes | [optional] 
**app_type** | **str** |  | [optional] 
**access** | **object** | Access permissions | [optional] 

## Example

```python
from api_client.models.get_admin_smart_apps200_response_inner import GetAdminSmartApps200ResponseInner

# TODO update the JSON string below
json = "{}"
# create an instance of GetAdminSmartApps200ResponseInner from a JSON string
get_admin_smart_apps200_response_inner_instance = GetAdminSmartApps200ResponseInner.from_json(json)
# print the JSON string representation of the object
print(GetAdminSmartApps200ResponseInner.to_json())

# convert the object into a dict
get_admin_smart_apps200_response_inner_dict = get_admin_smart_apps200_response_inner_instance.to_dict()
# create an instance of GetAdminSmartApps200ResponseInner from a dict
get_admin_smart_apps200_response_inner_from_dict = GetAdminSmartApps200ResponseInner.from_dict(get_admin_smart_apps200_response_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


