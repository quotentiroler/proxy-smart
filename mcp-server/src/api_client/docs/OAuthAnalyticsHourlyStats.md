# OAuthAnalyticsHourlyStats


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**hour** | **str** | Hour timestamp (ISO 8601) | 
**success** | **float** | Successful requests | 
**error** | **float** | Failed requests | 
**total** | **float** | Total requests | 

## Example

```python
from api_client.models.o_auth_analytics_hourly_stats import OAuthAnalyticsHourlyStats

# TODO update the JSON string below
json = "{}"
# create an instance of OAuthAnalyticsHourlyStats from a JSON string
o_auth_analytics_hourly_stats_instance = OAuthAnalyticsHourlyStats.from_json(json)
# print the JSON string representation of the object
print(OAuthAnalyticsHourlyStats.to_json())

# convert the object into a dict
o_auth_analytics_hourly_stats_dict = o_auth_analytics_hourly_stats_instance.to_dict()
# create an instance of OAuthAnalyticsHourlyStats from a dict
o_auth_analytics_hourly_stats_from_dict = OAuthAnalyticsHourlyStats.from_dict(o_auth_analytics_hourly_stats_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


