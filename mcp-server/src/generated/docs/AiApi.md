# api_client.AiApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_admin_ai_health**](AiApi.md#get_admin_ai_health) | **GET** /admin/ai/health | Get AI assistant health status
[**get_ai_health**](AiApi.md#get_ai_health) | **GET** /ai/health | Get AI assistant health status
[**head_admin_ai_chat**](AiApi.md#head_admin_ai_chat) | **HEAD** /admin/ai/chat | Check AI assistant availability
[**head_ai_chat**](AiApi.md#head_ai_chat) | **HEAD** /ai/chat | Check AI assistant availability
[**post_admin_ai_chat**](AiApi.md#post_admin_ai_chat) | **POST** /admin/ai/chat | Proxy AI assistant chat request
[**post_admin_ai_chat_stream**](AiApi.md#post_admin_ai_chat_stream) | **POST** /admin/ai/chat/stream | Proxy AI assistant streaming chat request
[**post_ai_chat**](AiApi.md#post_ai_chat) | **POST** /ai/chat | Proxy AI assistant chat request
[**post_ai_chat_stream**](AiApi.md#post_ai_chat_stream) | **POST** /ai/chat/stream | Proxy AI assistant streaming chat request


# **get_admin_ai_health**
> Dict[str, object] get_admin_ai_health()

Get AI assistant health status

Returns health status including OpenAI availability and backend authentication status.

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
    api_instance = api_client.AiApi(api_client)

    try:
        # Get AI assistant health status
        api_response = api_instance.get_admin_ai_health()
        print("The response of AiApi->get_admin_ai_health:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AiApi->get_admin_ai_health: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

**Dict[str, object]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | AI assistant health status including OpenAI availability |  -  |
**422** | Response for status 422 |  -  |
**503** | Response for status 503 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_ai_health**
> Dict[str, object] get_ai_health()

Get AI assistant health status

Returns health status including OpenAI availability and backend authentication status.

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
    api_instance = api_client.AiApi(api_client)

    try:
        # Get AI assistant health status
        api_response = api_instance.get_ai_health()
        print("The response of AiApi->get_ai_health:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AiApi->get_ai_health: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

**Dict[str, object]**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | AI assistant health status including OpenAI availability |  -  |
**422** | Response for status 422 |  -  |
**503** | Response for status 503 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **head_admin_ai_chat**
> head_admin_ai_chat()

Check AI assistant availability

Returns 200 when the AI assistant backend is reachable.

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
    api_instance = api_client.AiApi(api_client)

    try:
        # Check AI assistant availability
        api_instance.head_admin_ai_chat()
    except Exception as e:
        print("Exception when calling AiApi->head_admin_ai_chat: %s\n" % e)
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


[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **head_ai_chat**
> head_ai_chat()

Check AI assistant availability

Returns 200 when the AI assistant backend is reachable.

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
    api_instance = api_client.AiApi(api_client)

    try:
        # Check AI assistant availability
        api_instance.head_ai_chat()
    except Exception as e:
        print("Exception when calling AiApi->head_ai_chat: %s\n" % e)
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


[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_admin_ai_chat**
> ChatResponse post_admin_ai_chat(chat_request)

Proxy AI assistant chat request

Forwards chat prompts to the MCP AI assistant server and returns enriched responses.

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.chat_request import ChatRequest
from api_client.models.chat_response import ChatResponse
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
    api_instance = api_client.AiApi(api_client)
    chat_request = api_client.ChatRequest() # ChatRequest | 

    try:
        # Proxy AI assistant chat request
        api_response = api_instance.post_admin_ai_chat(chat_request)
        print("The response of AiApi->post_admin_ai_chat:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AiApi->post_admin_ai_chat: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **chat_request** | [**ChatRequest**](ChatRequest.md)|  | 

### Return type

[**ChatResponse**](ChatResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |
**400** | Response for status 400 |  -  |
**422** | Response for status 422 |  -  |
**502** | Response for status 502 |  -  |
**503** | Response for status 503 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_admin_ai_chat_stream**
> Dict[str, object] post_admin_ai_chat_stream(chat_request)

Proxy AI assistant streaming chat request

Forwards chat prompts to the MCP AI assistant server and streams the response using Server-Sent Events (SSE).

**Stream Event Types:**
The response is a stream of `data: {...}` events, where each event is a JSON object matching the StreamChunk schema:
- `{type: 'sources', sources: [...], mode?: string, confidence?: number}` - Relevant document sources
- `{type: 'content', content: string}` - Response text chunk
- `{type: 'reasoning', content: string}` - AI reasoning/thinking process
- `{type: 'reasoning_done'}` - End of reasoning phase
- `{type: 'function_calling', name: string}` - Function being called
- `{type: 'done', mode?: string, confidence?: number}` - End of stream
- `{type: 'error', error: string}` - Error occurred

See the `StreamChunk` schema component for full type definitions.

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.chat_request import ChatRequest
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
    api_instance = api_client.AiApi(api_client)
    chat_request = api_client.ChatRequest() # ChatRequest | 

    try:
        # Proxy AI assistant streaming chat request
        api_response = api_instance.post_admin_ai_chat_stream(chat_request)
        print("The response of AiApi->post_admin_ai_chat_stream:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AiApi->post_admin_ai_chat_stream: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **chat_request** | [**ChatRequest**](ChatRequest.md)|  | 

### Return type

**Dict[str, object]**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Server-sent events stream response containing StreamChunk events |  -  |
**502** | Response for status 502 |  -  |
**503** | Response for status 503 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_ai_chat**
> ChatResponse post_ai_chat(chat_request)

Proxy AI assistant chat request

Forwards chat prompts to the MCP AI assistant server and returns enriched responses.

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.chat_request import ChatRequest
from api_client.models.chat_response import ChatResponse
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
    api_instance = api_client.AiApi(api_client)
    chat_request = api_client.ChatRequest() # ChatRequest | 

    try:
        # Proxy AI assistant chat request
        api_response = api_instance.post_ai_chat(chat_request)
        print("The response of AiApi->post_ai_chat:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AiApi->post_ai_chat: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **chat_request** | [**ChatRequest**](ChatRequest.md)|  | 

### Return type

[**ChatResponse**](ChatResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |
**400** | Response for status 400 |  -  |
**422** | Response for status 422 |  -  |
**502** | Response for status 502 |  -  |
**503** | Response for status 503 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_ai_chat_stream**
> Dict[str, object] post_ai_chat_stream(chat_request)

Proxy AI assistant streaming chat request

Forwards chat prompts to the MCP AI assistant server and streams the response using Server-Sent Events (SSE).

**Stream Event Types:**
The response is a stream of `data: {...}` events, where each event is a JSON object matching the StreamChunk schema:
- `{type: 'sources', sources: [...], mode?: string, confidence?: number}` - Relevant document sources
- `{type: 'content', content: string}` - Response text chunk
- `{type: 'reasoning', content: string}` - AI reasoning/thinking process
- `{type: 'reasoning_done'}` - End of reasoning phase
- `{type: 'function_calling', name: string}` - Function being called
- `{type: 'done', mode?: string, confidence?: number}` - End of stream
- `{type: 'error', error: string}` - Error occurred

See the `StreamChunk` schema component for full type definitions.

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.chat_request import ChatRequest
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
    api_instance = api_client.AiApi(api_client)
    chat_request = api_client.ChatRequest() # ChatRequest | 

    try:
        # Proxy AI assistant streaming chat request
        api_response = api_instance.post_ai_chat_stream(chat_request)
        print("The response of AiApi->post_ai_chat_stream:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AiApi->post_ai_chat_stream: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **chat_request** | [**ChatRequest**](ChatRequest.md)|  | 

### Return type

**Dict[str, object]**

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Server-sent events stream response containing StreamChunk events |  -  |
**422** | Response for status 422 |  -  |
**502** | Response for status 502 |  -  |
**503** | Response for status 503 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

