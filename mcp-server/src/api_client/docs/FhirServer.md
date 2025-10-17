# FhirServer


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Server ID | 
**name** | **str** | Server identifier/name | 
**url** | **str** | Base URL of the FHIR server | 
**fhir_version** | **str** | FHIR version (e.g., R4, R5) | 
**server_version** | **str** | FHIR server software version | [optional] 
**server_name** | **str** | FHIR server software name | [optional] 
**supported** | **bool** | Whether the server is supported by this proxy | 
**endpoints** | [**FhirServerListServersInnerEndpoints**](FhirServerListServersInnerEndpoints.md) |  | 

## Example

```python
from api_client.models.fhir_server import FhirServer

# TODO update the JSON string below
json = "{}"
# create an instance of FhirServer from a JSON string
fhir_server_instance = FhirServer.from_json(json)
# print the JSON string representation of the object
print(FhirServer.to_json())

# convert the object into a dict
fhir_server_dict = fhir_server_instance.to_dict()
# create an instance of FhirServer from a dict
fhir_server_from_dict = FhirServer.from_dict(fhir_server_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


