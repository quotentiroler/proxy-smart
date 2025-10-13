# PostAdminIdpsRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**alias** | **str** |  | 
**provider_id** | **str** |  | 
**display_name** | **str** |  | [optional] 
**enabled** | **bool** |  | [optional] 
**config** | [**PostAdminIdpsRequestConfig**](PostAdminIdpsRequestConfig.md) |  | 

## Example

```python
from api_client.models.post_admin_idps_request import PostAdminIdpsRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostAdminIdpsRequest from a JSON string
post_admin_idps_request_instance = PostAdminIdpsRequest.from_json(json)
# print the JSON string representation of the object
print(PostAdminIdpsRequest.to_json())

# convert the object into a dict
post_admin_idps_request_dict = post_admin_idps_request_instance.to_dict()
# create an instance of PostAdminIdpsRequest from a dict
post_admin_idps_request_from_dict = PostAdminIdpsRequest.from_dict(post_admin_idps_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


