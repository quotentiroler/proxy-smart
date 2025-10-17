# SystemStatusResponseFhir


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** | FHIR infrastructure status | 
**total_servers** | **float** | Total FHIR servers configured | 
**healthy_servers** | **float** | Number of healthy FHIR servers | 
**servers** | [**List[FhirServerHealthInfo]**](FhirServerHealthInfo.md) | FHIR server status details | 

## Example

```python
from api_client.models.system_status_response_fhir import SystemStatusResponseFhir

# TODO update the JSON string below
json = "{}"
# create an instance of SystemStatusResponseFhir from a JSON string
system_status_response_fhir_instance = SystemStatusResponseFhir.from_json(json)
# print the JSON string representation of the object
print(SystemStatusResponseFhir.to_json())

# convert the object into a dict
system_status_response_fhir_dict = system_status_response_fhir_instance.to_dict()
# create an instance of SystemStatusResponseFhir from a dict
system_status_response_fhir_from_dict = SystemStatusResponseFhir.from_dict(system_status_response_fhir_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


