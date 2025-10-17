# MonitoringHealthResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**oauth_server** | [**MonitoringHealthResponseOauthServer**](MonitoringHealthResponseOauthServer.md) |  | 
**token_store** | [**MonitoringHealthResponseTokenStore**](MonitoringHealthResponseTokenStore.md) |  | 
**network** | [**MonitoringHealthResponseNetwork**](MonitoringHealthResponseNetwork.md) |  | 
**alerts** | [**List[AlertInfo]**](AlertInfo.md) | System alerts | 
**timestamp** | **str** | Timestamp (ISO 8601) | 

## Example

```python
from api_client.models.monitoring_health_response import MonitoringHealthResponse

# TODO update the JSON string below
json = "{}"
# create an instance of MonitoringHealthResponse from a JSON string
monitoring_health_response_instance = MonitoringHealthResponse.from_json(json)
# print the JSON string representation of the object
print(MonitoringHealthResponse.to_json())

# convert the object into a dict
monitoring_health_response_dict = monitoring_health_response_instance.to_dict()
# create an instance of MonitoringHealthResponse from a dict
monitoring_health_response_from_dict = MonitoringHealthResponse.from_dict(monitoring_health_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


