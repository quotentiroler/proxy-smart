# GetOauthMonitoringWebsocketInfo200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**endpoint** | **str** |  | 
**protocol** | **str** |  | 
**supported_messages** | **List[str]** |  | 
**subscription_types** | **List[str]** |  | 

## Example

```python
from api_client.models.get_oauth_monitoring_websocket_info200_response import GetOauthMonitoringWebsocketInfo200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetOauthMonitoringWebsocketInfo200Response from a JSON string
get_oauth_monitoring_websocket_info200_response_instance = GetOauthMonitoringWebsocketInfo200Response.from_json(json)
# print the JSON string representation of the object
print(GetOauthMonitoringWebsocketInfo200Response.to_json())

# convert the object into a dict
get_oauth_monitoring_websocket_info200_response_dict = get_oauth_monitoring_websocket_info200_response_instance.to_dict()
# create an instance of GetOauthMonitoringWebsocketInfo200Response from a dict
get_oauth_monitoring_websocket_info200_response_from_dict = GetOauthMonitoringWebsocketInfo200Response.from_dict(get_oauth_monitoring_websocket_info200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


