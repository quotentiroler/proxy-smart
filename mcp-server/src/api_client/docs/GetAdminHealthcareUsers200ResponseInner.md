# GetAdminHealthcareUsers200ResponseInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | User ID | 
**username** | **str** | Username | 
**email** | **str** | Email address | 
**first_name** | **str** | First name | 
**last_name** | **str** | Last name | 
**enabled** | **bool** | Whether user is enabled | 
**attributes** | **object** |  | [optional] 
**created_timestamp** | **float** | Creation timestamp | [optional] 
**last_login** | **float** |  | [optional] 
**realm_roles** | **List[str]** | Keycloak realm roles | [optional] 
**client_roles** | **object** | Keycloak client roles | [optional] 
**organization** | **str** | Organization | [optional] 
**fhir_user** | **str** | FHIR User identifier | [optional] 

## Example

```python
from api_client.models.get_admin_healthcare_users200_response_inner import GetAdminHealthcareUsers200ResponseInner

# TODO update the JSON string below
json = "{}"
# create an instance of GetAdminHealthcareUsers200ResponseInner from a JSON string
get_admin_healthcare_users200_response_inner_instance = GetAdminHealthcareUsers200ResponseInner.from_json(json)
# print the JSON string representation of the object
print(GetAdminHealthcareUsers200ResponseInner.to_json())

# convert the object into a dict
get_admin_healthcare_users200_response_inner_dict = get_admin_healthcare_users200_response_inner_instance.to_dict()
# create an instance of GetAdminHealthcareUsers200ResponseInner from a dict
get_admin_healthcare_users200_response_inner_from_dict = GetAdminHealthcareUsers200ResponseInner.from_dict(get_admin_healthcare_users200_response_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


