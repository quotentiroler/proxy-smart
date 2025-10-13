# PutAdminLaunchContextsByUserIdIntentRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**intent** | **str** | Intent string (e.g., reconcile-medications) | 

## Example

```python
from api_client.models.put_admin_launch_contexts_by_user_id_intent_request import PutAdminLaunchContextsByUserIdIntentRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PutAdminLaunchContextsByUserIdIntentRequest from a JSON string
put_admin_launch_contexts_by_user_id_intent_request_instance = PutAdminLaunchContextsByUserIdIntentRequest.from_json(json)
# print the JSON string representation of the object
print(PutAdminLaunchContextsByUserIdIntentRequest.to_json())

# convert the object into a dict
put_admin_launch_contexts_by_user_id_intent_request_dict = put_admin_launch_contexts_by_user_id_intent_request_instance.to_dict()
# create an instance of PutAdminLaunchContextsByUserIdIntentRequest from a dict
put_admin_launch_contexts_by_user_id_intent_request_from_dict = PutAdminLaunchContextsByUserIdIntentRequest.from_dict(put_admin_launch_contexts_by_user_id_intent_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


