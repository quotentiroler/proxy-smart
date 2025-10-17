# OAuthEvent


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **str** | Event ID | 
**timestamp** | **str** | Event timestamp | 
**type** | **str** | Event type | 
**status** | **str** | Event status | 
**client_id** | **str** | OAuth client ID | 
**client_name** | **str** | Client display name | [optional] 
**user_id** | **str** | User ID | [optional] 
**user_name** | **str** | User name | [optional] 
**scopes** | **List[str]** | Requested scopes | 
**grant_type** | **str** | OAuth grant type | 
**response_time** | **float** | Response time in ms | 
**ip_address** | **str** | Client IP address | 
**user_agent** | **str** | User agent | 
**error_message** | **str** | Error message if failed | [optional] 
**error_code** | **str** | Error code | [optional] 
**token_type** | **str** | Token type | [optional] 
**expires_in** | **float** | Token expiration in seconds | [optional] 
**refresh_token** | **bool** | Whether refresh token was issued | [optional] 
**fhir_context** | [**OAuthEventFhirContext**](OAuthEventFhirContext.md) |  | [optional] 

## Example

```python
from api_client.models.o_auth_event import OAuthEvent

# TODO update the JSON string below
json = "{}"
# create an instance of OAuthEvent from a JSON string
o_auth_event_instance = OAuthEvent.from_json(json)
# print the JSON string representation of the object
print(OAuthEvent.to_json())

# convert the object into a dict
o_auth_event_dict = o_auth_event_instance.to_dict()
# create an instance of OAuthEvent from a dict
o_auth_event_from_dict = OAuthEvent.from_dict(o_auth_event_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


