# PutAdminHealthcareUsersByUserIdRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**first_name** | **str** | First name | [optional] 
**last_name** | **str** | Last name | [optional] 
**email** | **str** | Email address | [optional] 
**enabled** | **bool** | Whether user is enabled | [optional] 
**organization** | **str** | Organization | [optional] 
**fhir_user** | **str** | FHIR User identifiers in format \&quot;server1:Person/123,server2:Person/456\&quot; | [optional] 
**realm_roles** | **List[str]** |  | [optional] 
**client_roles** | **object** | Client roles to assign | [optional] 

## Example

```python
from api_client.models.put_admin_healthcare_users_by_user_id_request import PutAdminHealthcareUsersByUserIdRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PutAdminHealthcareUsersByUserIdRequest from a JSON string
put_admin_healthcare_users_by_user_id_request_instance = PutAdminHealthcareUsersByUserIdRequest.from_json(json)
# print the JSON string representation of the object
print(PutAdminHealthcareUsersByUserIdRequest.to_json())

# convert the object into a dict
put_admin_healthcare_users_by_user_id_request_dict = put_admin_healthcare_users_by_user_id_request_instance.to_dict()
# create an instance of PutAdminHealthcareUsersByUserIdRequest from a dict
put_admin_healthcare_users_by_user_id_request_from_dict = PutAdminHealthcareUsersByUserIdRequest.from_dict(put_admin_healthcare_users_by_user_id_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


