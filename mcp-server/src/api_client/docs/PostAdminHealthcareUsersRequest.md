# PostAdminHealthcareUsersRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**username** | **str** | Unique username | 
**email** | **str** | Email address | 
**first_name** | **str** | First name | 
**last_name** | **str** | Last name | 
**organization** | **str** | Organization | [optional] 
**fhir_user** | **str** | FHIR User identifiers in format \&quot;server1:Person/123,server2:Person/456\&quot; | [optional] 
**password** | **str** | Initial password | [optional] 
**temporary_password** | **bool** | Whether password is temporary | [optional] 
**realm_roles** | **List[str]** |  | [optional] 
**client_roles** | **object** | Client roles to assign | [optional] 

## Example

```python
from api_client.models.post_admin_healthcare_users_request import PostAdminHealthcareUsersRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostAdminHealthcareUsersRequest from a JSON string
post_admin_healthcare_users_request_instance = PostAdminHealthcareUsersRequest.from_json(json)
# print the JSON string representation of the object
print(PostAdminHealthcareUsersRequest.to_json())

# convert the object into a dict
post_admin_healthcare_users_request_dict = post_admin_healthcare_users_request_instance.to_dict()
# create an instance of PostAdminHealthcareUsersRequest from a dict
post_admin_healthcare_users_request_from_dict = PostAdminHealthcareUsersRequest.from_dict(post_admin_healthcare_users_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


