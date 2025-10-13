# PostAuthRegisterRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**redirect_uris** | **List[str]** |  | 
**client_name** | **str** |  | [optional] 
**client_uri** | **str** |  | [optional] 
**logo_uri** | **str** |  | [optional] 
**scope** | **str** |  | [optional] 
**contacts** | **List[str]** |  | [optional] 
**tos_uri** | **str** |  | [optional] 
**policy_uri** | **str** |  | [optional] 
**jwks_uri** | **str** |  | [optional] 
**jwks** | **object** |  | [optional] 
**software_id** | **str** |  | [optional] 
**software_version** | **str** |  | [optional] 
**fhir_versions** | **List[str]** |  | [optional] 
**launch_uris** | **List[str]** |  | [optional] 

## Example

```python
from api_client.models.post_auth_register_request import PostAuthRegisterRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostAuthRegisterRequest from a JSON string
post_auth_register_request_instance = PostAuthRegisterRequest.from_json(json)
# print the JSON string representation of the object
print(PostAuthRegisterRequest.to_json())

# convert the object into a dict
post_auth_register_request_dict = post_auth_register_request_instance.to_dict()
# create an instance of PostAuthRegisterRequest from a dict
post_auth_register_request_from_dict = PostAuthRegisterRequest.from_dict(post_auth_register_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


