# AuthConfigResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**keycloak** | [**AuthConfigKeycloakResponse**](AuthConfigKeycloakResponse.md) |  | 

## Example

```python
from api_client.models.auth_config_response import AuthConfigResponse

# TODO update the JSON string below
json = "{}"
# create an instance of AuthConfigResponse from a JSON string
auth_config_response_instance = AuthConfigResponse.from_json(json)
# print the JSON string representation of the object
print(AuthConfigResponse.to_json())

# convert the object into a dict
auth_config_response_dict = auth_config_response_instance.to_dict()
# create an instance of AuthConfigResponse from a dict
auth_config_response_from_dict = AuthConfigResponse.from_dict(auth_config_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


