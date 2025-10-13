# GetFhirServers200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total_servers** | **float** | Total number of configured FHIR servers | 
**servers** | [**List[GetFhirServers200ResponseServersInner]**](GetFhirServers200ResponseServersInner.md) |  | 

## Example

```python
from api_client.models.get_fhir_servers200_response import GetFhirServers200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetFhirServers200Response from a JSON string
get_fhir_servers200_response_instance = GetFhirServers200Response.from_json(json)
# print the JSON string representation of the object
print(GetFhirServers200Response.to_json())

# convert the object into a dict
get_fhir_servers200_response_dict = get_fhir_servers200_response_instance.to_dict()
# create an instance of GetFhirServers200Response from a dict
get_fhir_servers200_response_from_dict = GetFhirServers200Response.from_dict(get_fhir_servers200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


