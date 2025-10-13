# PostAuthIntrospect200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**active** | **bool** | Whether token is active | 
**sub** | **str** | Subject (user ID) | [optional] 
**aud** | **str** | Audience | [optional] 
**exp** | **float** | Expiration timestamp | [optional] 
**scope** | **str** | Token scopes | [optional] 

## Example

```python
from api_client.models.post_auth_introspect200_response import PostAuthIntrospect200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostAuthIntrospect200Response from a JSON string
post_auth_introspect200_response_instance = PostAuthIntrospect200Response.from_json(json)
# print the JSON string representation of the object
print(PostAuthIntrospect200Response.to_json())

# convert the object into a dict
post_auth_introspect200_response_dict = post_auth_introspect200_response_instance.to_dict()
# create an instance of PostAuthIntrospect200Response from a dict
post_auth_introspect200_response_from_dict = PostAuthIntrospect200Response.from_dict(post_auth_introspect200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


