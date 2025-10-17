# UpdateSmartAppRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** | Application name | [optional] 
**description** | **str** | Application description | [optional] 
**enabled** | **bool** | Whether the app is enabled | [optional] 
**redirect_uris** | **List[str]** | Allowed redirect URIs | [optional] 
**web_origins** | **List[str]** | Allowed web origins | [optional] 
**default_scopes** | **List[str]** | Default SMART scopes | [optional] 
**optional_scopes** | **List[str]** | Optional SMART scopes | [optional] 
**smart_version** | **str** | SMART App Launch version | [optional] 
**fhir_version** | **str** | FHIR version | [optional] 

## Example

```python
from api_client.models.update_smart_app_request import UpdateSmartAppRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateSmartAppRequest from a JSON string
update_smart_app_request_instance = UpdateSmartAppRequest.from_json(json)
# print the JSON string representation of the object
print(UpdateSmartAppRequest.to_json())

# convert the object into a dict
update_smart_app_request_dict = update_smart_app_request_instance.to_dict()
# create an instance of UpdateSmartAppRequest from a dict
update_smart_app_request_from_dict = UpdateSmartAppRequest.from_dict(update_smart_app_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


