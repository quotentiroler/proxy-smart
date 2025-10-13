# PostAuthToken200ResponseAuthorizationDetailsInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **str** | Authorization details type (smart_on_fhir) | 
**locations** | **List[str]** |  | 
**fhir_versions** | **List[str]** |  | 
**scope** | **str** | Space-separated SMART scopes for these locations | [optional] 
**patient** | **str** | Patient context for these locations | [optional] 
**encounter** | **str** | Encounter context for these locations | [optional] 
**fhir_context** | [**List[PostAuthToken200ResponseFhirContextInner]**](PostAuthToken200ResponseFhirContextInner.md) | FHIR context for these locations | [optional] 

## Example

```python
from api_client.models.post_auth_token200_response_authorization_details_inner import PostAuthToken200ResponseAuthorizationDetailsInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostAuthToken200ResponseAuthorizationDetailsInner from a JSON string
post_auth_token200_response_authorization_details_inner_instance = PostAuthToken200ResponseAuthorizationDetailsInner.from_json(json)
# print the JSON string representation of the object
print(PostAuthToken200ResponseAuthorizationDetailsInner.to_json())

# convert the object into a dict
post_auth_token200_response_authorization_details_inner_dict = post_auth_token200_response_authorization_details_inner_instance.to_dict()
# create an instance of PostAuthToken200ResponseAuthorizationDetailsInner from a dict
post_auth_token200_response_authorization_details_inner_from_dict = PostAuthToken200ResponseAuthorizationDetailsInner.from_dict(post_auth_token200_response_authorization_details_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


