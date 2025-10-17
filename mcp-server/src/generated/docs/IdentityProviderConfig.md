# IdentityProviderConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**display_name** | **str** | Display name for UI | [optional] 
**enabled** | **bool** | Whether the provider is enabled | [optional] [default to True]
**client_secret** | **str** | OAuth2 client secret | [optional] 
**token_url** | **str** | Token endpoint URL | [optional] 
**user_info_url** | **str** | UserInfo endpoint URL | [optional] 
**issuer** | **str** | OIDC issuer URL | [optional] 
**default_scopes** | **str** | Default OAuth2 scopes | [optional] 
**logout_url** | **str** | Logout endpoint URL | [optional] 
**entity_id** | **str** | SAML entity ID | [optional] 
**single_sign_on_service_url** | **str** | SAML SSO URL | [optional] 
**single_logout_service_url** | **str** | SAML SLO URL | [optional] 
**metadata_descriptor_url** | **str** | SAML metadata URL | [optional] 
**signature_algorithm** | **str** | SAML signature algorithm | [optional] 
**name_id_policy_format** | **str** | SAML NameID format | [optional] 
**signing_certificate** | **str** | SAML signing certificate | [optional] 
**validate_signature** | **bool** | Validate SAML signatures | [optional] 
**want_authn_requests_signed** | **bool** | Require signed AuthN requests | [optional] 
**additional_config** | **object** |  | [optional] 

## Example

```python
from api_client.models.identity_provider_config import IdentityProviderConfig

# TODO update the JSON string below
json = "{}"
# create an instance of IdentityProviderConfig from a JSON string
identity_provider_config_instance = IdentityProviderConfig.from_json(json)
# print the JSON string representation of the object
print(IdentityProviderConfig.to_json())

# convert the object into a dict
identity_provider_config_dict = identity_provider_config_instance.to_dict()
# create an instance of IdentityProviderConfig from a dict
identity_provider_config_from_dict = IdentityProviderConfig.from_dict(identity_provider_config_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


