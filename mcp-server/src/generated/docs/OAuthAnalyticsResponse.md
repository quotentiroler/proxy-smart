# OAuthAnalyticsResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**total_requests** | **float** | Total requests in period | 
**successful_requests** | **float** | Successful requests | 
**failed_requests** | **float** | Failed requests | 
**success_rate** | **float** | Success rate percentage | 
**average_response_time** | **float** | Average response time in ms | 
**active_tokens** | **float** | Currently active tokens | 
**top_clients** | [**List[OAuthAnalyticsTopClient]**](OAuthAnalyticsTopClient.md) | Top OAuth clients by request count | 
**flows_by_type** | **object** | OAuth flows by type | 
**errors_by_type** | **object** | Errors by type | 
**hourly_stats** | [**List[OAuthAnalyticsHourlyStats]**](OAuthAnalyticsHourlyStats.md) | Hourly statistics | 
**timestamp** | **str** | Response timestamp | 

## Example

```python
from api_client.models.o_auth_analytics_response import OAuthAnalyticsResponse

# TODO update the JSON string below
json = "{}"
# create an instance of OAuthAnalyticsResponse from a JSON string
o_auth_analytics_response_instance = OAuthAnalyticsResponse.from_json(json)
# print the JSON string representation of the object
print(OAuthAnalyticsResponse.to_json())

# convert the object into a dict
o_auth_analytics_response_dict = o_auth_analytics_response_instance.to_dict()
# create an instance of OAuthAnalyticsResponse from a dict
o_auth_analytics_response_from_dict = OAuthAnalyticsResponse.from_dict(o_auth_analytics_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


