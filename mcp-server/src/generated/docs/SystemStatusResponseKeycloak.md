# SystemStatusResponseKeycloak


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** | Keycloak status | 
**accessible** | **bool** | Whether Keycloak is accessible | 
**realm** | **str** | Keycloak realm | 
**last_connected** | **str** | Last successful connection timestamp | [optional] 

## Example

```python
from api_client.models.system_status_response_keycloak import SystemStatusResponseKeycloak

# TODO update the JSON string below
json = "{}"
# create an instance of SystemStatusResponseKeycloak from a JSON string
system_status_response_keycloak_instance = SystemStatusResponseKeycloak.from_json(json)
# print the JSON string representation of the object
print(SystemStatusResponseKeycloak.to_json())

# convert the object into a dict
system_status_response_keycloak_dict = system_status_response_keycloak_instance.to_dict()
# create an instance of SystemStatusResponseKeycloak from a dict
system_status_response_keycloak_from_dict = SystemStatusResponseKeycloak.from_dict(system_status_response_keycloak_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


