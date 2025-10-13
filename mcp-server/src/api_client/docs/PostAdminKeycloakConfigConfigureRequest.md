# PostAdminKeycloakConfigConfigureRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base_url** | **str** | Keycloak base URL (e.g., http://localhost:8080) | 
**realm** | **str** | Keycloak realm name | 
**admin_client_id** | **str** | Admin client ID for dynamic registration (optional) | [optional] 
**admin_client_secret** | **str** | Admin client secret for dynamic registration (optional) | [optional] 

## Example

```python
from api_client.models.post_admin_keycloak_config_configure_request import PostAdminKeycloakConfigConfigureRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostAdminKeycloakConfigConfigureRequest from a JSON string
post_admin_keycloak_config_configure_request_instance = PostAdminKeycloakConfigConfigureRequest.from_json(json)
# print the JSON string representation of the object
print(PostAdminKeycloakConfigConfigureRequest.to_json())

# convert the object into a dict
post_admin_keycloak_config_configure_request_dict = post_admin_keycloak_config_configure_request_instance.to_dict()
# create an instance of PostAdminKeycloakConfigConfigureRequest from a dict
post_admin_keycloak_config_configure_request_from_dict = PostAdminKeycloakConfigConfigureRequest.from_dict(post_admin_keycloak_config_configure_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


