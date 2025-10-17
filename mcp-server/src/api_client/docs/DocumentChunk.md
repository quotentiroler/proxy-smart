# DocumentChunk


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Document chunk ID | 
**content** | **str** | Document content | 
**source** | **str** | Source document/file | 
**title** | **str** | Document title | 
**category** | **str** | Document category | 
**relevance_score** | **float** | Relevance score (0-1) | [optional] 

## Example

```python
from api_client.models.document_chunk import DocumentChunk

# TODO update the JSON string below
json = "{}"
# create an instance of DocumentChunk from a JSON string
document_chunk_instance = DocumentChunk.from_json(json)
# print the JSON string representation of the object
print(DocumentChunk.to_json())

# convert the object into a dict
document_chunk_dict = document_chunk_instance.to_dict()
# create an instance of DocumentChunk from a dict
document_chunk_from_dict = DocumentChunk.from_dict(document_chunk_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


