# SetTenantRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**tenant** | **str** | Tenant identifier | 

## Example

```python
from api_client.models.set_tenant_request import SetTenantRequest

# TODO update the JSON string below
json = "{}"
# create an instance of SetTenantRequest from a JSON string
set_tenant_request_instance = SetTenantRequest.from_json(json)
# print the JSON string representation of the object
print(SetTenantRequest.to_json())

# convert the object into a dict
set_tenant_request_dict = set_tenant_request_instance.to_dict()
# create an instance of SetTenantRequest from a dict
set_tenant_request_from_dict = SetTenantRequest.from_dict(set_tenant_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


