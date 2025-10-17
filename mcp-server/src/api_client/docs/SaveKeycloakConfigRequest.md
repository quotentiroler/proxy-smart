# SaveKeycloakConfigRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base_url** | **str** | Keycloak base URL | 
**realm** | **str** | Keycloak realm name | 
**admin_client_id** | **str** | Admin client ID for API access | [optional] 
**admin_client_secret** | **str** | Admin client secret for API access | [optional] 

## Example

```python
from api_client.models.save_keycloak_config_request import SaveKeycloakConfigRequest

# TODO update the JSON string below
json = "{}"
# create an instance of SaveKeycloakConfigRequest from a JSON string
save_keycloak_config_request_instance = SaveKeycloakConfigRequest.from_json(json)
# print the JSON string representation of the object
print(SaveKeycloakConfigRequest.to_json())

# convert the object into a dict
save_keycloak_config_request_dict = save_keycloak_config_request_instance.to_dict()
# create an instance of SaveKeycloakConfigRequest from a dict
save_keycloak_config_request_from_dict = SaveKeycloakConfigRequest.from_dict(save_keycloak_config_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


