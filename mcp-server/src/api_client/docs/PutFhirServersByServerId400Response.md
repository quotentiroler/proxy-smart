# PutFhirServersByServerId400Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**error** | **str** | Error message | 
**details** | **str** | Error details | [optional] 

## Example

```python
from api_client.models.put_fhir_servers_by_server_id400_response import PutFhirServersByServerId400Response

# TODO update the JSON string below
json = "{}"
# create an instance of PutFhirServersByServerId400Response from a JSON string
put_fhir_servers_by_server_id400_response_instance = PutFhirServersByServerId400Response.from_json(json)
# print the JSON string representation of the object
print(PutFhirServersByServerId400Response.to_json())

# convert the object into a dict
put_fhir_servers_by_server_id400_response_dict = put_fhir_servers_by_server_id400_response_instance.to_dict()
# create an instance of PutFhirServersByServerId400Response from a dict
put_fhir_servers_by_server_id400_response_from_dict = PutFhirServersByServerId400Response.from_dict(put_fhir_servers_by_server_id400_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


