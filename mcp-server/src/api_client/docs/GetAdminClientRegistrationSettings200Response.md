# GetAdminClientRegistrationSettings200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**enabled** | **bool** | Whether dynamic client registration is enabled | 
**require_https** | **bool** | Whether HTTPS is required for redirect URIs | 
**allowed_scopes** | **List[str]** |  | 
**max_client_lifetime** | **float** | Maximum client lifetime in days (0 &#x3D; no limit) | 
**require_terms_of_service** | **bool** | Whether terms of service URI is required | 
**require_privacy_policy** | **bool** | Whether privacy policy URI is required | 
**allow_public_clients** | **bool** | Whether public clients are allowed | 
**allow_confidential_clients** | **bool** | Whether confidential clients are allowed | 
**allow_backend_services** | **bool** | Whether backend service clients are allowed | 
**admin_approval_required** | **bool** | Whether admin approval is required for new clients | 
**rate_limit_per_minute** | **float** | Rate limit for registration requests per minute | 
**max_redirect_uris** | **float** | Maximum number of redirect URIs per client | 
**allowed_redirect_uri_patterns** | **List[str]** |  | 
**notification_email** | **str** | Email to notify of new registrations | [optional] 

## Example

```python
from api_client.models.get_admin_client_registration_settings200_response import GetAdminClientRegistrationSettings200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetAdminClientRegistrationSettings200Response from a JSON string
get_admin_client_registration_settings200_response_instance = GetAdminClientRegistrationSettings200Response.from_json(json)
# print the JSON string representation of the object
print(GetAdminClientRegistrationSettings200Response.to_json())

# convert the object into a dict
get_admin_client_registration_settings200_response_dict = get_admin_client_registration_settings200_response_instance.to_dict()
# create an instance of GetAdminClientRegistrationSettings200Response from a dict
get_admin_client_registration_settings200_response_from_dict = GetAdminClientRegistrationSettings200Response.from_dict(get_admin_client_registration_settings200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


