# api_client.FhirApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_proxy_smart_backend_by_server_name_by_fhir_version**](FhirApi.md#get_proxy_smart_backend_by_server_name_by_fhir_version) | **GET** /proxy-smart-backend/{server_name}/{fhir_version}/ | FHIR Server Base URL
[**post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh**](FhirApi.md#post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh) | **POST** /proxy-smart-backend/{server_name}/{fhir_version}/cache/refresh | Refresh FHIR Server Cache


# **get_proxy_smart_backend_by_server_name_by_fhir_version**
> object get_proxy_smart_backend_by_server_name_by_fhir_version(server_name, fhir_version)

FHIR Server Base URL

Serve the content from the FHIR server base URL

### Example


```python
import api_client
from api_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:3001
# See configuration.py for a list of all supported configuration parameters.
configuration = api_client.Configuration(
    host = "http://localhost:3001"
)


# Enter a context with an instance of the API client
with api_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = api_client.FhirApi(api_client)
    server_name = 'server_name_example' # str | FHIR server name or identifier
    fhir_version = 'fhir_version_example' # str | FHIR version (e.g., R4, R5)

    try:
        # FHIR Server Base URL
        api_response = api_instance.get_proxy_smart_backend_by_server_name_by_fhir_version(server_name, fhir_version)
        print("The response of FhirApi->get_proxy_smart_backend_by_server_name_by_fhir_version:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling FhirApi->get_proxy_smart_backend_by_server_name_by_fhir_version: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **server_name** | **str**| FHIR server name or identifier | 
 **fhir_version** | **str**| FHIR version (e.g., R4, R5) | 

### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | FHIR server base response |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh**
> PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200Response post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh(server_name, fhir_version)

Refresh FHIR Server Cache

Clear and refresh the cached FHIR server information

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh200_response import PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200Response
from api_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost:3001
# See configuration.py for a list of all supported configuration parameters.
configuration = api_client.Configuration(
    host = "http://localhost:3001"
)

# The client must configure the authentication and authorization parameters
# in accordance with the API server security policy.
# Examples for each auth method are provided below, use the example that
# satisfies your auth use case.

# Configure Bearer authorization (JWT): BearerAuth
configuration = api_client.Configuration(
    access_token = os.environ["BEARER_TOKEN"]
)

# Enter a context with an instance of the API client
with api_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = api_client.FhirApi(api_client)
    server_name = 'server_name_example' # str | FHIR server name or identifier
    fhir_version = 'fhir_version_example' # str | FHIR version (e.g., R4, R5)

    try:
        # Refresh FHIR Server Cache
        api_response = api_instance.post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh(server_name, fhir_version)
        print("The response of FhirApi->post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling FhirApi->post_proxy_smart_backend_by_server_name_by_fhir_version_cache_refresh: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **server_name** | **str**| FHIR server name or identifier | 
 **fhir_version** | **str**| FHIR version (e.g., R4, R5) | 

### Return type

[**PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200Response**](PostProxySmartBackendByServerNameByFhirVersionCacheRefresh200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |
**401** |  |  -  |
**403** |  |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

