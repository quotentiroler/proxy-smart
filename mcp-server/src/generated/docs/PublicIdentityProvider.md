# PublicIdentityProvider


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**alias** | **str** | Provider alias | 
**provider_id** | **str** | Provider type | 
**display_name** | **str** | Display name | 
**enabled** | **bool** | Whether provider is enabled | 

## Example

```python
from api_client.models.public_identity_provider import PublicIdentityProvider

# TODO update the JSON string below
json = "{}"
# create an instance of PublicIdentityProvider from a JSON string
public_identity_provider_instance = PublicIdentityProvider.from_json(json)
# print the JSON string representation of the object
print(PublicIdentityProvider.to_json())

# convert the object into a dict
public_identity_provider_dict = public_identity_provider_instance.to_dict()
# create an instance of PublicIdentityProvider from a dict
public_identity_provider_from_dict = PublicIdentityProvider.from_dict(public_identity_provider_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


