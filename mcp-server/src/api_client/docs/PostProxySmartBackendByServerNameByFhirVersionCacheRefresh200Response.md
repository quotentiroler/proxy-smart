# PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether refresh was successful | 
**message** | **str** | Success message | 
**server_info** | [**PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200ResponseServerInfo**](PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200ResponseServerInfo.md) |  | 

## Example

```python
from api_client.models.post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response import PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200Response from a JSON string
post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response_instance = PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200Response.from_json(json)
# print the JSON string representation of the object
print(PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200Response.to_json())

# convert the object into a dict
post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response_dict = post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response_instance.to_dict()
# create an instance of PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200Response from a dict
post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response_from_dict = PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200Response.from_dict(post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


