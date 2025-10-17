# GetMonitoringOauthHealth200ResponseTokenStore


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** |  | 
**active_tokens** | **float** |  | 
**storage_used** | **float** |  | 

## Example

```python
from api_client.models.get_monitoring_oauth_health200_response_token_store import GetMonitoringOauthHealth200ResponseTokenStore

# TODO update the JSON string below
json = "{}"
# create an instance of GetMonitoringOauthHealth200ResponseTokenStore from a JSON string
get_monitoring_oauth_health200_response_token_store_instance = GetMonitoringOauthHealth200ResponseTokenStore.from_json(json)
# print the JSON string representation of the object
print(GetMonitoringOauthHealth200ResponseTokenStore.to_json())

# convert the object into a dict
get_monitoring_oauth_health200_response_token_store_dict = get_monitoring_oauth_health200_response_token_store_instance.to_dict()
# create an instance of GetMonitoringOauthHealth200ResponseTokenStore from a dict
get_monitoring_oauth_health200_response_token_store_from_dict = GetMonitoringOauthHealth200ResponseTokenStore.from_dict(get_monitoring_oauth_health200_response_token_store_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


