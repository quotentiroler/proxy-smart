# PutFhirServersByServerIdRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**url** | **str** | New FHIR server base URL | 
**name** | **str** | Optional custom name for the server | [optional] 

## Example

```python
from api_client.models.put_fhir_servers_by_server_id_request import PutFhirServersByServerIdRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PutFhirServersByServerIdRequest from a JSON string
put_fhir_servers_by_server_id_request_instance = PutFhirServersByServerIdRequest.from_json(json)
# print the JSON string representation of the object
print(PutFhirServersByServerIdRequest.to_json())

# convert the object into a dict
put_fhir_servers_by_server_id_request_dict = put_fhir_servers_by_server_id_request_instance.to_dict()
# create an instance of PutFhirServersByServerIdRequest from a dict
put_fhir_servers_by_server_id_request_from_dict = PutFhirServersByServerIdRequest.from_dict(put_fhir_servers_by_server_id_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


