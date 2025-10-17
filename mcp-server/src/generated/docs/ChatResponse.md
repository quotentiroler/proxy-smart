# ChatResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**answer** | **str** | AI-generated answer | 
**sources** | [**List[DocumentChunk]**](DocumentChunk.md) | Source documents used | 
**confidence** | **float** | Confidence score (0-1) | 
**mode** | **str** |  | 
**timestamp** | **str** | Response timestamp (ISO 8601) | 

## Example

```python
from api_client.models.chat_response import ChatResponse

# TODO update the JSON string below
json = "{}"
# create an instance of ChatResponse from a JSON string
chat_response_instance = ChatResponse.from_json(json)
# print the JSON string representation of the object
print(ChatResponse.to_json())

# convert the object into a dict
chat_response_dict = chat_response_instance.to_dict()
# create an instance of ChatResponse from a dict
chat_response_from_dict = ChatResponse.from_dict(chat_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


