# HealthcareUser


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | User ID | 
**username** | **str** | Username | 
**email** | **str** | Email address | 
**first_name** | **str** | First name | 
**last_name** | **str** | Last name | 
**enabled** | **bool** | Whether the user is enabled | 
**attributes** | **object** |  | [optional] 
**created_timestamp** | **float** | Creation timestamp (Unix milliseconds) | [optional] 
**last_login** | **float** |  | [optional] 
**realm_roles** | **List[str]** | Realm-level roles | [optional] 
**client_roles** | **object** |  | [optional] 
**organization** | **str** | Organization identifier | [optional] 
**fhir_user** | **str** | FHIR user reference (e.g., Practitioner/123) | [optional] 

## Example

```python
from api_client.models.healthcare_user import HealthcareUser

# TODO update the JSON string below
json = "{}"
# create an instance of HealthcareUser from a JSON string
healthcare_user_instance = HealthcareUser.from_json(json)
# print the JSON string representation of the object
print(HealthcareUser.to_json())

# convert the object into a dict
healthcare_user_dict = healthcare_user_instance.to_dict()
# create an instance of HealthcareUser from a dict
healthcare_user_from_dict = HealthcareUser.from_dict(healthcare_user_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


