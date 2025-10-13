# PutFhirServersByServerId200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the server was updated successfully | 
**message** | **str** | Success message | 
**server** | [**FhirServer**](FhirServer.md) |  | 

## Example

```python
from api_client.models.put_fhir_servers_by_server_id200_response import PutFhirServersByServerId200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PutFhirServersByServerId200Response from a JSON string
put_fhir_servers_by_server_id200_response_instance = PutFhirServersByServerId200Response.from_json(json)
# print the JSON string representation of the object
print(PutFhirServersByServerId200Response.to_json())

# convert the object into a dict
put_fhir_servers_by_server_id200_response_dict = put_fhir_servers_by_server_id200_response_instance.to_dict()
# create an instance of PutFhirServersByServerId200Response from a dict
put_fhir_servers_by_server_id200_response_from_dict = PutFhirServersByServerId200Response.from_dict(put_fhir_servers_by_server_id200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


