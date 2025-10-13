# PostAdminKeycloakConfigConfigure200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the configuration was saved | 
**message** | **str** | Success message | [optional] 
**error** | **str** | Error message if configuration failed | [optional] 
**restart_required** | **bool** | Whether a server restart is required | [optional] 

## Example

```python
from api_client.models.post_admin_keycloak_config_configure200_response import PostAdminKeycloakConfigConfigure200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostAdminKeycloakConfigConfigure200Response from a JSON string
post_admin_keycloak_config_configure200_response_instance = PostAdminKeycloakConfigConfigure200Response.from_json(json)
# print the JSON string representation of the object
print(PostAdminKeycloakConfigConfigure200Response.to_json())

# convert the object into a dict
post_admin_keycloak_config_configure200_response_dict = post_admin_keycloak_config_configure200_response_instance.to_dict()
# create an instance of PostAdminKeycloakConfigConfigure200Response from a dict
post_admin_keycloak_config_configure200_response_from_dict = PostAdminKeycloakConfigConfigure200Response.from_dict(post_admin_keycloak_config_configure200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


