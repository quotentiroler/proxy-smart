# PostAdminRolesRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | Role name | 
**description** | **str** | Role description | [optional] 
**fhir_scopes** | **List[str]** |  | [optional] 

## Example

```python
from api_client.models.post_admin_roles_request import PostAdminRolesRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostAdminRolesRequest from a JSON string
post_admin_roles_request_instance = PostAdminRolesRequest.from_json(json)
# print the JSON string representation of the object
print(PostAdminRolesRequest.to_json())

# convert the object into a dict
post_admin_roles_request_dict = post_admin_roles_request_instance.to_dict()
# create an instance of PostAdminRolesRequest from a dict
post_admin_roles_request_from_dict = PostAdminRolesRequest.from_dict(post_admin_roles_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


