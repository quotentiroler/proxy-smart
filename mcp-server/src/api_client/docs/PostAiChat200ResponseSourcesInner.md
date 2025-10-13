# PostAiChat200ResponseSourcesInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Unique chunk identifier | 
**content** | **str** | Content for this knowledge base chunk | 
**source** | **str** | Source file or document reference | 
**title** | **str** | Document title | 
**category** | **str** | Document category such as admin-ui or smart-on-fhir | 
**relevance_score** | **float** | Optional relevance score when semantic search is used | [optional] 

## Example

```python
from api_client.models.post_ai_chat200_response_sources_inner import PostAiChat200ResponseSourcesInner

# TODO update the JSON string below
json = "{}"
# create an instance of PostAiChat200ResponseSourcesInner from a JSON string
post_ai_chat200_response_sources_inner_instance = PostAiChat200ResponseSourcesInner.from_json(json)
# print the JSON string representation of the object
print(PostAiChat200ResponseSourcesInner.to_json())

# convert the object into a dict
post_ai_chat200_response_sources_inner_dict = post_ai_chat200_response_sources_inner_instance.to_dict()
# create an instance of PostAiChat200ResponseSourcesInner from a dict
post_ai_chat200_response_sources_inner_from_dict = PostAiChat200ResponseSourcesInner.from_dict(post_ai_chat200_response_sources_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


