# api_client.ServersApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_fhir_servers**](ServersApi.md#get_fhir_servers) | **GET** /fhir-servers/ | List Available FHIR Servers
[**get_fhir_servers_by_server_id**](ServersApi.md#get_fhir_servers_by_server_id) | **GET** /fhir-servers/{server_id} | Get Server Information
[**get_fhir_servers_by_server_id_mtls**](ServersApi.md#get_fhir_servers_by_server_id_mtls) | **GET** /fhir-servers/{server_id}/mtls | Get mTLS Configuration
[**post_fhir_servers**](ServersApi.md#post_fhir_servers) | **POST** /fhir-servers/ | Add New FHIR Server
[**post_fhir_servers_by_server_id_mtls_certificates**](ServersApi.md#post_fhir_servers_by_server_id_mtls_certificates) | **POST** /fhir-servers/{server_id}/mtls/certificates | Upload Certificate
[**put_fhir_servers_by_server_id**](ServersApi.md#put_fhir_servers_by_server_id) | **PUT** /fhir-servers/{server_id} | Update FHIR Server
[**put_fhir_servers_by_server_id_mtls**](ServersApi.md#put_fhir_servers_by_server_id_mtls) | **PUT** /fhir-servers/{server_id}/mtls | Update mTLS Configuration


# **get_fhir_servers**
> GetFhirServers200Response get_fhir_servers()

List Available FHIR Servers

Get a list of all configured FHIR servers with their connection information and endpoints

### Example


```python
import api_client
from api_client.models.get_fhir_servers200_response import GetFhirServers200Response
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
    api_instance = api_client.ServersApi(api_client)

    try:
        # List Available FHIR Servers
        api_response = api_instance.get_fhir_servers()
        print("The response of ServersApi->get_fhir_servers:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServersApi->get_fhir_servers: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**GetFhirServers200Response**](GetFhirServers200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_fhir_servers_by_server_id**
> GetFhirServersByServerId200Response get_fhir_servers_by_server_id(server_id)

Get Server Information

Get detailed information about a specific FHIR server

### Example


```python
import api_client
from api_client.models.get_fhir_servers_by_server_id200_response import GetFhirServersByServerId200Response
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
    api_instance = api_client.ServersApi(api_client)
    server_id = 'server_id_example' # str | FHIR server identifier

    try:
        # Get Server Information
        api_response = api_instance.get_fhir_servers_by_server_id(server_id)
        print("The response of ServersApi->get_fhir_servers_by_server_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServersApi->get_fhir_servers_by_server_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **server_id** | **str**| FHIR server identifier | 

### Return type

[**GetFhirServersByServerId200Response**](GetFhirServersByServerId200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |
**404** |  |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_fhir_servers_by_server_id_mtls**
> GetFhirServersByServerIdMtls200Response get_fhir_servers_by_server_id_mtls(server_id)

Get mTLS Configuration

Get the mutual TLS configuration for a specific FHIR server

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_fhir_servers_by_server_id_mtls200_response import GetFhirServersByServerIdMtls200Response
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
    api_instance = api_client.ServersApi(api_client)
    server_id = 'server_id_example' # str | FHIR server identifier

    try:
        # Get mTLS Configuration
        api_response = api_instance.get_fhir_servers_by_server_id_mtls(server_id)
        print("The response of ServersApi->get_fhir_servers_by_server_id_mtls:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServersApi->get_fhir_servers_by_server_id_mtls: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **server_id** | **str**| FHIR server identifier | 

### Return type

[**GetFhirServersByServerIdMtls200Response**](GetFhirServersByServerIdMtls200Response.md)

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
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_fhir_servers**
> PostFhirServers200Response post_fhir_servers(post_fhir_servers_request)

Add New FHIR Server

Add a new FHIR server to the system by providing its base URL

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.post_fhir_servers200_response import PostFhirServers200Response
from api_client.models.post_fhir_servers_request import PostFhirServersRequest
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
    api_instance = api_client.ServersApi(api_client)
    post_fhir_servers_request = api_client.PostFhirServersRequest() # PostFhirServersRequest | 

    try:
        # Add New FHIR Server
        api_response = api_instance.post_fhir_servers(post_fhir_servers_request)
        print("The response of ServersApi->post_fhir_servers:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServersApi->post_fhir_servers: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_fhir_servers_request** | [**PostFhirServersRequest**](PostFhirServersRequest.md)|  | 

### Return type

[**PostFhirServers200Response**](PostFhirServers200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json, multipart/form-data, text/plain
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |
**401** |  |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_fhir_servers_by_server_id_mtls_certificates**
> PostFhirServersByServerIdMtlsCertificates200Response post_fhir_servers_by_server_id_mtls_certificates(server_id, post_fhir_servers_by_server_id_mtls_certificates_request)

Upload Certificate

Upload a certificate or private key for mTLS authentication

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.post_fhir_servers_by_server_id_mtls_certificates200_response import PostFhirServersByServerIdMtlsCertificates200Response
from api_client.models.post_fhir_servers_by_server_id_mtls_certificates_request import PostFhirServersByServerIdMtlsCertificatesRequest
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
    api_instance = api_client.ServersApi(api_client)
    server_id = 'server_id_example' # str | FHIR server identifier
    post_fhir_servers_by_server_id_mtls_certificates_request = api_client.PostFhirServersByServerIdMtlsCertificatesRequest() # PostFhirServersByServerIdMtlsCertificatesRequest | 

    try:
        # Upload Certificate
        api_response = api_instance.post_fhir_servers_by_server_id_mtls_certificates(server_id, post_fhir_servers_by_server_id_mtls_certificates_request)
        print("The response of ServersApi->post_fhir_servers_by_server_id_mtls_certificates:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServersApi->post_fhir_servers_by_server_id_mtls_certificates: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **server_id** | **str**| FHIR server identifier | 
 **post_fhir_servers_by_server_id_mtls_certificates_request** | [**PostFhirServersByServerIdMtlsCertificatesRequest**](PostFhirServersByServerIdMtlsCertificatesRequest.md)|  | 

### Return type

[**PostFhirServersByServerIdMtlsCertificates200Response**](PostFhirServersByServerIdMtlsCertificates200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json, multipart/form-data, text/plain
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |
**400** |  |  -  |
**401** |  |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **put_fhir_servers_by_server_id**
> PutFhirServersByServerId200Response put_fhir_servers_by_server_id(server_id, put_fhir_servers_by_server_id_request)

Update FHIR Server

Update an existing FHIR server by providing its new base URL

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.put_fhir_servers_by_server_id200_response import PutFhirServersByServerId200Response
from api_client.models.put_fhir_servers_by_server_id_request import PutFhirServersByServerIdRequest
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
    api_instance = api_client.ServersApi(api_client)
    server_id = 'server_id_example' # str | Server identifier to update
    put_fhir_servers_by_server_id_request = api_client.PutFhirServersByServerIdRequest() # PutFhirServersByServerIdRequest | 

    try:
        # Update FHIR Server
        api_response = api_instance.put_fhir_servers_by_server_id(server_id, put_fhir_servers_by_server_id_request)
        print("The response of ServersApi->put_fhir_servers_by_server_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServersApi->put_fhir_servers_by_server_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **server_id** | **str**| Server identifier to update | 
 **put_fhir_servers_by_server_id_request** | [**PutFhirServersByServerIdRequest**](PutFhirServersByServerIdRequest.md)|  | 

### Return type

[**PutFhirServersByServerId200Response**](PutFhirServersByServerId200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json, multipart/form-data, text/plain
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |
**400** |  |  -  |
**401** |  |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **put_fhir_servers_by_server_id_mtls**
> PutFhirServersByServerIdMtls200Response put_fhir_servers_by_server_id_mtls(server_id, put_fhir_servers_by_server_id_mtls_request)

Update mTLS Configuration

Enable or disable mutual TLS for a specific FHIR server

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.put_fhir_servers_by_server_id_mtls200_response import PutFhirServersByServerIdMtls200Response
from api_client.models.put_fhir_servers_by_server_id_mtls_request import PutFhirServersByServerIdMtlsRequest
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
    api_instance = api_client.ServersApi(api_client)
    server_id = 'server_id_example' # str | FHIR server identifier
    put_fhir_servers_by_server_id_mtls_request = api_client.PutFhirServersByServerIdMtlsRequest() # PutFhirServersByServerIdMtlsRequest | 

    try:
        # Update mTLS Configuration
        api_response = api_instance.put_fhir_servers_by_server_id_mtls(server_id, put_fhir_servers_by_server_id_mtls_request)
        print("The response of ServersApi->put_fhir_servers_by_server_id_mtls:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServersApi->put_fhir_servers_by_server_id_mtls: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **server_id** | **str**| FHIR server identifier | 
 **put_fhir_servers_by_server_id_mtls_request** | [**PutFhirServersByServerIdMtlsRequest**](PutFhirServersByServerIdMtlsRequest.md)|  | 

### Return type

[**PutFhirServersByServerIdMtls200Response**](PutFhirServersByServerIdMtls200Response.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json, multipart/form-data, text/plain
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |
**401** |  |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

