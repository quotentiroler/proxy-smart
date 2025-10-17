# FhirContextItem


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reference** | **str** | FHIR resource reference | [optional] 
**canonical** | **str** | Canonical URL | [optional] 
**identifier** | **object** | FHIR Identifier | [optional] 
**type** | **str** | FHIR resource type | [optional] 
**role** | **str** | Role URI | [optional] 

## Example

```python
from api_client.models.fhir_context_item import FhirContextItem

# TODO update the JSON string below
json = "{}"
# create an instance of FhirContextItem from a JSON string
fhir_context_item_instance = FhirContextItem.from_json(json)
# print the JSON string representation of the object
print(FhirContextItem.to_json())

# convert the object into a dict
fhir_context_item_dict = fhir_context_item_instance.to_dict()
# create an instance of FhirContextItem from a dict
fhir_context_item_from_dict = FhirContextItem.from_dict(fhir_context_item_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


