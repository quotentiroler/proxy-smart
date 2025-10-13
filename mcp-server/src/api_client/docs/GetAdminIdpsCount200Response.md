# GetAdminIdpsCount200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**count** | **float** | Number of enabled identity providers | 
**total** | **float** | Total number of identity providers | 

## Example

```python
from api_client.models.get_admin_idps_count200_response import GetAdminIdpsCount200Response

# TODO update the JSON string below
json = "{}"
# create an instance of GetAdminIdpsCount200Response from a JSON string
get_admin_idps_count200_response_instance = GetAdminIdpsCount200Response.from_json(json)
# print the JSON string representation of the object
print(GetAdminIdpsCount200Response.to_json())

# convert the object into a dict
get_admin_idps_count200_response_dict = get_admin_idps_count200_response_instance.to_dict()
# create an instance of GetAdminIdpsCount200Response from a dict
get_admin_idps_count200_response_from_dict = GetAdminIdpsCount200Response.from_dict(get_admin_idps_count200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


