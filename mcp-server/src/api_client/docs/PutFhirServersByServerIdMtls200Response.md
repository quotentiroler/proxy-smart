# PutFhirServersByServerIdMtls200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the update was successful | 
**message** | **str** | Success message | 
**config** | [**PutFhirServersByServerIdMtls200ResponseConfig**](PutFhirServersByServerIdMtls200ResponseConfig.md) |  | 

## Example

```python
from api_client.models.put_fhir_servers_by_server_id_mtls200_response import PutFhirServersByServerIdMtls200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PutFhirServersByServerIdMtls200Response from a JSON string
put_fhir_servers_by_server_id_mtls200_response_instance = PutFhirServersByServerIdMtls200Response.from_json(json)
# print the JSON string representation of the object
print(PutFhirServersByServerIdMtls200Response.to_json())

# convert the object into a dict
put_fhir_servers_by_server_id_mtls200_response_dict = put_fhir_servers_by_server_id_mtls200_response_instance.to_dict()
# create an instance of PutFhirServersByServerIdMtls200Response from a dict
put_fhir_servers_by_server_id_mtls200_response_from_dict = PutFhirServersByServerIdMtls200Response.from_dict(put_fhir_servers_by_server_id_mtls200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


