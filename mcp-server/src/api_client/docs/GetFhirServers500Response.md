# GetFhirServers500Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**error** | **str** | Error message | 
**code** | **str** | Error code | [optional] 
**details** | **object** | Additional error details | [optional] 

## Example

```python
from api_client.models.get_fhir_servers500_response import GetFhirServers500Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetFhirServers500Response from a JSON string
get_fhir_servers500_response_instance = GetFhirServers500Response.from_json(json)
# print the JSON string representation of the object
print(GetFhirServers500Response.to_json())

# convert the object into a dict
get_fhir_servers500_response_dict = get_fhir_servers500_response_instance.to_dict()
# create an instance of GetFhirServers500Response from a dict
get_fhir_servers500_response_from_dict = GetFhirServers500Response.from_dict(get_fhir_servers500_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


