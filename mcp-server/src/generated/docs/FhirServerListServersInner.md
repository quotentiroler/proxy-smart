# FhirServerListServersInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Server ID | 
**name** | **str** | Server identifier/name | 
**url** | **str** | Base URL of the FHIR server | 
**fhir_version** | **str** | FHIR version (e.g., R4, R5) | 
**supported** | **bool** | Whether the server is supported by this proxy | 
**endpoints** | [**FhirServerListServersInnerEndpoints**](FhirServerListServersInnerEndpoints.md) |  | 
**server_version** | **str** | FHIR server software version | [optional] 
**server_name** | **str** | FHIR server software name | [optional] 
**error** | **str** | Error message if server is not reachable | [optional] 

## Example

```python
from api_client.models.fhir_server_list_servers_inner import FhirServerListServersInner

# TODO update the JSON string below
json = "{}"
# create an instance of FhirServerListServersInner from a JSON string
fhir_server_list_servers_inner_instance = FhirServerListServersInner.from_json(json)
# print the JSON string representation of the object
print(FhirServerListServersInner.to_json())

# convert the object into a dict
fhir_server_list_servers_inner_dict = fhir_server_list_servers_inner_instance.to_dict()
# create an instance of FhirServerListServersInner from a dict
fhir_server_list_servers_inner_from_dict = FhirServerListServersInner.from_dict(fhir_server_list_servers_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


