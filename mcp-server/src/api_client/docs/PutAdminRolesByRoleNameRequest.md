# PutAdminRolesByRoleNameRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**description** | **str** | Role description | [optional] 
**fhir_scopes** | **List[str]** |  | [optional] 

## Example

```python
from api_client.models.put_admin_roles_by_role_name_request import PutAdminRolesByRoleNameRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PutAdminRolesByRoleNameRequest from a JSON string
put_admin_roles_by_role_name_request_instance = PutAdminRolesByRoleNameRequest.from_json(json)
# print the JSON string representation of the object
print(PutAdminRolesByRoleNameRequest.to_json())

# convert the object into a dict
put_admin_roles_by_role_name_request_dict = put_admin_roles_by_role_name_request_instance.to_dict()
# create an instance of PutAdminRolesByRoleNameRequest from a dict
put_admin_roles_by_role_name_request_from_dict = PutAdminRolesByRoleNameRequest.from_dict(put_admin_roles_by_role_name_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


