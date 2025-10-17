# MonitoringHealthResponseOauthServer


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** | OAuth server status | 
**uptime** | **float** | Server uptime in seconds | 
**response_time** | **float** | Average response time in ms | 

## Example

```python
from api_client.models.monitoring_health_response_oauth_server import MonitoringHealthResponseOauthServer

# TODO update the JSON string below
json = "{}"
# create an instance of MonitoringHealthResponseOauthServer from a JSON string
monitoring_health_response_oauth_server_instance = MonitoringHealthResponseOauthServer.from_json(json)
# print the JSON string representation of the object
print(MonitoringHealthResponseOauthServer.to_json())

# convert the object into a dict
monitoring_health_response_oauth_server_dict = monitoring_health_response_oauth_server_instance.to_dict()
# create an instance of MonitoringHealthResponseOauthServer from a dict
monitoring_health_response_oauth_server_from_dict = MonitoringHealthResponseOauthServer.from_dict(monitoring_health_response_oauth_server_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


