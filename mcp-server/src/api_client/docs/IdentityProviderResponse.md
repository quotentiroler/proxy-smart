# IdentityProviderResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**alias** | **str** | Provider alias | 
**provider_id** | **str** | Provider type | 
**display_name** | **str** | Display name | [optional] 
**enabled** | **bool** | Whether provider is enabled | [optional] 
**config** | **object** |  | [optional] 

## Example

```python
from api_client.models.identity_provider_response import IdentityProviderResponse

# TODO update the JSON string below
json = "{}"
# create an instance of IdentityProviderResponse from a JSON string
identity_provider_response_instance = IdentityProviderResponse.from_json(json)
# print the JSON string representation of the object
print(IdentityProviderResponse.to_json())

# convert the object into a dict
identity_provider_response_dict = identity_provider_response_instance.to_dict()
# create an instance of IdentityProviderResponse from a dict
identity_provider_response_from_dict = IdentityProviderResponse.from_dict(identity_provider_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


