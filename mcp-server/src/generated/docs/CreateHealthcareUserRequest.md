# CreateHealthcareUserRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**username** | **str** | Username (must be unique) | 
**email** | **str** | Email address | 
**first_name** | **str** | First name | 
**last_name** | **str** | Last name | 
**organization** | **str** | Organization identifier | [optional] 
**fhir_persons** | [**List[FhirPersonAssociation]**](FhirPersonAssociation.md) | FHIR Person associations to create | [optional] 
**password** | **str** | User password | [optional] 
**temporary_password** | **bool** | Whether password is temporary and must be changed | [optional] 
**realm_roles** | **List[str]** | Realm-level roles to assign | [optional] 
**client_roles** | **object** |  | [optional] 
**enabled** | **bool** | Whether the user is enabled | [optional] [default to True]
**email_verified** | **bool** | Whether the email is verified | [optional] 
**npi** | **str** | National Provider Identifier (NPI) for healthcare providers | [optional] 
**practitioner_id** | **str** | FHIR Practitioner resource ID | [optional] 

## Example

```python
from api_client.models.create_healthcare_user_request import CreateHealthcareUserRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CreateHealthcareUserRequest from a JSON string
create_healthcare_user_request_instance = CreateHealthcareUserRequest.from_json(json)
# print the JSON string representation of the object
print(CreateHealthcareUserRequest.to_json())

# convert the object into a dict
create_healthcare_user_request_dict = create_healthcare_user_request_instance.to_dict()
# create an instance of CreateHealthcareUserRequest from a dict
create_healthcare_user_request_from_dict = CreateHealthcareUserRequest.from_dict(create_healthcare_user_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


