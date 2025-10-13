# api_client.ServerApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_health**](ServerApi.md#get_health) | **GET** /health | Health Check (lean)
[**get_status**](ServerApi.md#get_status) | **GET** /status | System Status


# **get_health**
> GetHealth200Response get_health(force=force)

Health Check (lean)

Fast liveness/readiness probe. Use /status for detailed system information.

### Example


```python
import api_client
from api_client.models.get_health200_response import GetHealth200Response
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
    api_instance = api_client.ServerApi(api_client)
    force = 'force_example' # str |  (optional)

    try:
        # Health Check (lean)
        api_response = api_instance.get_health(force=force)
        print("The response of ServerApi->get_health:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServerApi->get_health: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **force** | **str**|  | [optional] 

### Return type

[**GetHealth200Response**](GetHealth200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |
**503** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_status**
> GetStatus200Response get_status()

System Status

Comprehensive system status (cached components)

### Example


```python
import api_client
from api_client.models.get_status200_response import GetStatus200Response
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
    api_instance = api_client.ServerApi(api_client)

    try:
        # System Status
        api_response = api_instance.get_status()
        print("The response of ServerApi->get_status:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServerApi->get_status: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**GetStatus200Response**](GetStatus200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

