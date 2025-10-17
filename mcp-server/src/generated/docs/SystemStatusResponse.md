# SystemStatusResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**version** | **str** | API version | 
**timestamp** | **str** | Timestamp (ISO 8601) | 
**uptime** | **float** | Server uptime in milliseconds | 
**overall** | **str** | Overall system status | 
**fhir** | [**SystemStatusResponseFhir**](SystemStatusResponseFhir.md) |  | 
**keycloak** | [**SystemStatusResponseKeycloak**](SystemStatusResponseKeycloak.md) |  | 
**memory** | [**SystemStatusResponseMemory**](SystemStatusResponseMemory.md) |  | 

## Example

```python
from api_client.models.system_status_response import SystemStatusResponse

# TODO update the JSON string below
json = "{}"
# create an instance of SystemStatusResponse from a JSON string
system_status_response_instance = SystemStatusResponse.from_json(json)
# print the JSON string representation of the object
print(SystemStatusResponse.to_json())

# convert the object into a dict
system_status_response_dict = system_status_response_instance.to_dict()
# create an instance of SystemStatusResponse from a dict
system_status_response_from_dict = SystemStatusResponse.from_dict(system_status_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


