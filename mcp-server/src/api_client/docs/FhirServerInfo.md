# FhirServerInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | FHIR server name | 
**url** | **str** | FHIR server URL | 
**status** | **str** | Server status (healthy, unhealthy) | 
**accessible** | **bool** | Whether server is accessible | 
**version** | **str** | FHIR version | 
**server_name** | **str** | Server-reported name | [optional] 
**server_version** | **str** | Server-reported version | [optional] 
**error** | **str** | Error details if unhealthy | [optional] 

## Example

```python
from api_client.models.fhir_server_info import FhirServerInfo

# TODO update the JSON string below
json = "{}"
# create an instance of FhirServerInfo from a JSON string
fhir_server_info_instance = FhirServerInfo.from_json(json)
# print the JSON string representation of the object
print(FhirServerInfo.to_json())

# convert the object into a dict
fhir_server_info_dict = fhir_server_info_instance.to_dict()
# create an instance of FhirServerInfo from a dict
fhir_server_info_from_dict = FhirServerInfo.from_dict(fhir_server_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


