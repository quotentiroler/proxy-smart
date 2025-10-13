# GetMonitoringOauthAnalytics200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total_flows** | **float** |  | 
**success_rate** | **float** |  | 
**average_response_time** | **float** |  | 
**active_tokens** | **float** |  | 
**top_clients** | [**List[GetMonitoringOauthAnalytics200ResponseTopClientsInner]**](GetMonitoringOauthAnalytics200ResponseTopClientsInner.md) |  | 
**flows_by_type** | **object** |  | 
**errors_by_type** | **object** |  | 
**hourly_stats** | [**List[GetMonitoringOauthAnalytics200ResponseHourlyStatsInner]**](GetMonitoringOauthAnalytics200ResponseHourlyStatsInner.md) |  | 
**timestamp** | **str** |  | 

## Example

```python
from api_client.models.get_monitoring_oauth_analytics200_response import GetMonitoringOauthAnalytics200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetMonitoringOauthAnalytics200Response from a JSON string
get_monitoring_oauth_analytics200_response_instance = GetMonitoringOauthAnalytics200Response.from_json(json)
# print the JSON string representation of the object
print(GetMonitoringOauthAnalytics200Response.to_json())

# convert the object into a dict
get_monitoring_oauth_analytics200_response_dict = get_monitoring_oauth_analytics200_response_instance.to_dict()
# create an instance of GetMonitoringOauthAnalytics200Response from a dict
get_monitoring_oauth_analytics200_response_from_dict = GetMonitoringOauthAnalytics200Response.from_dict(get_monitoring_oauth_analytics200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


