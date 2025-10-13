# GetFhirServersByServerIdMtls200ResponseHasCertificates


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**client_cert** | **bool** | Whether client certificate is uploaded | 
**client_key** | **bool** | Whether client private key is uploaded | 
**ca_cert** | **bool** | Whether CA certificate is uploaded | 

## Example

```python
from api_client.models.get_fhir_servers_by_server_id_mtls200_response_has_certificates import GetFhirServersByServerIdMtls200ResponseHasCertificates

# TODO update the JSON string below
json = "{}"
# create an instance of GetFhirServersByServerIdMtls200ResponseHasCertificates from a JSON string
get_fhir_servers_by_server_id_mtls200_response_has_certificates_instance = GetFhirServersByServerIdMtls200ResponseHasCertificates.from_json(json)
# print the JSON string representation of the object
print(GetFhirServersByServerIdMtls200ResponseHasCertificates.to_json())

# convert the object into a dict
get_fhir_servers_by_server_id_mtls200_response_has_certificates_dict = get_fhir_servers_by_server_id_mtls200_response_has_certificates_instance.to_dict()
# create an instance of GetFhirServersByServerIdMtls200ResponseHasCertificates from a dict
get_fhir_servers_by_server_id_mtls200_response_has_certificates_from_dict = GetFhirServersByServerIdMtls200ResponseHasCertificates.from_dict(get_fhir_servers_by_server_id_mtls200_response_has_certificates_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


