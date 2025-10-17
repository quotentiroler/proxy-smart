# SaveKeycloakConfigResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the configuration was saved successfully | 
**message** | **str** | Success message | [optional] 
**error** | **str** | Error message if save failed | [optional] 
**restart_required** | **bool** | Whether a service restart is required | [optional] 

## Example

```python
from api_client.models.save_keycloak_config_response import SaveKeycloakConfigResponse

# TODO update the JSON string below
json = "{}"
# create an instance of SaveKeycloakConfigResponse from a JSON string
save_keycloak_config_response_instance = SaveKeycloakConfigResponse.from_json(json)
# print the JSON string representation of the object
print(SaveKeycloakConfigResponse.to_json())

# convert the object into a dict
save_keycloak_config_response_dict = save_keycloak_config_response_instance.to_dict()
# create an instance of SaveKeycloakConfigResponse from a dict
save_keycloak_config_response_from_dict = SaveKeycloakConfigResponse.from_dict(save_keycloak_config_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


