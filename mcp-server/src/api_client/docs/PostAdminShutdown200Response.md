# PostAdminShutdown200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** |  | 
**message** | **str** |  | 
**timestamp** | **str** |  | 

## Example

```python
from api_client.models.post_admin_shutdown200_response import PostAdminShutdown200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostAdminShutdown200Response from a JSON string
post_admin_shutdown200_response_instance = PostAdminShutdown200Response.from_json(json)
# print the JSON string representation of the object
print(PostAdminShutdown200Response.to_json())

# convert the object into a dict
post_admin_shutdown200_response_dict = post_admin_shutdown200_response_instance.to_dict()
# create an instance of PostAdminShutdown200Response from a dict
post_admin_shutdown200_response_from_dict = PostAdminShutdown200Response.from_dict(post_admin_shutdown200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


