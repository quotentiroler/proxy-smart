# PostAdminKeycloakConfigTest200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the test was successful | 
**message** | **str** | Success message | [optional] 
**error** | **str** | Error message if test failed | [optional] 

## Example

```python
from api_client.models.post_admin_keycloak_config_test200_response import PostAdminKeycloakConfigTest200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostAdminKeycloakConfigTest200Response from a JSON string
post_admin_keycloak_config_test200_response_instance = PostAdminKeycloakConfigTest200Response.from_json(json)
# print the JSON string representation of the object
print(PostAdminKeycloakConfigTest200Response.to_json())

# convert the object into a dict
post_admin_keycloak_config_test200_response_dict = post_admin_keycloak_config_test200_response_instance.to_dict()
# create an instance of PostAdminKeycloakConfigTest200Response from a dict
post_admin_keycloak_config_test200_response_from_dict = PostAdminKeycloakConfigTest200Response.from_dict(post_admin_keycloak_config_test200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


