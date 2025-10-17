# GetMonitoringOauthHealth200ResponseOauthServer


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** |  | 
**uptime** | **float** |  | 
**response_time** | **float** |  | 

## Example

```python
from api_client.models.get_monitoring_oauth_health200_response_oauth_server import GetMonitoringOauthHealth200ResponseOauthServer

# TODO update the JSON string below
json = "{}"
# create an instance of GetMonitoringOauthHealth200ResponseOauthServer from a JSON string
get_monitoring_oauth_health200_response_oauth_server_instance = GetMonitoringOauthHealth200ResponseOauthServer.from_json(json)
# print the JSON string representation of the object
print(GetMonitoringOauthHealth200ResponseOauthServer.to_json())

# convert the object into a dict
get_monitoring_oauth_health200_response_oauth_server_dict = get_monitoring_oauth_health200_response_oauth_server_instance.to_dict()
# create an instance of GetMonitoringOauthHealth200ResponseOauthServer from a dict
get_monitoring_oauth_health200_response_oauth_server_from_dict = GetMonitoringOauthHealth200ResponseOauthServer.from_dict(get_monitoring_oauth_health200_response_oauth_server_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


