# PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200ResponseServerInfo


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**fhir_version** | **str** | FHIR version supported by server | 
**server_version** | **str** | Server software version | [optional] 
**server_name** | **str** | Server software name | [optional] 
**supported** | **bool** | Whether this version is supported | 

## Example

```python
from api_client.models.post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response_server_info import PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200ResponseServerInfo

# TODO update the JSON string below
json = "{}"
# create an instance of PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200ResponseServerInfo from a JSON string
post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response_server_info_instance = PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200ResponseServerInfo.from_json(json)
# print the JSON string representation of the object
print(PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200ResponseServerInfo.to_json())

# convert the object into a dict
post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response_server_info_dict = post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response_server_info_instance.to_dict()
# create an instance of PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200ResponseServerInfo from a dict
post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response_server_info_from_dict = PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200ResponseServerInfo.from_dict(post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response_server_info_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


