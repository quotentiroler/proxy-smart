# api_client.AiApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**head_ai_chat**](AiApi.md#head_ai_chat) | **HEAD** /ai/chat | Check AI assistant availability
[**post_ai_chat**](AiApi.md#post_ai_chat) | **POST** /ai/chat | Proxy AI assistant chat request
[**post_ai_chat_stream**](AiApi.md#post_ai_chat_stream) | **POST** /ai/chat/stream | Proxy AI assistant streaming chat request


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

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_ai_chat**
> PostAiChat200Response post_ai_chat(post_ai_chat_request)

Proxy AI assistant chat request

Forwards chat prompts to the MCP AI assistant server and returns enriched responses.

### Example


```python
import api_client
from api_client.models.post_ai_chat200_response import PostAiChat200Response
from api_client.models.post_ai_chat_request import PostAiChatRequest
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
    post_ai_chat_request = api_client.PostAiChatRequest() # PostAiChatRequest | 

    try:
        # Proxy AI assistant chat request
        api_response = api_instance.post_ai_chat(post_ai_chat_request)
        print("The response of AiApi->post_ai_chat:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AiApi->post_ai_chat: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_ai_chat_request** | [**PostAiChatRequest**](PostAiChatRequest.md)|  | 

### Return type

[**PostAiChat200Response**](PostAiChat200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, multipart/form-data, text/plain
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |
**400** |  |  -  |
**502** |  |  -  |
**503** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_ai_chat_stream**
> post_ai_chat_stream(post_ai_chat_request)

Proxy AI assistant streaming chat request

Forwards chat prompts to the MCP AI assistant server and streams the response using Server-Sent Events (SSE).

### Example


```python
import api_client
from api_client.models.post_ai_chat_request import PostAiChatRequest
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
    post_ai_chat_request = api_client.PostAiChatRequest() # PostAiChatRequest | 

    try:
        # Proxy AI assistant streaming chat request
        api_instance.post_ai_chat_stream(post_ai_chat_request)
    except Exception as e:
        print("Exception when calling AiApi->post_ai_chat_stream: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_ai_chat_request** | [**PostAiChatRequest**](PostAiChatRequest.md)|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, multipart/form-data, text/plain
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

