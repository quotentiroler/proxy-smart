# MonitoringHealthResponseNetwork


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** | Network status | 
**throughput** | **str** | Requests per minute | 
**error_rate** | **float** | Error rate percentage | 

## Example

```python
from api_client.models.monitoring_health_response_network import MonitoringHealthResponseNetwork

# TODO update the JSON string below
json = "{}"
# create an instance of MonitoringHealthResponseNetwork from a JSON string
monitoring_health_response_network_instance = MonitoringHealthResponseNetwork.from_json(json)
# print the JSON string representation of the object
print(MonitoringHealthResponseNetwork.to_json())

# convert the object into a dict
monitoring_health_response_network_dict = monitoring_health_response_network_instance.to_dict()
# create an instance of MonitoringHealthResponseNetwork from a dict
monitoring_health_response_network_from_dict = MonitoringHealthResponseNetwork.from_dict(monitoring_health_response_network_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


