# GetAdminLaunchContexts200ResponseInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**user_id** | **str** | User ID | 
**username** | **str** | Username | 
**fhir_user** | **str** | FHIR resource representing the current user (e.g., Practitioner/123) | 
**patient** | **str** | Patient context (e.g., Patient/456) | 
**encounter** | **str** | Encounter context (e.g., Encounter/789) | 
**fhir_context** | **str** | Additional FHIR resources in context (JSON array) | 
**intent** | **str** | Intent string (e.g., reconcile-medications) | 
**smart_style_url** | **str** | URL to CSS stylesheet for styling | 
**tenant** | **str** | Tenant identifier | 
**need_patient_banner** | **bool** | Whether patient banner is required | 
**launch_patient** | **str** | Legacy patient context | 
**launch_encounter** | **str** | Legacy encounter context | 

## Example

```python
from api_client.models.get_admin_launch_contexts200_response_inner import GetAdminLaunchContexts200ResponseInner

# TODO update the JSON string below
json = "{}"
# create an instance of GetAdminLaunchContexts200ResponseInner from a JSON string
get_admin_launch_contexts200_response_inner_instance = GetAdminLaunchContexts200ResponseInner.from_json(json)
# print the JSON string representation of the object
print(GetAdminLaunchContexts200ResponseInner.to_json())

# convert the object into a dict
get_admin_launch_contexts200_response_inner_dict = get_admin_launch_contexts200_response_inner_instance.to_dict()
# create an instance of GetAdminLaunchContexts200ResponseInner from a dict
get_admin_launch_contexts200_response_inner_from_dict = GetAdminLaunchContexts200ResponseInner.from_dict(get_admin_launch_contexts200_response_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


