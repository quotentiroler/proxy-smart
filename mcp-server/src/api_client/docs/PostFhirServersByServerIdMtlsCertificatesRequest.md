# PostFhirServersByServerIdMtlsCertificatesRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **str** | Certificate type: \&quot;client\&quot;, \&quot;key\&quot;, or \&quot;ca\&quot; | 
**content** | **str** | Base64 encoded certificate or key content | 
**filename** | **str** | Original filename | [optional] 

## Example

```python
from api_client.models.post_fhir_servers_by_server_id_mtls_certificates_request import PostFhirServersByServerIdMtlsCertificatesRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostFhirServersByServerIdMtlsCertificatesRequest from a JSON string
post_fhir_servers_by_server_id_mtls_certificates_request_instance = PostFhirServersByServerIdMtlsCertificatesRequest.from_json(json)
# print the JSON string representation of the object
print(PostFhirServersByServerIdMtlsCertificatesRequest.to_json())

# convert the object into a dict
post_fhir_servers_by_server_id_mtls_certificates_request_dict = post_fhir_servers_by_server_id_mtls_certificates_request_instance.to_dict()
# create an instance of PostFhirServersByServerIdMtlsCertificatesRequest from a dict
post_fhir_servers_by_server_id_mtls_certificates_request_from_dict = PostFhirServersByServerIdMtlsCertificatesRequest.from_dict(post_fhir_servers_by_server_id_mtls_certificates_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


