# ExportResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**format** | **str** | Export format (json, csv) | 
**data** | **object** |  | 

## Example

```python
from api_client.models.export_response import ExportResponse

# TODO update the JSON string below
json = "{}"
# create an instance of ExportResponse from a JSON string
export_response_instance = ExportResponse.from_json(json)
# print the JSON string representation of the object
print(ExportResponse.to_json())

# convert the object into a dict
export_response_dict = export_response_instance.to_dict()
# create an instance of ExportResponse from a dict
export_response_from_dict = ExportResponse.from_dict(export_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


