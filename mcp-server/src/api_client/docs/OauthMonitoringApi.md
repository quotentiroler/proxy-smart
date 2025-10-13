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
> GetMonitoringOauthAnalytics200Response get_monitoring_oauth_analytics(authorization=authorization)

Get OAuth Analytics

Get current OAuth analytics and metrics

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_monitoring_oauth_analytics200_response import GetMonitoringOauthAnalytics200Response
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
    authorization = 'authorization_example' # str | Bearer token (optional)

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
 **authorization** | **str**| Bearer token | [optional] 

### Return type

[**GetMonitoringOauthAnalytics200Response**](GetMonitoringOauthAnalytics200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_monitoring_oauth_analytics_export**
> get_monitoring_oauth_analytics_export(authorization)

Export Analytics Data

Download current OAuth analytics data as JSON file

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
    authorization = 'authorization_example' # str | Bearer token

    try:
        # Export Analytics Data
        api_instance.get_monitoring_oauth_analytics_export(authorization)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_analytics_export: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authorization** | **str**| Bearer token | 

### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_monitoring_oauth_analytics_stream**
> get_monitoring_oauth_analytics_stream(authorization=authorization, token=token)

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
    authorization = 'authorization_example' # str | Bearer token (optional)
    token = 'token_example' # str | Bearer token for authentication (since EventSource cannot send custom headers) (optional)

    try:
        # OAuth Analytics Stream
        api_instance.get_monitoring_oauth_analytics_stream(authorization=authorization, token=token)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_analytics_stream: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authorization** | **str**| Bearer token | [optional] 
 **token** | **str**| Bearer token for authentication (since EventSource cannot send custom headers) | [optional] 

### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_monitoring_oauth_events**
> GetMonitoringOauthEvents200Response get_monitoring_oauth_events(authorization=authorization, limit=limit, type=type, status=status, client_id=client_id, since=since)

Get OAuth Events

Retrieve recent OAuth events with optional filtering

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_monitoring_oauth_events200_response import GetMonitoringOauthEvents200Response
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
    authorization = 'authorization_example' # str | Bearer token (optional)
    limit = 'limit_example' # str | Maximum number of events to return (optional)
    type = 'type_example' # str | Filter by event type (optional)
    status = 'status_example' # str | Filter by event status (optional)
    client_id = 'client_id_example' # str | Filter by client ID (optional)
    since = 'since_example' # str | Filter events since this timestamp (optional)

    try:
        # Get OAuth Events
        api_response = api_instance.get_monitoring_oauth_events(authorization=authorization, limit=limit, type=type, status=status, client_id=client_id, since=since)
        print("The response of OauthMonitoringApi->get_monitoring_oauth_events:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_events: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authorization** | **str**| Bearer token | [optional] 
 **limit** | **str**| Maximum number of events to return | [optional] 
 **type** | **str**| Filter by event type | [optional] 
 **status** | **str**| Filter by event status | [optional] 
 **client_id** | **str**| Filter by client ID | [optional] 
 **since** | **str**| Filter events since this timestamp | [optional] 

### Return type

[**GetMonitoringOauthEvents200Response**](GetMonitoringOauthEvents200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_monitoring_oauth_events_export**
> get_monitoring_oauth_events_export(authorization)

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
    authorization = 'authorization_example' # str | Bearer token

    try:
        # Export Events Data
        api_instance.get_monitoring_oauth_events_export(authorization)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_events_export: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authorization** | **str**| Bearer token | 

### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_monitoring_oauth_events_stream**
> get_monitoring_oauth_events_stream(authorization=authorization, token=token)

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
    authorization = 'authorization_example' # str | Bearer token (optional)
    token = 'token_example' # str | Bearer token for authentication (since EventSource cannot send custom headers) (optional)

    try:
        # OAuth Events Stream
        api_instance.get_monitoring_oauth_events_stream(authorization=authorization, token=token)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_events_stream: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authorization** | **str**| Bearer token | [optional] 
 **token** | **str**| Bearer token for authentication (since EventSource cannot send custom headers) | [optional] 

### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_monitoring_oauth_health**
> get_monitoring_oauth_health(authorization=authorization)

Get System Health

Get OAuth system health metrics and alerts

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
    authorization = 'authorization_example' # str | Bearer token (optional)

    try:
        # Get System Health
        api_instance.get_monitoring_oauth_health(authorization=authorization)
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_monitoring_oauth_health: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authorization** | **str**| Bearer token | [optional] 

### Return type

void (empty response body)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_oauth_monitoring_websocket_info**
> get_oauth_monitoring_websocket_info()

WebSocket Connection Info

Information about the OAuth monitoring WebSocket endpoint

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
    api_instance = api_client.OauthMonitoringApi(api_client)

    try:
        # WebSocket Connection Info
        api_instance.get_oauth_monitoring_websocket_info()
    except Exception as e:
        print("Exception when calling OauthMonitoringApi->get_oauth_monitoring_websocket_info: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

