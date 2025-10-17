# UserInfoResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | User ID | 
**fhir_user** | **str** | FHIR user resource reference (e.g., Practitioner/123) | [optional] 
**name** | [**List[UserName]**](UserName.md) |  | 
**username** | **str** | Username | 
**email** | **str** | Email address | [optional] 
**first_name** | **str** | First name | [optional] 
**last_name** | **str** | Last name | [optional] 
**roles** | **List[str]** |  | 

## Example

```python
from api_client.models.user_info_response import UserInfoResponse

# TODO update the JSON string below
json = "{}"
# create an instance of UserInfoResponse from a JSON string
user_info_response_instance = UserInfoResponse.from_json(json)
# print the JSON string representation of the object
print(UserInfoResponse.to_json())

# convert the object into a dict
user_info_response_dict = user_info_response_instance.to_dict()
# create an instance of UserInfoResponse from a dict
user_info_response_from_dict = UserInfoResponse.from_dict(user_info_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


