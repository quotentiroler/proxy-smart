# FhirServerList


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total_servers** | **float** | Total number of configured servers | 
**servers** | [**List[FhirServerListServersInner]**](FhirServerListServersInner.md) |  | 

## Example

```python
from api_client.models.fhir_server_list import FhirServerList

# TODO update the JSON string below
json = "{}"
# create an instance of FhirServerList from a JSON string
fhir_server_list_instance = FhirServerList.from_json(json)
# print the JSON string representation of the object
print(FhirServerList.to_json())

# convert the object into a dict
fhir_server_list_dict = fhir_server_list_instance.to_dict()
# create an instance of FhirServerList from a dict
fhir_server_list_from_dict = FhirServerList.from_dict(fhir_server_list_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


