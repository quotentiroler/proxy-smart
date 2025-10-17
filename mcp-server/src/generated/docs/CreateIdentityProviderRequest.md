# CreateIdentityProviderRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**alias** | **str** | Provider alias (unique identifier) | 
**provider_id** | **str** | Provider type (oidc, saml, etc.) | 
**config** | [**IdentityProviderConfig**](IdentityProviderConfig.md) |  | 
**display_name** | **str** | Display name for UI | [optional] 
**enabled** | **bool** | Whether to enable the provider | [optional] [default to True]

## Example

```python
from api_client.models.create_identity_provider_request import CreateIdentityProviderRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CreateIdentityProviderRequest from a JSON string
create_identity_provider_request_instance = CreateIdentityProviderRequest.from_json(json)
# print the JSON string representation of the object
print(CreateIdentityProviderRequest.to_json())

# convert the object into a dict
create_identity_provider_request_dict = create_identity_provider_request_instance.to_dict()
# create an instance of CreateIdentityProviderRequest from a dict
create_identity_provider_request_from_dict = CreateIdentityProviderRequest.from_dict(create_identity_provider_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


