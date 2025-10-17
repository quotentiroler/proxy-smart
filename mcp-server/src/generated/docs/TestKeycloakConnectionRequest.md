# TestKeycloakConnectionRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base_url** | **str** | Keycloak base URL | 
**realm** | **str** | Keycloak realm name | 

## Example

```python
from api_client.models.test_keycloak_connection_request import TestKeycloakConnectionRequest

# TODO update the JSON string below
json = "{}"
# create an instance of TestKeycloakConnectionRequest from a JSON string
test_keycloak_connection_request_instance = TestKeycloakConnectionRequest.from_json(json)
# print the JSON string representation of the object
print(TestKeycloakConnectionRequest.to_json())

# convert the object into a dict
test_keycloak_connection_request_dict = test_keycloak_connection_request_instance.to_dict()
# create an instance of TestKeycloakConnectionRequest from a dict
test_keycloak_connection_request_from_dict = TestKeycloakConnectionRequest.from_dict(test_keycloak_connection_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


