# PutAdminIdpsByAliasRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**display_name** | **str** |  | [optional] 
**enabled** | **bool** |  | [optional] 
**config** | [**PostAdminIdpsRequestConfig**](PostAdminIdpsRequestConfig.md) |  | [optional] 

## Example

```python
from api_client.models.put_admin_idps_by_alias_request import PutAdminIdpsByAliasRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PutAdminIdpsByAliasRequest from a JSON string
put_admin_idps_by_alias_request_instance = PutAdminIdpsByAliasRequest.from_json(json)
# print the JSON string representation of the object
print(PutAdminIdpsByAliasRequest.to_json())

# convert the object into a dict
put_admin_idps_by_alias_request_dict = put_admin_idps_by_alias_request_instance.to_dict()
# create an instance of PutAdminIdpsByAliasRequest from a dict
put_admin_idps_by_alias_request_from_dict = PutAdminIdpsByAliasRequest.from_dict(put_admin_idps_by_alias_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


