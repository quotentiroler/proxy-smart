# PostAuthIntrospectRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**token** | **str** | The token to introspect | 
**token_type_hint** | **str** | Hint about the token type (access_token, refresh_token) | [optional] 
**client_id** | **str** | OAuth client ID | [optional] 
**client_secret** | **str** | OAuth client secret | [optional] 

## Example

```python
from api_client.models.post_auth_introspect_request import PostAuthIntrospectRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostAuthIntrospectRequest from a JSON string
post_auth_introspect_request_instance = PostAuthIntrospectRequest.from_json(json)
# print the JSON string representation of the object
print(PostAuthIntrospectRequest.to_json())

# convert the object into a dict
post_auth_introspect_request_dict = post_auth_introspect_request_instance.to_dict()
# create an instance of PostAuthIntrospectRequest from a dict
post_auth_introspect_request_from_dict = PostAuthIntrospectRequest.from_dict(post_auth_introspect_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


