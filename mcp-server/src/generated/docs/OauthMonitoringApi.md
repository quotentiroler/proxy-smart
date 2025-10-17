# api_client.OauthMonitoringApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_monitoring_oauth_analytics**](OauthMonitoringApi.md#get_monitoring_oauth_analytics) | **GET** /monitoring/oauth/analytics | Get OAuth Analytics
[**get_monitoring_oauth_analytics_export**](OauthMonitoringApi.md#get_monitoring_oauth_analytics_export) | **GET** /monitoring/oauth/analytics/export | Export Analytics Data
[**get_monitoring_oauth_analytics_stream**](OauthMonitoringApi.md#get_monitoring_oauth_analytics_stream) | **GET** /monitoring/oauth/analytics/stream | OAuth Analytics Stream
[**get_monitoring_oauth_events**](OauthMonitoringApi.md#get_monitoring_oauth_events) | **GET** /monitoring/oauth/events | Get OAuth Events
[**get_monitoring_oauth_events_export**](OauthMonitoringApi.md#get_monitoring_oauth_events_export) | **GET** /monitoring/oauth/events/export | Export Events Data
[**get_monitoring_oauth_events_stream**](OauthMonitoringApi.md#get_monitoring_oauth_events_stream) | **GET** /monitoring/oauth/events/stream | OAuth Events Stream
[**get_monitoring_oauth_health**](OauthMonitoringApi.md#get_monitoring_oauth_health) | **GET** /monitoring/oauth/health | Get System Health
[**get_oauth_monitoring_websocket_info**](OauthMonitoringApi.md#get_oauth_monitoring_websocket_info) | **GET** /oauth/monitoring/websocket/info | WebSocket Connection Info


# **get_monitoring_oauth_analytics**
> OAuthAnalyticsResponse get_monitoring_oauth_analytics(authorization=authorization)

Get OAuth Analytics

Get current OAuth analytics and metrics

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.o_auth_analytics_response import OAuthAnalyticsResponse
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
    api_instance = api_client.OauthMonitoringApi(api_client)
    authorization = 'authorization_example' # str |  (optional)

    try:
        # Get OAuth Analytics
        api_response = api_instance.get_monitoring_oauth_analytics(authorization=authorization)
        print("The response of OauthMonitoringApi->get_monitoring_oauth_analytics:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_analytics: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authorization** | **str**|  | [optional] 

### Return type

[**OAuthAnalyticsResponse**](OAuthAnalyticsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |
**400** | Response for status 400 |  -  |
**401** | Response for status 401 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_monitoring_oauth_analytics_export**
> ExportResponse get_monitoring_oauth_analytics_export(authorization)

Export Analytics Data

Download current OAuth analytics data as JSON file

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.export_response import ExportResponse
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
    api_instance = api_client.OauthMonitoringApi(api_client)
    authorization = 'authorization_example' # str | 

    try:
        # Export Analytics Data
        api_response = api_instance.get_monitoring_oauth_analytics_export(authorization)
        print("The response of OauthMonitoringApi->get_monitoring_oauth_analytics_export:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_analytics_export: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authorization** | **str**|  | 

### Return type

[**ExportResponse**](ExportResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |
**400** | Response for status 400 |  -  |
**401** | Response for status 401 |  -  |
**403** | Response for status 403 |  -  |
**404** | Response for status 404 |  -  |
**422** | Response for status 422 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_monitoring_oauth_analytics_stream**
> Dict[str, object] get_monitoring_oauth_analytics_stream(token=token, authorization=authorization)

OAuth Analytics Stream

Server-sent events stream for real-time OAuth analytics updates. Token can be passed as query parameter or Authorization header.

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
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
    api_instance = api_client.OauthMonitoringApi(api_client)
    token = 'token_example' # str |  (optional)
    authorization = 'authorization_example' # str |  (optional)

    try:
        # OAuth Analytics Stream
        api_response = api_instance.get_monitoring_oauth_analytics_stream(token=token, authorization=authorization)
        print("The response of OauthMonitoringApi->get_monitoring_oauth_analytics_stream:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_analytics_stream: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **token** | **str**|  | [optional] 
 **authorization** | **str**|  | [optional] 

### Return type

**Dict[str, object]**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |
**400** | Response for status 400 |  -  |
**401** | Response for status 401 |  -  |
**422** | Response for status 422 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_monitoring_oauth_events**
> OAuthEventsResponse get_monitoring_oauth_events(limit=limit, type=type, status=status, client_id=client_id, since=since, authorization=authorization)

Get OAuth Events

Retrieve recent OAuth events with optional filtering

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.o_auth_events_response import OAuthEventsResponse
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
    api_instance = api_client.OauthMonitoringApi(api_client)
    limit = 'limit_example' # str |  (optional)
    type = 'type_example' # str |  (optional)
    status = 'status_example' # str |  (optional)
    client_id = 'client_id_example' # str |  (optional)
    since = 'since_example' # str |  (optional)
    authorization = 'authorization_example' # str |  (optional)

    try:
        # Get OAuth Events
        api_response = api_instance.get_monitoring_oauth_events(limit=limit, type=type, status=status, client_id=client_id, since=since, authorization=authorization)
        print("The response of OauthMonitoringApi->get_monitoring_oauth_events:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_events: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | **str**|  | [optional] 
 **type** | **str**|  | [optional] 
 **status** | **str**|  | [optional] 
 **client_id** | **str**|  | [optional] 
 **since** | **str**|  | [optional] 
 **authorization** | **str**|  | [optional] 

### Return type

[**OAuthEventsResponse**](OAuthEventsResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |
**400** | Response for status 400 |  -  |
**401** | Response for status 401 |  -  |
**422** | Response for status 422 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_monitoring_oauth_events_export**
> str get_monitoring_oauth_events_export(authorization)

Export Events Data

Download OAuth events log as JSONL file

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
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
    api_instance = api_client.OauthMonitoringApi(api_client)
    authorization = 'authorization_example' # str | 

    try:
        # Export Events Data
        api_response = api_instance.get_monitoring_oauth_events_export(authorization)
        print("The response of OauthMonitoringApi->get_monitoring_oauth_events_export:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_events_export: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authorization** | **str**|  | 

### Return type

**str**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |
**400** | Response for status 400 |  -  |
**401** | Response for status 401 |  -  |
**403** | Response for status 403 |  -  |
**404** | Response for status 404 |  -  |
**422** | Response for status 422 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_monitoring_oauth_events_stream**
> Dict[str, object] get_monitoring_oauth_events_stream(token=token, authorization=authorization)

OAuth Events Stream

Server-sent events stream for real-time OAuth flow monitoring. Token can be passed as query parameter or Authorization header.

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
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
    api_instance = api_client.OauthMonitoringApi(api_client)
    token = 'token_example' # str |  (optional)
    authorization = 'authorization_example' # str |  (optional)

    try:
        # OAuth Events Stream
        api_response = api_instance.get_monitoring_oauth_events_stream(token=token, authorization=authorization)
        print("The response of OauthMonitoringApi->get_monitoring_oauth_events_stream:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_events_stream: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **token** | **str**|  | [optional] 
 **authorization** | **str**|  | [optional] 

### Return type

**Dict[str, object]**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |
**400** | Response for status 400 |  -  |
**401** | Response for status 401 |  -  |
**422** | Response for status 422 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_monitoring_oauth_health**
> MonitoringHealthResponse get_monitoring_oauth_health(authorization=authorization)

Get System Health

Get OAuth system health metrics and alerts

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.monitoring_health_response import MonitoringHealthResponse
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
    api_instance = api_client.OauthMonitoringApi(api_client)
    authorization = 'authorization_example' # str |  (optional)

    try:
        # Get System Health
        api_response = api_instance.get_monitoring_oauth_health(authorization=authorization)
        print("The response of OauthMonitoringApi->get_monitoring_oauth_health:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_health: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authorization** | **str**|  | [optional] 

### Return type

[**MonitoringHealthResponse**](MonitoringHealthResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |
**400** | Response for status 400 |  -  |
**401** | Response for status 401 |  -  |
**403** | Response for status 403 |  -  |
**404** | Response for status 404 |  -  |
**422** | Response for status 422 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_oauth_monitoring_websocket_info**
> WebSocketInfoResponse get_oauth_monitoring_websocket_info()

WebSocket Connection Info

Get information about WebSocket endpoints and supported subscriptions

### Example


```python
import api_client
from api_client.models.web_socket_info_response import WebSocketInfoResponse
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
    api_instance = api_client.OauthMonitoringApi(api_client)

    try:
        # WebSocket Connection Info
        api_response = api_instance.get_oauth_monitoring_websocket_info()
        print("The response of OauthMonitoringApi->get_oauth_monitoring_websocket_info:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_oauth_monitoring_websocket_info: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**WebSocketInfoResponse**](WebSocketInfoResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |
**422** | Response for status 422 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

