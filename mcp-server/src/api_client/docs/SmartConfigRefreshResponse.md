# SmartConfigRefreshResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**message** | **str** | Refresh status message | 
**timestamp** | **str** | Timestamp of refresh | 
**config** | **Dict[str, object]** | Refreshed SMART configuration | 

## Example

```python
from api_client.models.smart_config_refresh_response import SmartConfigRefreshResponse

# TODO update the JSON string below
json = "{}"
# create an instance of SmartConfigRefreshResponse from a JSON string
smart_config_refresh_response_instance = SmartConfigRefreshResponse.from_json(json)
# print the JSON string representation of the object
print(SmartConfigRefreshResponse.to_json())

# convert the object into a dict
smart_config_refresh_response_dict = smart_config_refresh_response_instance.to_dict()
# create an instance of SmartConfigRefreshResponse from a dict
smart_config_refresh_response_from_dict = SmartConfigRefreshResponse.from_dict(smart_config_refresh_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


