# GetMonitoringOauthHealth200ResponseNetwork


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** |  | 
**throughput** | **str** |  | 
**error_rate** | **float** |  | 

## Example

```python
from api_client.models.get_monitoring_oauth_health200_response_network import GetMonitoringOauthHealth200ResponseNetwork

# TODO update the JSON string below
json = "{}"
# create an instance of GetMonitoringOauthHealth200ResponseNetwork from a JSON string
get_monitoring_oauth_health200_response_network_instance = GetMonitoringOauthHealth200ResponseNetwork.from_json(json)
# print the JSON string representation of the object
print(GetMonitoringOauthHealth200ResponseNetwork.to_json())

# convert the object into a dict
get_monitoring_oauth_health200_response_network_dict = get_monitoring_oauth_health200_response_network_instance.to_dict()
# create an instance of GetMonitoringOauthHealth200ResponseNetwork from a dict
get_monitoring_oauth_health200_response_network_from_dict = GetMonitoringOauthHealth200ResponseNetwork.from_dict(get_monitoring_oauth_health200_response_network_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


