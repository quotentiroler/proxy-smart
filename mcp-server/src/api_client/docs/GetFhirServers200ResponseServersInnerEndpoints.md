# GetFhirServers200ResponseServersInnerEndpoints


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base** | **str** | Base FHIR endpoint URL | 
**smart_config** | **str** | SMART configuration endpoint URL | 
**metadata** | **str** | FHIR metadata endpoint URL | 

## Example

```python
from api_client.models.get_fhir_servers200_response_servers_inner_endpoints import GetFhirServers200ResponseServersInnerEndpoints

# TODO update the JSON string below
json = "{}"
# create an instance of GetFhirServers200ResponseServersInnerEndpoints from a JSON string
get_fhir_servers200_response_servers_inner_endpoints_instance = GetFhirServers200ResponseServersInnerEndpoints.from_json(json)
# print the JSON string representation of the object
print(GetFhirServers200ResponseServersInnerEndpoints.to_json())

# convert the object into a dict
get_fhir_servers200_response_servers_inner_endpoints_dict = get_fhir_servers200_response_servers_inner_endpoints_instance.to_dict()
# create an instance of GetFhirServers200ResponseServersInnerEndpoints from a dict
get_fhir_servers200_response_servers_inner_endpoints_from_dict = GetFhirServers200ResponseServersInnerEndpoints.from_dict(get_fhir_servers200_response_servers_inner_endpoints_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


