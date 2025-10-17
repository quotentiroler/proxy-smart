# HealthErrorResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**status** | **str** | Health status | 
**timestamp** | **str** | Timestamp (ISO 8601) | 
**error** | **str** | Error message | 

## Example

```python
from api_client.models.health_error_response import HealthErrorResponse

# TODO update the JSON string below
json = "{}"
# create an instance of HealthErrorResponse from a JSON string
health_error_response_instance = HealthErrorResponse.from_json(json)
# print the JSON string representation of the object
print(HealthErrorResponse.to_json())

# convert the object into a dict
health_error_response_dict = health_error_response_instance.to_dict()
# create an instance of HealthErrorResponse from a dict
health_error_response_from_dict = HealthErrorResponse.from_dict(health_error_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


