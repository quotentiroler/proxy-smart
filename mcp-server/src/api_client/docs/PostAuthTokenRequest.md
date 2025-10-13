# PostAuthTokenRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**grant_type** | **str** | OAuth grant type (e.g., authorization_code, client_credentials, password) | 
**code** | **str** | Authorization code for exchange | [optional] 
**redirect_uri** | **str** | Redirect URI for authorization code flow | [optional] 
**client_id** | **str** | OAuth client ID | [optional] 
**client_secret** | **str** | OAuth client secret | [optional] 
**code_verifier** | **str** | PKCE code verifier for security | [optional] 
**refresh_token** | **str** | Refresh token for refresh_token grant | [optional] 
**scope** | **str** | Requested scopes | [optional] 
**audience** | **str** | Audience for the token request | [optional] 
**username** | **str** | Username for password grant | [optional] 
**password** | **str** | Password for password grant | [optional] 
**client_assertion_type** | **str** | Client assertion type for JWT authentication | [optional] 
**client_assertion** | **str** | Client assertion JWT for Backend Services authentication | [optional] 

## Example

```python
from api_client.models.post_auth_token_request import PostAuthTokenRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostAuthTokenRequest from a JSON string
post_auth_token_request_instance = PostAuthTokenRequest.from_json(json)
# print the JSON string representation of the object
print(PostAuthTokenRequest.to_json())

# convert the object into a dict
post_auth_token_request_dict = post_auth_token_request_instance.to_dict()
# create an instance of PostAuthTokenRequest from a dict
post_auth_token_request_from_dict = PostAuthTokenRequest.from_dict(post_auth_token_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


