# PutAdminSmartAppsByClientId200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the operation was successful | 
**message** | **str** | Success message | [optional] 

## Example

```python
from api_client.models.put_admin_smart_apps_by_client_id200_response import PutAdminSmartAppsByClientId200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PutAdminSmartAppsByClientId200Response from a JSON string
put_admin_smart_apps_by_client_id200_response_instance = PutAdminSmartAppsByClientId200Response.from_json(json)
# print the JSON string representation of the object
print(PutAdminSmartAppsByClientId200Response.to_json())

# convert the object into a dict
put_admin_smart_apps_by_client_id200_response_dict = put_admin_smart_apps_by_client_id200_response_instance.to_dict()
# create an instance of PutAdminSmartAppsByClientId200Response from a dict
put_admin_smart_apps_by_client_id200_response_from_dict = PutAdminSmartAppsByClientId200Response.from_dict(put_admin_smart_apps_by_client_id200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


