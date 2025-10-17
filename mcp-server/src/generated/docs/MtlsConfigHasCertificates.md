# MtlsConfigHasCertificates


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**client_cert** | **bool** | Whether client certificate is uploaded | 
**client_key** | **bool** | Whether client private key is uploaded | 
**ca_cert** | **bool** | Whether CA certificate is uploaded | 

## Example

```python
from api_client.models.mtls_config_has_certificates import MtlsConfigHasCertificates

# TODO update the JSON string below
json = "{}"
# create an instance of MtlsConfigHasCertificates from a JSON string
mtls_config_has_certificates_instance = MtlsConfigHasCertificates.from_json(json)
# print the JSON string representation of the object
print(MtlsConfigHasCertificates.to_json())

# convert the object into a dict
mtls_config_has_certificates_dict = mtls_config_has_certificates_instance.to_dict()
# create an instance of MtlsConfigHasCertificates from a dict
mtls_config_has_certificates_from_dict = MtlsConfigHasCertificates.from_dict(mtls_config_has_certificates_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


