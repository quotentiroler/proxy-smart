# PostAiChat200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**answer** | **str** | AI generated answer | 
**sources** | [**List[PostAiChat200ResponseSourcesInner]**](PostAiChat200ResponseSourcesInner.md) | Knowledge base documents referenced in the response | 
**confidence** | **float** | Confidence score from 0-1 | 
**mode** | [**PostAiChat200ResponseMode**](PostAiChat200ResponseMode.md) |  | 
**timestamp** | **str** | Timestamp (ISO 8601) when the response was generated | 

## Example

```python
from api_client.models.post_ai_chat200_response import PostAiChat200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostAiChat200Response from a JSON string
post_ai_chat200_response_instance = PostAiChat200Response.from_json(json)
# print the JSON string representation of the object
print(PostAiChat200Response.to_json())

# convert the object into a dict
post_ai_chat200_response_dict = post_ai_chat200_response_instance.to_dict()
# create an instance of PostAiChat200Response from a dict
post_ai_chat200_response_from_dict = PostAiChat200Response.from_dict(post_ai_chat200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


