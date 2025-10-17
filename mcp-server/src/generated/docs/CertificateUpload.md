# CertificateUpload


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the upload was successful | 
**message** | **str** | Success or error message | 
**cert_details** | [**MtlsConfigCertDetails**](MtlsConfigCertDetails.md) |  | [optional] 

## Example

```python
from api_client.models.certificate_upload import CertificateUpload

# TODO update the JSON string below
json = "{}"
# create an instance of CertificateUpload from a JSON string
certificate_upload_instance = CertificateUpload.from_json(json)
# print the JSON string representation of the object
print(CertificateUpload.to_json())

# convert the object into a dict
certificate_upload_dict = certificate_upload_instance.to_dict()
# create an instance of CertificateUpload from a dict
certificate_upload_from_dict = CertificateUpload.from_dict(certificate_upload_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


