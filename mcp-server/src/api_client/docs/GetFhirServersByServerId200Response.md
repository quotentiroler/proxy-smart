# GetFhirServersByServerId200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | Human-readable server name | 
**url** | **str** | Original server URL | 
**fhir_version** | **str** | FHIR version supported by server | 
**server_version** | **str** | Server software version | [optional] 
**server_name** | **str** | Server software name from FHIR metadata | [optional] 
**supported** | **bool** | Whether this server is supported | 
**endpoints** | [**GetFhirServers200ResponseServersInnerEndpoints**](GetFhirServers200ResponseServersInnerEndpoints.md) |  | 

## Example

```python
from api_client.models.get_fhir_servers_by_server_id200_response import GetFhirServersByServerId200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetFhirServersByServerId200Response from a JSON string
get_fhir_servers_by_server_id200_response_instance = GetFhirServersByServerId200Response.from_json(json)
# print the JSON string representation of the object
print(GetFhirServersByServerId200Response.to_json())

# convert the object into a dict
get_fhir_servers_by_server_id200_response_dict = get_fhir_servers_by_server_id200_response_instance.to_dict()
# create an instance of GetFhirServersByServerId200Response from a dict
get_fhir_servers_by_server_id200_response_from_dict = GetFhirServersByServerId200Response.from_dict(get_fhir_servers_by_server_id200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


