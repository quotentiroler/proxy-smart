# SetSmartStyleUrlRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**style_url** | **str** | URL to CSS stylesheet for styling | 

## Example

```python
from api_client.models.set_smart_style_url_request import SetSmartStyleUrlRequest

# TODO update the JSON string below
json = "{}"
# create an instance of SetSmartStyleUrlRequest from a JSON string
set_smart_style_url_request_instance = SetSmartStyleUrlRequest.from_json(json)
# print the JSON string representation of the object
print(SetSmartStyleUrlRequest.to_json())

# convert the object into a dict
set_smart_style_url_request_dict = set_smart_style_url_request_instance.to_dict()
# create an instance of SetSmartStyleUrlRequest from a dict
set_smart_style_url_request_from_dict = SetSmartStyleUrlRequest.from_dict(set_smart_style_url_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


