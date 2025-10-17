# OAuthEventFhirContext


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**patient** | **str** | Patient ID | [optional] 
**encounter** | **str** | Encounter ID | [optional] 
**location** | **str** | Location ID | [optional] 
**fhir_user** | **str** | FHIR User ID | [optional] 

## Example

```python
from api_client.models.o_auth_event_fhir_context import OAuthEventFhirContext

# TODO update the JSON string below
json = "{}"
# create an instance of OAuthEventFhirContext from a JSON string
o_auth_event_fhir_context_instance = OAuthEventFhirContext.from_json(json)
# print the JSON string representation of the object
print(OAuthEventFhirContext.to_json())

# convert the object into a dict
o_auth_event_fhir_context_dict = o_auth_event_fhir_context_instance.to_dict()
# create an instance of OAuthEventFhirContext from a dict
o_auth_event_fhir_context_from_dict = OAuthEventFhirContext.from_dict(o_auth_event_fhir_context_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


