# MtlsConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**enabled** | **bool** | Whether mTLS is enabled for this server | 
**has_certificates** | [**MtlsConfigHasCertificates**](MtlsConfigHasCertificates.md) |  | 
**cert_details** | [**MtlsConfigCertDetails**](MtlsConfigCertDetails.md) |  | [optional] 

## Example

```python
from api_client.models.mtls_config import MtlsConfig

# TODO update the JSON string below
json = "{}"
# create an instance of MtlsConfig from a JSON string
mtls_config_instance = MtlsConfig.from_json(json)
# print the JSON string representation of the object
print(MtlsConfig.to_json())

# convert the object into a dict
mtls_config_dict = mtls_config_instance.to_dict()
# create an instance of MtlsConfig from a dict
mtls_config_from_dict = MtlsConfig.from_dict(mtls_config_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


