# FhirServerInfo1


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | Server identifier/name | 
**url** | **str** | Base URL of the FHIR server | 
**fhir_version** | **str** | FHIR version (e.g., R4, R5) | 
**server_version** | **str** | FHIR server software version | [optional] 
**server_name** | **str** | FHIR server software name | [optional] 
**supported** | **bool** | Whether the server is supported by this proxy | 
**endpoints** | [**FhirServerListServersInnerEndpoints**](FhirServerListServersInnerEndpoints.md) |  | 

## Example

```python
from api_client.models.fhir_server_info1 import FhirServerInfo1

# TODO update the JSON string below
json = "{}"
# create an instance of FhirServerInfo1 from a JSON string
fhir_server_info1_instance = FhirServerInfo1.from_json(json)
# print the JSON string representation of the object
print(FhirServerInfo1.to_json())

# convert the object into a dict
fhir_server_info1_dict = fhir_server_info1_instance.to_dict()
# create an instance of FhirServerInfo1 from a dict
fhir_server_info1_from_dict = FhirServerInfo1.from_dict(fhir_server_info1_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


