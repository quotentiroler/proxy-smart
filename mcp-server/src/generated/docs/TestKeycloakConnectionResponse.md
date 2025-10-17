# TestKeycloakConnectionResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the connection test succeeded | 
**message** | **str** | Success message | [optional] 
**error** | **str** | Error message if connection failed | [optional] 

## Example

```python
from api_client.models.test_keycloak_connection_response import TestKeycloakConnectionResponse

# TODO update the JSON string below
json = "{}"
# create an instance of TestKeycloakConnectionResponse from a JSON string
test_keycloak_connection_response_instance = TestKeycloakConnectionResponse.from_json(json)
# print the JSON string representation of the object
print(TestKeycloakConnectionResponse.to_json())

# convert the object into a dict
test_keycloak_connection_response_dict = test_keycloak_connection_response_instance.to_dict()
# create an instance of TestKeycloakConnectionResponse from a dict
test_keycloak_connection_response_from_dict = TestKeycloakConnectionResponse.from_dict(test_keycloak_connection_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


