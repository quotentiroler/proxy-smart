# PutFhirServersByServerIdMtlsRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**enabled** | **bool** | Whether to enable mTLS for this server | 

## Example

```python
from api_client.models.put_fhir_servers_by_server_id_mtls_request import PutFhirServersByServerIdMtlsRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PutFhirServersByServerIdMtlsRequest from a JSON string
put_fhir_servers_by_server_id_mtls_request_instance = PutFhirServersByServerIdMtlsRequest.from_json(json)
# print the JSON string representation of the object
print(PutFhirServersByServerIdMtlsRequest.to_json())

# convert the object into a dict
put_fhir_servers_by_server_id_mtls_request_dict = put_fhir_servers_by_server_id_mtls_request_instance.to_dict()
# create an instance of PutFhirServersByServerIdMtlsRequest from a dict
put_fhir_servers_by_server_id_mtls_request_from_dict = PutFhirServersByServerIdMtlsRequest.from_dict(put_fhir_servers_by_server_id_mtls_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


