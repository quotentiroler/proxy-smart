# AuthorizationDetail


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **str** | Authorization details type (smart_on_fhir) | 
**locations** | **List[str]** |  | 
**fhir_versions** | **List[str]** |  | 
**scope** | **str** | Space-separated SMART scopes for these locations | [optional] 
**patient** | **str** | Patient context for these locations | [optional] 
**encounter** | **str** | Encounter context for these locations | [optional] 
**fhir_context** | [**List[FhirContextItem]**](FhirContextItem.md) | FHIR context for these locations | [optional] 

## Example

```python
from api_client.models.authorization_detail import AuthorizationDetail

# TODO update the JSON string below
json = "{}"
# create an instance of AuthorizationDetail from a JSON string
authorization_detail_instance = AuthorizationDetail.from_json(json)
# print the JSON string representation of the object
print(AuthorizationDetail.to_json())

# convert the object into a dict
authorization_detail_dict = authorization_detail_instance.to_dict()
# create an instance of AuthorizationDetail from a dict
authorization_detail_from_dict = AuthorizationDetail.from_dict(authorization_detail_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


