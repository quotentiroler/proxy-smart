# GetAdminIdps200ResponseInner


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
from api_client.models.get_admin_idps200_response_inner import GetAdminIdps200ResponseInner

# TODO update the JSON string below
json = "{}"
# create an instance of GetAdminIdps200ResponseInner from a JSON string
get_admin_idps200_response_inner_instance = GetAdminIdps200ResponseInner.from_json(json)
# print the JSON string representation of the object
print(GetAdminIdps200ResponseInner.to_json())

# convert the object into a dict
get_admin_idps200_response_inner_dict = get_admin_idps200_response_inner_instance.to_dict()
# create an instance of GetAdminIdps200ResponseInner from a dict
get_admin_idps200_response_inner_from_dict = GetAdminIdps200ResponseInner.from_dict(get_admin_idps200_response_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


