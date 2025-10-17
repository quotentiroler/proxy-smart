# GetMonitoringOauthHealth200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**oauth_server** | [**GetMonitoringOauthHealth200ResponseOauthServer**](GetMonitoringOauthHealth200ResponseOauthServer.md) |  | 
**token_store** | [**GetMonitoringOauthHealth200ResponseTokenStore**](GetMonitoringOauthHealth200ResponseTokenStore.md) |  | 
**network** | [**GetMonitoringOauthHealth200ResponseNetwork**](GetMonitoringOauthHealth200ResponseNetwork.md) |  | 
**alerts** | [**List[GetMonitoringOauthHealth200ResponseAlertsInner]**](GetMonitoringOauthHealth200ResponseAlertsInner.md) |  | 
**timestamp** | **str** |  | 

## Example

```python
from api_client.models.get_monitoring_oauth_health200_response import GetMonitoringOauthHealth200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetMonitoringOauthHealth200Response from a JSON string
get_monitoring_oauth_health200_response_instance = GetMonitoringOauthHealth200Response.from_json(json)
# print the JSON string representation of the object
print(GetMonitoringOauthHealth200Response.to_json())

# convert the object into a dict
get_monitoring_oauth_health200_response_dict = get_monitoring_oauth_health200_response_instance.to_dict()
# create an instance of GetMonitoringOauthHealth200Response from a dict
get_monitoring_oauth_health200_response_from_dict = GetMonitoringOauthHealth200Response.from_dict(get_monitoring_oauth_health200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


