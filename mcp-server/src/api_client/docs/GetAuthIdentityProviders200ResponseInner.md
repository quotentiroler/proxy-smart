# GetAuthIdentityProviders200ResponseInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**alias** | **str** | Provider alias | 
**provider_id** | **str** | Provider type | 
**display_name** | **str** | Display name | 
**enabled** | **bool** | Whether provider is enabled | 

## Example

```python
from api_client.models.get_auth_identity_providers200_response_inner import GetAuthIdentityProviders200ResponseInner

# TODO update the JSON string below
json = "{}"
# create an instance of GetAuthIdentityProviders200ResponseInner from a JSON string
get_auth_identity_providers200_response_inner_instance = GetAuthIdentityProviders200ResponseInner.from_json(json)
# print the JSON string representation of the object
print(GetAuthIdentityProviders200ResponseInner.to_json())

# convert the object into a dict
get_auth_identity_providers200_response_inner_dict = get_auth_identity_providers200_response_inner_instance.to_dict()
# create an instance of GetAuthIdentityProviders200ResponseInner from a dict
get_auth_identity_providers200_response_inner_from_dict = GetAuthIdentityProviders200ResponseInner.from_dict(get_auth_identity_providers200_response_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


