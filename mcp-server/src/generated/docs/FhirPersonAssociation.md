# FhirPersonAssociation


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**server_id** | **str** | FHIR server identifier | 
**person_id** | **str** | FHIR Person resource ID | 
**display** | **str** | Display name for the Person | [optional] 
**created** | **str** | Creation timestamp (ISO 8601) | [optional] 

## Example

```python
from api_client.models.fhir_person_association import FhirPersonAssociation

# TODO update the JSON string below
json = "{}"
# create an instance of FhirPersonAssociation from a JSON string
fhir_person_association_instance = FhirPersonAssociation.from_json(json)
# print the JSON string representation of the object
print(FhirPersonAssociation.to_json())

# convert the object into a dict
fhir_person_association_dict = fhir_person_association_instance.to_dict()
# create an instance of FhirPersonAssociation from a dict
fhir_person_association_from_dict = FhirPersonAssociation.from_dict(fhir_person_association_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


