# GetAuthUserinfo200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | User ID | 
**fhir_user** | **str** | FHIR user resource reference (e.g., Practitioner/123) | [optional] 
**name** | [**List[GetAuthUserinfo200ResponseNameInner]**](GetAuthUserinfo200ResponseNameInner.md) |  | 
**username** | **str** | Username | 
**email** | **str** | Email address | [optional] 
**first_name** | **str** | First name | [optional] 
**last_name** | **str** | Last name | [optional] 
**roles** | **List[str]** |  | 

## Example

```python
from api_client.models.get_auth_userinfo200_response import GetAuthUserinfo200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetAuthUserinfo200Response from a JSON string
get_auth_userinfo200_response_instance = GetAuthUserinfo200Response.from_json(json)
# print the JSON string representation of the object
print(GetAuthUserinfo200Response.to_json())

# convert the object into a dict
get_auth_userinfo200_response_dict = get_auth_userinfo200_response_instance.to_dict()
# create an instance of GetAuthUserinfo200Response from a dict
get_auth_userinfo200_response_from_dict = GetAuthUserinfo200Response.from_dict(get_auth_userinfo200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


