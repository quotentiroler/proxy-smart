# CacheRefreshResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether refresh was successful | 
**message** | **str** | Success message | 
**server_info** | [**FhirServerMetadata**](FhirServerMetadata.md) |  | 

## Example

```python
from api_client.models.cache_refresh_response import CacheRefreshResponse

# TODO update the JSON string below
json = "{}"
# create an instance of CacheRefreshResponse from a JSON string
cache_refresh_response_instance = CacheRefreshResponse.from_json(json)
# print the JSON string representation of the object
print(CacheRefreshResponse.to_json())

# convert the object into a dict
cache_refresh_response_dict = cache_refresh_response_instance.to_dict()
# create an instance of CacheRefreshResponse from a dict
cache_refresh_response_from_dict = CacheRefreshResponse.from_dict(cache_refresh_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


