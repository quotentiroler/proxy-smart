# UpdateHealthcareUserRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**first_name** | **str** | First name | [optional] 
**last_name** | **str** | Last name | [optional] 
**email** | **str** | Email address | [optional] 
**enabled** | **bool** | Whether the user is enabled | [optional] 
**organization** | **str** | Organization identifier | [optional] 
**fhir_persons** | [**List[FhirPersonAssociation]**](FhirPersonAssociation.md) | FHIR Person associations to update | [optional] 
**realm_roles** | **List[str]** | Realm-level roles | [optional] 
**client_roles** | **object** |  | [optional] 
**email_verified** | **bool** | Whether the email is verified | [optional] 
**npi** | **str** | National Provider Identifier (NPI) | [optional] 
**practitioner_id** | **str** | FHIR Practitioner resource ID | [optional] 

## Example

```python
from api_client.models.update_healthcare_user_request import UpdateHealthcareUserRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateHealthcareUserRequest from a JSON string
update_healthcare_user_request_instance = UpdateHealthcareUserRequest.from_json(json)
# print the JSON string representation of the object
print(UpdateHealthcareUserRequest.to_json())

# convert the object into a dict
update_healthcare_user_request_dict = update_healthcare_user_request_instance.to_dict()
# create an instance of UpdateHealthcareUserRequest from a dict
update_healthcare_user_request_from_dict = UpdateHealthcareUserRequest.from_dict(update_healthcare_user_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


