# AiHealthErrorResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**error** | **str** | Error message | 

## Example

```python
from api_client.models.ai_health_error_response import AiHealthErrorResponse

# TODO update the JSON string below
json = "{}"
# create an instance of AiHealthErrorResponse from a JSON string
ai_health_error_response_instance = AiHealthErrorResponse.from_json(json)
# print the JSON string representation of the object
print(AiHealthErrorResponse.to_json())

# convert the object into a dict
ai_health_error_response_dict = ai_health_error_response_instance.to_dict()
# create an instance of AiHealthErrorResponse from a dict
ai_health_error_response_from_dict = AiHealthErrorResponse.from_dict(ai_health_error_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


