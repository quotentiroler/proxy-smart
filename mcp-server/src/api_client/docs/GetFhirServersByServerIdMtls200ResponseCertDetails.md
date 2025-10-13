# GetFhirServersByServerIdMtls200ResponseCertDetails


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**subject** | **str** | Certificate subject | 
**issuer** | **str** | Certificate issuer | 
**valid_from** | **str** | Certificate valid from date | 
**valid_to** | **str** | Certificate valid to date | 
**fingerprint** | **str** | Certificate fingerprint | 

## Example

```python
from api_client.models.get_fhir_servers_by_server_id_mtls200_response_cert_details import GetFhirServersByServerIdMtls200ResponseCertDetails

# TODO update the JSON string below
json = "{}"
# create an instance of GetFhirServersByServerIdMtls200ResponseCertDetails from a JSON string
get_fhir_servers_by_server_id_mtls200_response_cert_details_instance = GetFhirServersByServerIdMtls200ResponseCertDetails.from_json(json)
# print the JSON string representation of the object
print(GetFhirServersByServerIdMtls200ResponseCertDetails.to_json())

# convert the object into a dict
get_fhir_servers_by_server_id_mtls200_response_cert_details_dict = get_fhir_servers_by_server_id_mtls200_response_cert_details_instance.to_dict()
# create an instance of GetFhirServersByServerIdMtls200ResponseCertDetails from a dict
get_fhir_servers_by_server_id_mtls200_response_cert_details_from_dict = GetFhirServersByServerIdMtls200ResponseCertDetails.from_dict(get_fhir_servers_by_server_id_mtls200_response_cert_details_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


