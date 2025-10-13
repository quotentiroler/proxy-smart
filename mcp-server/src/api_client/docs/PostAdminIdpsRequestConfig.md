# PostAdminIdpsRequestConfig


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**display_name** | **str** |  | [optional] 
**entity_id** | **str** |  | [optional] 
**single_sign_on_service_url** | **str** |  | [optional] 
**single_logout_service_url** | **str** |  | [optional] 
**metadata_descriptor_url** | **str** |  | [optional] 
**enabled** | **bool** |  | [optional] 
**client_secret** | **str** |  | [optional] 
**token_url** | **str** |  | [optional] 
**user_info_url** | **str** |  | [optional] 
**issuer** | **str** |  | [optional] 
**default_scopes** | **str** |  | [optional] 
**logout_url** | **str** |  | [optional] 
**signature_algorithm** | **str** |  | [optional] 
**name_id_policy_format** | **str** |  | [optional] 
**signing_certificate** | **str** |  | [optional] 
**validate_signature** | **bool** |  | [optional] 
**want_authn_requests_signed** | **bool** |  | [optional] 
**additional_config** | **object** |  | [optional] 

## Example

```python
from api_client.models.post_admin_idps_request_config import PostAdminIdpsRequestConfig

# TODO update the JSON string below
json = "{}"
# create an instance of PostAdminIdpsRequestConfig from a JSON string
post_admin_idps_request_config_instance = PostAdminIdpsRequestConfig.from_json(json)
# print the JSON string representation of the object
print(PostAdminIdpsRequestConfig.to_json())

# convert the object into a dict
post_admin_idps_request_config_dict = post_admin_idps_request_config_instance.to_dict()
# create an instance of PostAdminIdpsRequestConfig from a dict
post_admin_idps_request_config_from_dict = PostAdminIdpsRequestConfig.from_dict(post_admin_idps_request_config_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


