# UserInfoErrorResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**error** | **str** | Error message | 

## Example

```python
from api_client.models.user_info_error_response import UserInfoErrorResponse

# TODO update the JSON string below
json = "{}"
# create an instance of UserInfoErrorResponse from a JSON string
user_info_error_response_instance = UserInfoErrorResponse.from_json(json)
# print the JSON string representation of the object
print(UserInfoErrorResponse.to_json())

# convert the object into a dict
user_info_error_response_dict = user_info_error_response_instance.to_dict()
# create an instance of UserInfoErrorResponse from a dict
user_info_error_response_from_dict = UserInfoErrorResponse.from_dict(user_info_error_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


