# SystemStatusResponseMemory


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**used** | **float** | Memory used in bytes | 
**total** | **float** | Total memory in bytes | 

## Example

```python
from api_client.models.system_status_response_memory import SystemStatusResponseMemory

# TODO update the JSON string below
json = "{}"
# create an instance of SystemStatusResponseMemory from a JSON string
system_status_response_memory_instance = SystemStatusResponseMemory.from_json(json)
# print the JSON string representation of the object
print(SystemStatusResponseMemory.to_json())

# convert the object into a dict
system_status_response_memory_dict = system_status_response_memory_instance.to_dict()
# create an instance of SystemStatusResponseMemory from a dict
system_status_response_memory_from_dict = SystemStatusResponseMemory.from_dict(system_status_response_memory_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


