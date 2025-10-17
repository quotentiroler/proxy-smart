# ClientRegistrationRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**redirect_uris** | **List[str]** | Array of redirect URIs for the client | 
**client_name** | **str** | Human-readable client name | [optional] 
**client_uri** | **str** | Client home page URL | [optional] 
**logo_uri** | **str** | Client logo URL | [optional] 
**scope** | **str** | Requested scopes (space-separated) | [optional] 
**contacts** | **List[str]** | Contact email addresses | [optional] 
**tos_uri** | **str** | Terms of service URL | [optional] 
**policy_uri** | **str** | Privacy policy URL | [optional] 
**jwks_uri** | **str** | JWKS endpoint URL | [optional] 
**jwks** | **object** | JSON Web Key Set | [optional] 
**software_id** | **str** | Software identifier | [optional] 
**software_version** | **str** | Software version | [optional] 
**fhir_versions** | **List[str]** | Supported FHIR versions | [optional] 
**launch_uris** | **List[str]** | EHR launch URLs | [optional] 

## Example

```python
from api_client.models.client_registration_request import ClientRegistrationRequest

# TODO update the JSON string below
json = "{}"
# create an instance of ClientRegistrationRequest from a JSON string
client_registration_request_instance = ClientRegistrationRequest.from_json(json)
# print the JSON string representation of the object
print(ClientRegistrationRequest.to_json())

# convert the object into a dict
client_registration_request_dict = client_registration_request_instance.to_dict()
# create an instance of ClientRegistrationRequest from a dict
client_registration_request_from_dict = ClientRegistrationRequest.from_dict(client_registration_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


