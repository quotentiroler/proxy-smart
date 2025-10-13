# GetMonitoringOauthEvents200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**events** | [**List[GetMonitoringOauthEvents200ResponseEventsInner]**](GetMonitoringOauthEvents200ResponseEventsInner.md) |  | 
**total** | **float** |  | 
**timestamp** | **str** |  | 

## Example

```python
from api_client.models.get_monitoring_oauth_events200_response import GetMonitoringOauthEvents200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetMonitoringOauthEvents200Response from a JSON string
get_monitoring_oauth_events200_response_instance = GetMonitoringOauthEvents200Response.from_json(json)
# print the JSON string representation of the object
print(GetMonitoringOauthEvents200Response.to_json())

# convert the object into a dict
get_monitoring_oauth_events200_response_dict = get_monitoring_oauth_events200_response_instance.to_dict()
# create an instance of GetMonitoringOauthEvents200Response from a dict
get_monitoring_oauth_events200_response_from_dict = GetMonitoringOauthEvents200Response.from_dict(get_monitoring_oauth_events200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


