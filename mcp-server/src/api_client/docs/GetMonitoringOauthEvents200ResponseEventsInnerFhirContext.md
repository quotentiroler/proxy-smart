# GetMonitoringOauthEvents200ResponseEventsInnerFhirContext


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**patient** | **str** |  | [optional] 
**encounter** | **str** |  | [optional] 
**location** | **str** |  | [optional] 
**fhir_user** | **str** |  | [optional] 

## Example

```python
from api_client.models.get_monitoring_oauth_events200_response_events_inner_fhir_context import GetMonitoringOauthEvents200ResponseEventsInnerFhirContext

# TODO update the JSON string below
json = "{}"
# create an instance of GetMonitoringOauthEvents200ResponseEventsInnerFhirContext from a JSON string
get_monitoring_oauth_events200_response_events_inner_fhir_context_instance = GetMonitoringOauthEvents200ResponseEventsInnerFhirContext.from_json(json)
# print the JSON string representation of the object
print(GetMonitoringOauthEvents200ResponseEventsInnerFhirContext.to_json())

# convert the object into a dict
get_monitoring_oauth_events200_response_events_inner_fhir_context_dict = get_monitoring_oauth_events200_response_events_inner_fhir_context_instance.to_dict()
# create an instance of GetMonitoringOauthEvents200ResponseEventsInnerFhirContext from a dict
get_monitoring_oauth_events200_response_events_inner_fhir_context_from_dict = GetMonitoringOauthEvents200ResponseEventsInnerFhirContext.from_dict(get_monitoring_oauth_events200_response_events_inner_fhir_context_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


