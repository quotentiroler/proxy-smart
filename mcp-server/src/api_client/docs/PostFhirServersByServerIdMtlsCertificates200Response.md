# PostFhirServersByServerIdMtlsCertificates200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the upload was successful | 
**message** | **str** | Success message | 
**cert_details** | [**GetFhirServersByServerIdMtls200ResponseCertDetails**](GetFhirServersByServerIdMtls200ResponseCertDetails.md) |  | [optional] 

## Example

```python
from api_client.models.post_fhir_servers_by_server_id_mtls_certificates200_response import PostFhirServersByServerIdMtlsCertificates200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostFhirServersByServerIdMtlsCertificates200Response from a JSON string
post_fhir_servers_by_server_id_mtls_certificates200_response_instance = PostFhirServersByServerIdMtlsCertificates200Response.from_json(json)
# print the JSON string representation of the object
print(PostFhirServersByServerIdMtlsCertificates200Response.to_json())

# convert the object into a dict
post_fhir_servers_by_server_id_mtls_certificates200_response_dict = post_fhir_servers_by_server_id_mtls_certificates200_response_instance.to_dict()
# create an instance of PostFhirServersByServerIdMtlsCertificates200Response from a dict
post_fhir_servers_by_server_id_mtls_certificates200_response_from_dict = PostFhirServersByServerIdMtlsCertificates200Response.from_dict(post_fhir_servers_by_server_id_mtls_certificates200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


