# GetMonitoringOauthAnalytics200ResponseHourlyStatsInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**hour** | **str** |  | 
**success** | **float** |  | 
**error** | **float** |  | 
**total** | **float** |  | 

## Example

```python
from api_client.models.get_monitoring_oauth_analytics200_response_hourly_stats_inner import GetMonitoringOauthAnalytics200ResponseHourlyStatsInner

# TODO update the JSON string below
json = "{}"
# create an instance of GetMonitoringOauthAnalytics200ResponseHourlyStatsInner from a JSON string
get_monitoring_oauth_analytics200_response_hourly_stats_inner_instance = GetMonitoringOauthAnalytics200ResponseHourlyStatsInner.from_json(json)
# print the JSON string representation of the object
print(GetMonitoringOauthAnalytics200ResponseHourlyStatsInner.to_json())

# convert the object into a dict
get_monitoring_oauth_analytics200_response_hourly_stats_inner_dict = get_monitoring_oauth_analytics200_response_hourly_stats_inner_instance.to_dict()
# create an instance of GetMonitoringOauthAnalytics200ResponseHourlyStatsInner from a dict
get_monitoring_oauth_analytics200_response_hourly_stats_inner_from_dict = GetMonitoringOauthAnalytics200ResponseHourlyStatsInner.from_dict(get_monitoring_oauth_analytics200_response_hourly_stats_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


