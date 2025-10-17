# ClientRegistrationResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**client_id** | **str** | OAuth2 client ID | 
**client_secret** | **str** | OAuth2 client secret (for confidential clients) | [optional] 
**client_id_issued_at** | **float** | Client ID issuance timestamp (Unix time) | 
**client_secret_expires_at** | **float** | Client secret expiration timestamp (0 &#x3D; never expires) | [optional] 
**redirect_uris** | **List[str]** | Registered redirect URIs | 
**grant_types** | **List[str]** | Allowed grant types | 
**response_types** | **List[str]** | Allowed response types | 
**client_name** | **str** | Human-readable client name | [optional] 
**client_uri** | **str** | Client home page URL | [optional] 
**logo_uri** | **str** | Client logo URL | [optional] 
**scope** | **str** | Granted scopes (space-separated) | [optional] 
**contacts** | **List[str]** | Contact email addresses | [optional] 
**tos_uri** | **str** | Terms of service URL | [optional] 
**policy_uri** | **str** | Privacy policy URL | [optional] 
**jwks_uri** | **str** | JWKS endpoint URL | [optional] 
**jwks** | **object** | JSON Web Key Set | [optional] 
**token_endpoint_auth_method** | **str** | Token endpoint authentication method | 
**fhir_versions** | **List[str]** | Supported FHIR versions | [optional] 
**launch_uris** | **List[str]** | EHR launch URLs | [optional] 

## Example

```python
from api_client.models.client_registration_response import ClientRegistrationResponse

# TODO update the JSON string below
json = "{}"
# create an instance of ClientRegistrationResponse from a JSON string
client_registration_response_instance = ClientRegistrationResponse.from_json(json)
# print the JSON string representation of the object
print(ClientRegistrationResponse.to_json())

# convert the object into a dict
client_registration_response_dict = client_registration_response_instance.to_dict()
# create an instance of ClientRegistrationResponse from a dict
client_registration_response_from_dict = ClientRegistrationResponse.from_dict(client_registration_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


