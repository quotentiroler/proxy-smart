# LaunchContextUser


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**user_id** | **str** | User ID | 
**username** | **str** | Username | 
**fhir_user** | **str** | FHIR resource representing the current user (e.g., Practitioner/123) | [optional] 
**patient** | **str** | Patient context (e.g., Patient/456) | [optional] 
**encounter** | **str** | Encounter context (e.g., Encounter/789) | [optional] 
**fhir_context** | **str** | Additional FHIR resources in context (JSON array) | [optional] 
**intent** | **str** | Intent string (e.g., reconcile-medications) | [optional] 
**smart_style_url** | **str** | URL to CSS stylesheet for styling | [optional] 
**tenant** | **str** | Tenant identifier | [optional] 
**need_patient_banner** | **bool** | Whether patient banner is required | [optional] 
**launch_patient** | **str** | Legacy patient context | [optional] 
**launch_encounter** | **str** | Legacy encounter context | [optional] 

## Example

```python
from api_client.models.launch_context_user import LaunchContextUser

# TODO update the JSON string below
json = "{}"
# create an instance of LaunchContextUser from a JSON string
launch_context_user_instance = LaunchContextUser.from_json(json)
# print the JSON string representation of the object
print(LaunchContextUser.to_json())

# convert the object into a dict
launch_context_user_dict = launch_context_user_instance.to_dict()
# create an instance of LaunchContextUser from a dict
launch_context_user_from_dict = LaunchContextUser.from_dict(launch_context_user_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


