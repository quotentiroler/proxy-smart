# SetFhirContextRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**fhir_context** | **str** | Additional FHIR resources in context (JSON array of objects) | 

## Example

```python
from api_client.models.set_fhir_context_request import SetFhirContextRequest

# TODO update the JSON string below
json = "{}"
# create an instance of SetFhirContextRequest from a JSON string
set_fhir_context_request_instance = SetFhirContextRequest.from_json(json)
# print the JSON string representation of the object
print(SetFhirContextRequest.to_json())

# convert the object into a dict
set_fhir_context_request_dict = set_fhir_context_request_instance.to_dict()
# create an instance of SetFhirContextRequest from a dict
set_fhir_context_request_from_dict = SetFhirContextRequest.from_dict(set_fhir_context_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


