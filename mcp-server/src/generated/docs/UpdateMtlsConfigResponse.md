# UpdateMtlsConfigResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the update was successful | 
**message** | **str** | Success message | 
**config** | [**UpdateMtlsConfigResponseConfig**](UpdateMtlsConfigResponseConfig.md) |  | 

## Example

```python
from api_client.models.update_mtls_config_response import UpdateMtlsConfigResponse

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateMtlsConfigResponse from a JSON string
update_mtls_config_response_instance = UpdateMtlsConfigResponse.from_json(json)
# print the JSON string representation of the object
print(UpdateMtlsConfigResponse.to_json())

# convert the object into a dict
update_mtls_config_response_dict = update_mtls_config_response_instance.to_dict()
# create an instance of UpdateMtlsConfigResponse from a dict
update_mtls_config_response_from_dict = UpdateMtlsConfigResponse.from_dict(update_mtls_config_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


