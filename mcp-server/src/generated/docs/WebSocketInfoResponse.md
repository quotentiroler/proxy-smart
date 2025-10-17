# WebSocketInfoResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**endpoint** | **str** | WebSocket endpoint URL path | 
**protocol** | **str** | Protocol (ws or wss) | 
**supported_messages** | **List[str]** | Supported message types | 
**subscription_types** | **List[str]** | Available subscription types | 

## Example

```python
from api_client.models.web_socket_info_response import WebSocketInfoResponse

# TODO update the JSON string below
json = "{}"
# create an instance of WebSocketInfoResponse from a JSON string
web_socket_info_response_instance = WebSocketInfoResponse.from_json(json)
# print the JSON string representation of the object
print(WebSocketInfoResponse.to_json())

# convert the object into a dict
web_socket_info_response_dict = web_socket_info_response_instance.to_dict()
# create an instance of WebSocketInfoResponse from a dict
web_socket_info_response_from_dict = WebSocketInfoResponse.from_dict(web_socket_info_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


