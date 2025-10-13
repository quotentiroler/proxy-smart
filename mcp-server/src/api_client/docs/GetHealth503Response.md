# GetHealth503Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** |  | 
**timestamp** | **str** |  | 
**error** | **str** |  | 

## Example

```python
from api_client.models.get_health503_response import GetHealth503Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetHealth503Response from a JSON string
get_health503_response_instance = GetHealth503Response.from_json(json)
# print the JSON string representation of the object
print(GetHealth503Response.to_json())

# convert the object into a dict
get_health503_response_dict = get_health503_response_instance.to_dict()
# create an instance of GetHealth503Response from a dict
get_health503_response_from_dict = GetHealth503Response.from_dict(get_health503_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


