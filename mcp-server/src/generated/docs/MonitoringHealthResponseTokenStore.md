# MonitoringHealthResponseTokenStore


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** | Token store status | 
**active_tokens** | **float** | Number of active tokens | 
**storage_used** | **float** | Storage used percentage | 

## Example

```python
from api_client.models.monitoring_health_response_token_store import MonitoringHealthResponseTokenStore

# TODO update the JSON string below
json = "{}"
# create an instance of MonitoringHealthResponseTokenStore from a JSON string
monitoring_health_response_token_store_instance = MonitoringHealthResponseTokenStore.from_json(json)
# print the JSON string representation of the object
print(MonitoringHealthResponseTokenStore.to_json())

# convert the object into a dict
monitoring_health_response_token_store_dict = monitoring_health_response_token_store_instance.to_dict()
# create an instance of MonitoringHealthResponseTokenStore from a dict
monitoring_health_response_token_store_from_dict = MonitoringHealthResponseTokenStore.from_dict(monitoring_health_response_token_store_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


