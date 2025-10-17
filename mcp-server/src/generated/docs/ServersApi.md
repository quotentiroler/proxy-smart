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
> FhirServerList get_fhir_servers()

List Available FHIR Servers

Get a list of all configured FHIR servers with their connection information and endpoints

### Example


```python
import api_client
from api_client.models.fhir_server_list import FhirServerList
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

[**FhirServerList**](FhirServerList.md)

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
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_fhir_servers_by_server_id**
> FhirServerDetails get_fhir_servers_by_server_id(server_id)

Get Server Information

Get detailed information about a specific FHIR server

### Example


```python
import api_client
from api_client.models.fhir_server_details import FhirServerDetails
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
    server_id = 'server_id_example' # str | 

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
 **server_id** | **str**|  | 

### Return type

[**FhirServerDetails**](FhirServerDetails.md)

### Authorization

No authorization required

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

# **get_fhir_servers_by_server_id_mtls**
> MtlsConfig get_fhir_servers_by_server_id_mtls(server_id)

Get mTLS Configuration

Get the mutual TLS configuration for a specific FHIR server

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.mtls_config import MtlsConfig
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
    server_id = 'server_id_example' # str | 

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
 **server_id** | **str**|  | 

### Return type

[**MtlsConfig**](MtlsConfig.md)

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

# **post_fhir_servers**
> AddFhirServerResponse post_fhir_servers(add_fhir_server_request)

Add New FHIR Server

Add a new FHIR server to the system by providing its base URL

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.add_fhir_server_request import AddFhirServerRequest
from api_client.models.add_fhir_server_response import AddFhirServerResponse
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
    add_fhir_server_request = api_client.AddFhirServerRequest() # AddFhirServerRequest | 

    try:
        # Add New FHIR Server
        api_response = api_instance.post_fhir_servers(add_fhir_server_request)
        print("The response of ServersApi->post_fhir_servers:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServersApi->post_fhir_servers: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **add_fhir_server_request** | [**AddFhirServerRequest**](AddFhirServerRequest.md)|  | 

### Return type

[**AddFhirServerResponse**](AddFhirServerResponse.md)

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
**401** | Response for status 401 |  -  |
**403** | Response for status 403 |  -  |
**404** | Response for status 404 |  -  |
**422** | Response for status 422 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_fhir_servers_by_server_id_mtls_certificates**
> CertificateUpload post_fhir_servers_by_server_id_mtls_certificates(server_id, upload_certificate_request)

Upload Certificate

Upload a certificate or private key for mTLS authentication

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.certificate_upload import CertificateUpload
from api_client.models.upload_certificate_request import UploadCertificateRequest
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
    server_id = 'server_id_example' # str | 
    upload_certificate_request = api_client.UploadCertificateRequest() # UploadCertificateRequest | 

    try:
        # Upload Certificate
        api_response = api_instance.post_fhir_servers_by_server_id_mtls_certificates(server_id, upload_certificate_request)
        print("The response of ServersApi->post_fhir_servers_by_server_id_mtls_certificates:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServersApi->post_fhir_servers_by_server_id_mtls_certificates: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **server_id** | **str**|  | 
 **upload_certificate_request** | [**UploadCertificateRequest**](UploadCertificateRequest.md)|  | 

### Return type

[**CertificateUpload**](CertificateUpload.md)

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
**401** | Response for status 401 |  -  |
**403** | Response for status 403 |  -  |
**404** | Response for status 404 |  -  |
**422** | Response for status 422 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **put_fhir_servers_by_server_id**
> UpdateFhirServerResponse put_fhir_servers_by_server_id(server_id, update_fhir_server_request)

Update FHIR Server

Update an existing FHIR server by providing its new base URL

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.update_fhir_server_request import UpdateFhirServerRequest
from api_client.models.update_fhir_server_response import UpdateFhirServerResponse
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
    server_id = 'server_id_example' # str | 
    update_fhir_server_request = api_client.UpdateFhirServerRequest() # UpdateFhirServerRequest | 

    try:
        # Update FHIR Server
        api_response = api_instance.put_fhir_servers_by_server_id(server_id, update_fhir_server_request)
        print("The response of ServersApi->put_fhir_servers_by_server_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServersApi->put_fhir_servers_by_server_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **server_id** | **str**|  | 
 **update_fhir_server_request** | [**UpdateFhirServerRequest**](UpdateFhirServerRequest.md)|  | 

### Return type

[**UpdateFhirServerResponse**](UpdateFhirServerResponse.md)

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
**401** | Response for status 401 |  -  |
**403** | Response for status 403 |  -  |
**404** | Response for status 404 |  -  |
**422** | Response for status 422 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **put_fhir_servers_by_server_id_mtls**
> UpdateMtlsConfigResponse put_fhir_servers_by_server_id_mtls(server_id, update_mtls_config_request)

Update mTLS Configuration

Enable or disable mutual TLS for a specific FHIR server

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.update_mtls_config_request import UpdateMtlsConfigRequest
from api_client.models.update_mtls_config_response import UpdateMtlsConfigResponse
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
    server_id = 'server_id_example' # str | 
    update_mtls_config_request = api_client.UpdateMtlsConfigRequest() # UpdateMtlsConfigRequest | 

    try:
        # Update mTLS Configuration
        api_response = api_instance.put_fhir_servers_by_server_id_mtls(server_id, update_mtls_config_request)
        print("The response of ServersApi->put_fhir_servers_by_server_id_mtls:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling ServersApi->put_fhir_servers_by_server_id_mtls: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **server_id** | **str**|  | 
 **update_mtls_config_request** | [**UpdateMtlsConfigRequest**](UpdateMtlsConfigRequest.md)|  | 

### Return type

[**UpdateMtlsConfigResponse**](UpdateMtlsConfigResponse.md)

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
**401** | Response for status 401 |  -  |
**403** | Response for status 403 |  -  |
**404** | Response for status 404 |  -  |
**422** | Response for status 422 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

