# GetMonitoringOauthEvents200ResponseEventsInner


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** |  | 
**timestamp** | **str** |  | 
**type** | **str** |  | 
**status** | **str** |  | 
**client_id** | **str** |  | 
**client_name** | **str** |  | [optional] 
**user_id** | **str** |  | [optional] 
**user_name** | **str** |  | [optional] 
**scopes** | **List[str]** |  | 
**grant_type** | **str** |  | 
**response_time** | **float** |  | 
**ip_address** | **str** |  | 
**user_agent** | **str** |  | 
**error_message** | **str** |  | [optional] 
**error_code** | **str** |  | [optional] 
**token_type** | **str** |  | [optional] 
**expires_in** | **float** |  | [optional] 
**refresh_token** | **bool** |  | [optional] 
**fhir_context** | [**GetMonitoringOauthEvents200ResponseEventsInnerFhirContext**](GetMonitoringOauthEvents200ResponseEventsInnerFhirContext.md) |  | [optional] 

## Example

```python
from api_client.models.get_monitoring_oauth_events200_response_events_inner import GetMonitoringOauthEvents200ResponseEventsInner

# TODO update the JSON string below
json = "{}"
# create an instance of GetMonitoringOauthEvents200ResponseEventsInner from a JSON string
get_monitoring_oauth_events200_response_events_inner_instance = GetMonitoringOauthEvents200ResponseEventsInner.from_json(json)
# print the JSON string representation of the object
print(GetMonitoringOauthEvents200ResponseEventsInner.to_json())

# convert the object into a dict
get_monitoring_oauth_events200_response_events_inner_dict = get_monitoring_oauth_events200_response_events_inner_instance.to_dict()
# create an instance of GetMonitoringOauthEvents200ResponseEventsInner from a dict
get_monitoring_oauth_events200_response_events_inner_from_dict = GetMonitoringOauthEvents200ResponseEventsInner.from_dict(get_monitoring_oauth_events200_response_events_inner_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


