# UpdateMtlsConfigResponseConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**enabled** | **bool** | Whether mTLS is enabled | 
**has_certificates** | [**MtlsConfigHasCertificates**](MtlsConfigHasCertificates.md) |  | 

## Example

```python
from api_client.models.update_mtls_config_response_config import UpdateMtlsConfigResponseConfig

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateMtlsConfigResponseConfig from a JSON string
update_mtls_config_response_config_instance = UpdateMtlsConfigResponseConfig.from_json(json)
# print the JSON string representation of the object
print(UpdateMtlsConfigResponseConfig.to_json())

# convert the object into a dict
update_mtls_config_response_config_dict = update_mtls_config_response_config_instance.to_dict()
# create an instance of UpdateMtlsConfigResponseConfig from a dict
update_mtls_config_response_config_from_dict = UpdateMtlsConfigResponseConfig.from_dict(update_mtls_config_response_config_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


