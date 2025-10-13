# GetFhirServersByServerIdMtls200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**enabled** | **bool** | Whether mTLS is enabled for this server | 
**has_certificates** | [**GetFhirServersByServerIdMtls200ResponseHasCertificates**](GetFhirServersByServerIdMtls200ResponseHasCertificates.md) |  | 
**cert_details** | [**GetFhirServersByServerIdMtls200ResponseCertDetails**](GetFhirServersByServerIdMtls200ResponseCertDetails.md) |  | [optional] 

## Example

```python
from api_client.models.get_fhir_servers_by_server_id_mtls200_response import GetFhirServersByServerIdMtls200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetFhirServersByServerIdMtls200Response from a JSON string
get_fhir_servers_by_server_id_mtls200_response_instance = GetFhirServersByServerIdMtls200Response.from_json(json)
# print the JSON string representation of the object
print(GetFhirServersByServerIdMtls200Response.to_json())

# convert the object into a dict
get_fhir_servers_by_server_id_mtls200_response_dict = get_fhir_servers_by_server_id_mtls200_response_instance.to_dict()
# create an instance of GetFhirServersByServerIdMtls200Response from a dict
get_fhir_servers_by_server_id_mtls200_response_from_dict = GetFhirServersByServerIdMtls200Response.from_dict(get_fhir_servers_by_server_id_mtls200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


