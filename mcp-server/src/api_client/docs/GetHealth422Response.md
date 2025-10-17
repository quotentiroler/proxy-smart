# GetHealth422Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**type** | **str** |  | 
**on** | **str** |  | 
**summary** | **str** |  | [optional] 
**message** | **str** |  | [optional] 
**found** | **object** |  | [optional] 
**var_property** | **str** |  | [optional] 
**expected** | **str** |  | [optional] 

## Example

```python
from api_client.models.get_health422_response import GetHealth422Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetHealth422Response from a JSON string
get_health422_response_instance = GetHealth422Response.from_json(json)
# print the JSON string representation of the object
print(GetHealth422Response.to_json())

# convert the object into a dict
get_health422_response_dict = get_health422_response_instance.to_dict()
# create an instance of GetHealth422Response from a dict
get_health422_response_from_dict = GetHealth422Response.from_dict(get_health422_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


