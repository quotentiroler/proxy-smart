# GetStatus200ResponseFhirServersInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**name** | **str** |  | 
**url** | **str** |  | 
**status** | **str** |  | 
**accessible** | **bool** |  | 
**version** | **str** |  | 
**server_name** | **str** |  | [optional] 
**server_version** | **str** |  | [optional] 
**error** | **str** |  | [optional] 

## Example

```python
from api_client.models.get_status200_response_fhir_servers_inner import GetStatus200ResponseFhirServersInner

# TODO update the JSON string below
json = "{}"
# create an instance of GetStatus200ResponseFhirServersInner from a JSON string
get_status200_response_fhir_servers_inner_instance = GetStatus200ResponseFhirServersInner.from_json(json)
# print the JSON string representation of the object
print(GetStatus200ResponseFhirServersInner.to_json())

# convert the object into a dict
get_status200_response_fhir_servers_inner_dict = get_status200_response_fhir_servers_inner_instance.to_dict()
# create an instance of GetStatus200ResponseFhirServersInner from a dict
get_status200_response_fhir_servers_inner_from_dict = GetStatus200ResponseFhirServersInner.from_dict(get_status200_response_fhir_servers_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


