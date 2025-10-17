# KeycloakConfigResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base_url** | **str** |  | 
**realm** | **str** |  | 
**has_admin_client** | **bool** | Whether admin client credentials are configured | 
**admin_client_id** | **str** |  | 

## Example

```python
from api_client.models.keycloak_config_response import KeycloakConfigResponse

# TODO update the JSON string below
json = "{}"
# create an instance of KeycloakConfigResponse from a JSON string
keycloak_config_response_instance = KeycloakConfigResponse.from_json(json)
# print the JSON string representation of the object
print(KeycloakConfigResponse.to_json())

# convert the object into a dict
keycloak_config_response_dict = keycloak_config_response_instance.to_dict()
# create an instance of KeycloakConfigResponse from a dict
keycloak_config_response_from_dict = KeycloakConfigResponse.from_dict(keycloak_config_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


