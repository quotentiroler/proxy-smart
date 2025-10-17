# IntrospectRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**token** | **str** | Token to introspect | 
**token_type_hint** | **str** | Hint about token type (access_token, refresh_token) | [optional] 
**client_id** | **str** | OAuth2 client ID | [optional] 
**client_secret** | **str** | OAuth2 client secret | [optional] 

## Example

```python
from api_client.models.introspect_request import IntrospectRequest

# TODO update the JSON string below
json = "{}"
# create an instance of IntrospectRequest from a JSON string
introspect_request_instance = IntrospectRequest.from_json(json)
# print the JSON string representation of the object
print(IntrospectRequest.to_json())

# convert the object into a dict
introspect_request_dict = introspect_request_instance.to_dict()
# create an instance of IntrospectRequest from a dict
introspect_request_from_dict = IntrospectRequest.from_dict(introspect_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


