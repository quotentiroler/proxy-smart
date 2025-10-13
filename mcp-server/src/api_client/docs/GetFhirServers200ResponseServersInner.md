# GetFhirServers200ResponseServersInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique server identifier | 
**name** | **str** | Human-readable server name | 
**url** | **str** | Original server URL | 
**fhir_version** | **str** | FHIR version supported by server | 
**server_version** | **str** | Server software version | [optional] 
**server_name** | **str** | Server software name from FHIR metadata | [optional] 
**supported** | **bool** | Whether this server is supported | 
**error** | **str** | Error message if server info failed to fetch | [optional] 
**endpoints** | [**GetFhirServers200ResponseServersInnerEndpoints**](GetFhirServers200ResponseServersInnerEndpoints.md) |  | 

## Example

```python
from api_client.models.get_fhir_servers200_response_servers_inner import GetFhirServers200ResponseServersInner

# TODO update the JSON string below
json = "{}"
# create an instance of GetFhirServers200ResponseServersInner from a JSON string
get_fhir_servers200_response_servers_inner_instance = GetFhirServers200ResponseServersInner.from_json(json)
# print the JSON string representation of the object
print(GetFhirServers200ResponseServersInner.to_json())

# convert the object into a dict
get_fhir_servers200_response_servers_inner_dict = get_fhir_servers200_response_servers_inner_instance.to_dict()
# create an instance of GetFhirServers200ResponseServersInner from a dict
get_fhir_servers200_response_servers_inner_from_dict = GetFhirServers200ResponseServersInner.from_dict(get_fhir_servers200_response_servers_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


