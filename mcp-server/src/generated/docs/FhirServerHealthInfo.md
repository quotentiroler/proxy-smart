# FhirServerHealthInfo


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
from api_client.models.fhir_server_health_info import FhirServerHealthInfo

# TODO update the JSON string below
json = "{}"
# create an instance of FhirServerHealthInfo from a JSON string
fhir_server_health_info_instance = FhirServerHealthInfo.from_json(json)
# print the JSON string representation of the object
print(FhirServerHealthInfo.to_json())

# convert the object into a dict
fhir_server_health_info_dict = fhir_server_health_info_instance.to_dict()
# create an instance of FhirServerHealthInfo from a dict
fhir_server_health_info_from_dict = FhirServerHealthInfo.from_dict(fhir_server_health_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


