# TokenResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**access_token** | **str** | JWT access token | [optional] 
**token_type** | **str** | Token type (Bearer) | [optional] 
**expires_in** | **float** | Token expiration time in seconds | [optional] 
**refresh_token** | **str** | Refresh token | [optional] 
**refresh_expires_in** | **float** | Refresh token expiration time in seconds | [optional] 
**id_token** | **str** | OpenID Connect ID token | [optional] 
**scope** | **str** | Granted scopes | [optional] 
**session_state** | **str** | Keycloak session state | [optional] 
**not_before_policy** | **float** | Not before policy timestamp | [optional] 
**patient** | **str** | Patient in context (e.g., Patient/123) | [optional] 
**encounter** | **str** | Encounter in context (e.g., Encounter/456) | [optional] 
**fhir_user** | **str** | FHIR user resource (e.g., Practitioner/789) | [optional] 
**fhir_context** | [**List[FhirContextItem]**](FhirContextItem.md) | Additional FHIR resources in context | [optional] 
**intent** | **str** | Launch intent (e.g., reconcile-medications) | [optional] 
**smart_style_url** | **str** | URL to CSS stylesheet for styling | [optional] 
**tenant** | **str** | Tenant identifier | [optional] 
**need_patient_banner** | **bool** | Whether patient banner is required | [optional] 
**authorization_details** | [**List[AuthorizationDetail]**](AuthorizationDetail.md) | Authorization details for multiple FHIR servers | [optional] 
**error** | **str** | Error code if request failed | [optional] 
**error_description** | **str** | Error description if request failed | [optional] 

## Example

```python
from api_client.models.token_response import TokenResponse

# TODO update the JSON string below
json = "{}"
# create an instance of TokenResponse from a JSON string
token_response_instance = TokenResponse.from_json(json)
# print the JSON string representation of the object
print(TokenResponse.to_json())

# convert the object into a dict
token_response_dict = token_response_instance.to_dict()
# create an instance of TokenResponse from a dict
token_response_from_dict = TokenResponse.from_dict(token_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


