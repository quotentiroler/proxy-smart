# SetIntentRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**intent** | **str** | Intent string (e.g., reconcile-medications) | 

## Example

```python
from api_client.models.set_intent_request import SetIntentRequest

# TODO update the JSON string below
json = "{}"
# create an instance of SetIntentRequest from a JSON string
set_intent_request_instance = SetIntentRequest.from_json(json)
# print the JSON string representation of the object
print(SetIntentRequest.to_json())

# convert the object into a dict
set_intent_request_dict = set_intent_request_instance.to_dict()
# create an instance of SetIntentRequest from a dict
set_intent_request_from_dict = SetIntentRequest.from_dict(set_intent_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


