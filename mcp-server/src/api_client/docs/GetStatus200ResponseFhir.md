# GetStatus200ResponseFhir


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** |  | 
**total_servers** | **float** |  | 
**healthy_servers** | **float** |  | 
**servers** | [**List[GetStatus200ResponseFhirServersInner]**](GetStatus200ResponseFhirServersInner.md) |  | 

## Example

```python
from api_client.models.get_status200_response_fhir import GetStatus200ResponseFhir

# TODO update the JSON string below
json = "{}"
# create an instance of GetStatus200ResponseFhir from a JSON string
get_status200_response_fhir_instance = GetStatus200ResponseFhir.from_json(json)
# print the JSON string representation of the object
print(GetStatus200ResponseFhir.to_json())

# convert the object into a dict
get_status200_response_fhir_dict = get_status200_response_fhir_instance.to_dict()
# create an instance of GetStatus200ResponseFhir from a dict
get_status200_response_fhir_from_dict = GetStatus200ResponseFhir.from_dict(get_status200_response_fhir_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


