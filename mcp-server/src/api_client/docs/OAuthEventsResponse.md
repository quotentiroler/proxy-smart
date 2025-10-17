# OAuthEventsResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**events** | [**List[OAuthEvent]**](OAuthEvent.md) | Array of events | 
**total** | **float** | Total number of events | 
**timestamp** | **str** | Response timestamp | 

## Example

```python
from api_client.models.o_auth_events_response import OAuthEventsResponse

# TODO update the JSON string below
json = "{}"
# create an instance of OAuthEventsResponse from a JSON string
o_auth_events_response_instance = OAuthEventsResponse.from_json(json)
# print the JSON string representation of the object
print(OAuthEventsResponse.to_json())

# convert the object into a dict
o_auth_events_response_dict = o_auth_events_response_instance.to_dict()
# create an instance of OAuthEventsResponse from a dict
o_auth_events_response_from_dict = OAuthEventsResponse.from_dict(o_auth_events_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


