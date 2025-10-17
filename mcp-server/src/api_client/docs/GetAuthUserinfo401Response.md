# GetAuthUserinfo401Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**error** | **str** | Error message | 

## Example

```python
from api_client.models.get_auth_userinfo401_response import GetAuthUserinfo401Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetAuthUserinfo401Response from a JSON string
get_auth_userinfo401_response_instance = GetAuthUserinfo401Response.from_json(json)
# print the JSON string representation of the object
print(GetAuthUserinfo401Response.to_json())

# convert the object into a dict
get_auth_userinfo401_response_dict = get_auth_userinfo401_response_instance.to_dict()
# create an instance of GetAuthUserinfo401Response from a dict
get_auth_userinfo401_response_from_dict = GetAuthUserinfo401Response.from_dict(get_auth_userinfo401_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


