# IntrospectResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**active** | **bool** | Whether the token is active | 
**sub** | **str** | Subject (user ID) of the token | [optional] 
**aud** | **str** | Audience (intended recipient) | [optional] 
**exp** | **float** | Expiration time (Unix timestamp) | [optional] 
**scope** | **str** | Granted scopes (space-separated) | [optional] 

## Example

```python
from api_client.models.introspect_response import IntrospectResponse

# TODO update the JSON string below
json = "{}"
# create an instance of IntrospectResponse from a JSON string
introspect_response_instance = IntrospectResponse.from_json(json)
# print the JSON string representation of the object
print(IntrospectResponse.to_json())

# convert the object into a dict
introspect_response_dict = introspect_response_instance.to_dict()
# create an instance of IntrospectResponse from a dict
introspect_response_from_dict = IntrospectResponse.from_dict(introspect_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


