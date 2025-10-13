# PutFhirServersByServerIdMtls200ResponseConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**enabled** | **bool** | Whether mTLS is enabled | 
**has_certificates** | [**GetFhirServersByServerIdMtls200ResponseHasCertificates**](GetFhirServersByServerIdMtls200ResponseHasCertificates.md) |  | 

## Example

```python
from api_client.models.put_fhir_servers_by_server_id_mtls200_response_config import PutFhirServersByServerIdMtls200ResponseConfig

# TODO update the JSON string below
json = "{}"
# create an instance of PutFhirServersByServerIdMtls200ResponseConfig from a JSON string
put_fhir_servers_by_server_id_mtls200_response_config_instance = PutFhirServersByServerIdMtls200ResponseConfig.from_json(json)
# print the JSON string representation of the object
print(PutFhirServersByServerIdMtls200ResponseConfig.to_json())

# convert the object into a dict
put_fhir_servers_by_server_id_mtls200_response_config_dict = put_fhir_servers_by_server_id_mtls200_response_config_instance.to_dict()
# create an instance of PutFhirServersByServerIdMtls200ResponseConfig from a dict
put_fhir_servers_by_server_id_mtls200_response_config_from_dict = PutFhirServersByServerIdMtls200ResponseConfig.from_dict(put_fhir_servers_by_server_id_mtls200_response_config_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


