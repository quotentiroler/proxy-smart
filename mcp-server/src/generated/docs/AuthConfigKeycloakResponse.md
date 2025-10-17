# AuthConfigKeycloakResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**is_configured** | **bool** |  | 
**base_url** | **str** |  | 
**realm** | **str** |  | 
**authorization_endpoint** | **str** |  | 
**token_endpoint** | **str** |  | 

## Example

```python
from api_client.models.auth_config_keycloak_response import AuthConfigKeycloakResponse

# TODO update the JSON string below
json = "{}"
# create an instance of AuthConfigKeycloakResponse from a JSON string
auth_config_keycloak_response_instance = AuthConfigKeycloakResponse.from_json(json)
# print the JSON string representation of the object
print(AuthConfigKeycloakResponse.to_json())

# convert the object into a dict
auth_config_keycloak_response_dict = auth_config_keycloak_response_instance.to_dict()
# create an instance of AuthConfigKeycloakResponse from a dict
auth_config_keycloak_response_from_dict = AuthConfigKeycloakResponse.from_dict(auth_config_keycloak_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


