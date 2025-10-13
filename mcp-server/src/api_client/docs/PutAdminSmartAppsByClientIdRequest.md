# PutAdminSmartAppsByClientIdRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | Application name | [optional] 
**description** | **str** | Application description | [optional] 
**enabled** | **bool** | Whether application is enabled | [optional] 
**redirect_uris** | **List[str]** |  | [optional] 
**web_origins** | **List[str]** |  | [optional] 
**default_scopes** | **List[str]** |  | [optional] 
**optional_scopes** | **List[str]** |  | [optional] 
**smart_version** | **str** | SMART version | [optional] 
**fhir_version** | **str** | FHIR version | [optional] 

## Example

```python
from api_client.models.put_admin_smart_apps_by_client_id_request import PutAdminSmartAppsByClientIdRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PutAdminSmartAppsByClientIdRequest from a JSON string
put_admin_smart_apps_by_client_id_request_instance = PutAdminSmartAppsByClientIdRequest.from_json(json)
# print the JSON string representation of the object
print(PutAdminSmartAppsByClientIdRequest.to_json())

# convert the object into a dict
put_admin_smart_apps_by_client_id_request_dict = put_admin_smart_apps_by_client_id_request_instance.to_dict()
# create an instance of PutAdminSmartAppsByClientIdRequest from a dict
put_admin_smart_apps_by_client_id_request_from_dict = PutAdminSmartAppsByClientIdRequest.from_dict(put_admin_smart_apps_by_client_id_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


