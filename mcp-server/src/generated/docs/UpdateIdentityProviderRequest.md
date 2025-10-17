# UpdateIdentityProviderRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**display_name** | **str** | Display name | [optional] 
**enabled** | **bool** | Enable or disable the provider | [optional] 
**config** | [**IdentityProviderConfig**](IdentityProviderConfig.md) |  | [optional] 

## Example

```python
from api_client.models.update_identity_provider_request import UpdateIdentityProviderRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateIdentityProviderRequest from a JSON string
update_identity_provider_request_instance = UpdateIdentityProviderRequest.from_json(json)
# print the JSON string representation of the object
print(UpdateIdentityProviderRequest.to_json())

# convert the object into a dict
update_identity_provider_request_dict = update_identity_provider_request_instance.to_dict()
# create an instance of UpdateIdentityProviderRequest from a dict
update_identity_provider_request_from_dict = UpdateIdentityProviderRequest.from_dict(update_identity_provider_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


