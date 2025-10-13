# PostAdminKeycloakConfigTestRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base_url** | **str** | Keycloak base URL (e.g., http://localhost:8080) | 
**realm** | **str** | Keycloak realm name | 

## Example

```python
from api_client.models.post_admin_keycloak_config_test_request import PostAdminKeycloakConfigTestRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostAdminKeycloakConfigTestRequest from a JSON string
post_admin_keycloak_config_test_request_instance = PostAdminKeycloakConfigTestRequest.from_json(json)
# print the JSON string representation of the object
print(PostAdminKeycloakConfigTestRequest.to_json())

# convert the object into a dict
post_admin_keycloak_config_test_request_dict = post_admin_keycloak_config_test_request_instance.to_dict()
# create an instance of PostAdminKeycloakConfigTestRequest from a dict
post_admin_keycloak_config_test_request_from_dict = PostAdminKeycloakConfigTestRequest.from_dict(post_admin_keycloak_config_test_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


