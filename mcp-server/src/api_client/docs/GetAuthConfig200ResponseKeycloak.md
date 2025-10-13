# GetAuthConfig200ResponseKeycloak


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**is_configured** | **bool** |  | 
**base_url** | **str** |  | 
**realm** | **str** |  | 
**authorization_endpoint** | **str** |  | 
**token_endpoint** | **str** |  | 

## Example

```python
from api_client.models.get_auth_config200_response_keycloak import GetAuthConfig200ResponseKeycloak

# TODO update the JSON string below
json = "{}"
# create an instance of GetAuthConfig200ResponseKeycloak from a JSON string
get_auth_config200_response_keycloak_instance = GetAuthConfig200ResponseKeycloak.from_json(json)
# print the JSON string representation of the object
print(GetAuthConfig200ResponseKeycloak.to_json())

# convert the object into a dict
get_auth_config200_response_keycloak_dict = get_auth_config200_response_keycloak_instance.to_dict()
# create an instance of GetAuthConfig200ResponseKeycloak from a dict
get_auth_config200_response_keycloak_from_dict = GetAuthConfig200ResponseKeycloak.from_dict(get_auth_config200_response_keycloak_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


