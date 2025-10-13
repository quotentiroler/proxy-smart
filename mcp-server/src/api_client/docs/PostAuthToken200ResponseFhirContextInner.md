# PostAuthToken200ResponseFhirContextInner


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
from api_client.models.post_auth_token200_response_fhir_context_inner import PostAuthToken200ResponseFhirContextInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostAuthToken200ResponseFhirContextInner from a JSON string
post_auth_token200_response_fhir_context_inner_instance = PostAuthToken200ResponseFhirContextInner.from_json(json)
# print the JSON string representation of the object
print(PostAuthToken200ResponseFhirContextInner.to_json())

# convert the object into a dict
post_auth_token200_response_fhir_context_inner_dict = post_auth_token200_response_fhir_context_inner_instance.to_dict()
# create an instance of PostAuthToken200ResponseFhirContextInner from a dict
post_auth_token200_response_fhir_context_inner_from_dict = PostAuthToken200ResponseFhirContextInner.from_dict(post_auth_token200_response_fhir_context_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


