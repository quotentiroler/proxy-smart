# GetAuthConfig200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**keycloak** | [**GetAuthConfig200ResponseKeycloak**](GetAuthConfig200ResponseKeycloak.md) |  | 

## Example

```python
from api_client.models.get_auth_config200_response import GetAuthConfig200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetAuthConfig200Response from a JSON string
get_auth_config200_response_instance = GetAuthConfig200Response.from_json(json)
# print the JSON string representation of the object
print(GetAuthConfig200Response.to_json())

# convert the object into a dict
get_auth_config200_response_dict = get_auth_config200_response_instance.to_dict()
# create an instance of GetAuthConfig200Response from a dict
get_auth_config200_response_from_dict = GetAuthConfig200Response.from_dict(get_auth_config200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


