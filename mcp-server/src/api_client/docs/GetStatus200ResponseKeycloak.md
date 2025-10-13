# GetStatus200ResponseKeycloak


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** |  | 
**accessible** | **bool** |  | 
**realm** | **str** |  | 
**last_connected** | **str** |  | [optional] 

## Example

```python
from api_client.models.get_status200_response_keycloak import GetStatus200ResponseKeycloak

# TODO update the JSON string below
json = "{}"
# create an instance of GetStatus200ResponseKeycloak from a JSON string
get_status200_response_keycloak_instance = GetStatus200ResponseKeycloak.from_json(json)
# print the JSON string representation of the object
print(GetStatus200ResponseKeycloak.to_json())

# convert the object into a dict
get_status200_response_keycloak_dict = get_status200_response_keycloak_instance.to_dict()
# create an instance of GetStatus200ResponseKeycloak from a dict
get_status200_response_keycloak_from_dict = GetStatus200ResponseKeycloak.from_dict(get_status200_response_keycloak_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


