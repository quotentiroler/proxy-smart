# TokenRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**grant_type** | **str** | OAuth2 grant type (authorization_code, refresh_token, client_credentials, password) | 
**code** | **str** | Authorization code (for authorization_code grant) | [optional] 
**redirect_uri** | **str** | Redirect URI used in authorization request | [optional] 
**client_id** | **str** | OAuth2 client ID | [optional] 
**client_secret** | **str** | OAuth2 client secret | [optional] 
**code_verifier** | **str** | PKCE code verifier | [optional] 
**refresh_token** | **str** | Refresh token (for refresh_token grant) | [optional] 
**scope** | **str** | Requested scopes (space-separated) | [optional] 
**audience** | **str** | Target audience for the token | [optional] 
**username** | **str** | Username (for password grant) | [optional] 
**password** | **str** | Password (for password grant) | [optional] 
**client_assertion_type** | **str** | Client assertion type for JWT authentication | [optional] 
**client_assertion** | **str** | Client assertion JWT for authentication | [optional] 

## Example

```python
from api_client.models.token_request import TokenRequest

# TODO update the JSON string below
json = "{}"
# create an instance of TokenRequest from a JSON string
token_request_instance = TokenRequest.from_json(json)
# print the JSON string representation of the object
print(TokenRequest.to_json())

# convert the object into a dict
token_request_dict = token_request_instance.to_dict()
# create an instance of TokenRequest from a dict
token_request_from_dict = TokenRequest.from_dict(token_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


