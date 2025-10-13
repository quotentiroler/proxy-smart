# GetAdminKeycloakConfigStatus200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base_url** | **str** |  | 
**realm** | **str** |  | 
**has_admin_client** | **bool** | Whether admin client credentials are configured | 
**admin_client_id** | **str** |  | 

## Example

```python
from api_client.models.get_admin_keycloak_config_status200_response import GetAdminKeycloakConfigStatus200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetAdminKeycloakConfigStatus200Response from a JSON string
get_admin_keycloak_config_status200_response_instance = GetAdminKeycloakConfigStatus200Response.from_json(json)
# print the JSON string representation of the object
print(GetAdminKeycloakConfigStatus200Response.to_json())

# convert the object into a dict
get_admin_keycloak_config_status200_response_dict = get_admin_keycloak_config_status200_response_instance.to_dict()
# create an instance of GetAdminKeycloakConfigStatus200Response from a dict
get_admin_keycloak_config_status200_response_from_dict = GetAdminKeycloakConfigStatus200Response.from_dict(get_admin_keycloak_config_status200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


