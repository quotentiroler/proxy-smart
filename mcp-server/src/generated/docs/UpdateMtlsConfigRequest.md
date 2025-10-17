# UpdateMtlsConfigRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**enabled** | **bool** | Enable or disable mTLS for this server | 

## Example

```python
from api_client.models.update_mtls_config_request import UpdateMtlsConfigRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateMtlsConfigRequest from a JSON string
update_mtls_config_request_instance = UpdateMtlsConfigRequest.from_json(json)
# print the JSON string representation of the object
print(UpdateMtlsConfigRequest.to_json())

# convert the object into a dict
update_mtls_config_request_dict = update_mtls_config_request_instance.to_dict()
# create an instance of UpdateMtlsConfigRequest from a dict
update_mtls_config_request_from_dict = UpdateMtlsConfigRequest.from_dict(update_mtls_config_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


