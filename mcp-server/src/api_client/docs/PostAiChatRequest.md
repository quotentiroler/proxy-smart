# PostAiChatRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**message** | **str** | User question or prompt for the AI assistant | 
**conversation_id** | **str** | Optional conversation identifier to maintain context between turns | [optional] 
**page_context** | **str** | Optional page context with visible content, forms, buttons, and current section from the user&#39;s current page | [optional] 

## Example

```python
from api_client.models.post_ai_chat_request import PostAiChatRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostAiChatRequest from a JSON string
post_ai_chat_request_instance = PostAiChatRequest.from_json(json)
# print the JSON string representation of the object
print(PostAiChatRequest.to_json())

# convert the object into a dict
post_ai_chat_request_dict = post_ai_chat_request_instance.to_dict()
# create an instance of PostAiChatRequest from a dict
post_ai_chat_request_from_dict = PostAiChatRequest.from_dict(post_ai_chat_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


