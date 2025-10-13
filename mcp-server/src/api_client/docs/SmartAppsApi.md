# api_client.SmartAppsApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**delete_admin_smart_apps_by_client_id**](SmartAppsApi.md#delete_admin_smart_apps_by_client_id) | **DELETE** /admin/smart-apps/{clientId} | Delete SMART on FHIR Application
[**get_admin_smart_apps**](SmartAppsApi.md#get_admin_smart_apps) | **GET** /admin/smart-apps/ | List SMART on FHIR Applications
[**get_admin_smart_apps_by_client_id**](SmartAppsApi.md#get_admin_smart_apps_by_client_id) | **GET** /admin/smart-apps/{clientId} | Get SMART on FHIR Application
[**post_admin_smart_apps**](SmartAppsApi.md#post_admin_smart_apps) | **POST** /admin/smart-apps/ | Create SMART on FHIR Application
[**post_admin_smart_config_refresh**](SmartAppsApi.md#post_admin_smart_config_refresh) | **POST** /admin/smart-config/refresh | Refresh SMART Configuration Cache
[**put_admin_smart_apps_by_client_id**](SmartAppsApi.md#put_admin_smart_apps_by_client_id) | **PUT** /admin/smart-apps/{clientId} | Update SMART on FHIR Application


# **delete_admin_smart_apps_by_client_id**
> PutAdminSmartAppsByClientId200Response delete_admin_smart_apps_by_client_id(client_id)

Delete SMART on FHIR Application

Delete a SMART on FHIR application by clientId

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.put_admin_smart_apps_by_client_id200_response import PutAdminSmartAppsByClientId200Response
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
    api_instance = api_client.SmartAppsApi(api_client)
    client_id = 'client_id_example' # str | SMART application client ID

    try:
        # Delete SMART on FHIR Application
        api_response = api_instance.delete_admin_smart_apps_by_client_id(client_id)
        print("The response of SmartAppsApi->delete_admin_smart_apps_by_client_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SmartAppsApi->delete_admin_smart_apps_by_client_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **client_id** | **str**| SMART application client ID | 

### Return type

[**PutAdminSmartAppsByClientId200Response**](PutAdminSmartAppsByClientId200Response.md)

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
**404** |  |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_admin_smart_apps**
> List[GetAdminSmartApps200ResponseInner] get_admin_smart_apps()

List SMART on FHIR Applications

Get all registered SMART on FHIR applications

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_smart_apps200_response_inner import GetAdminSmartApps200ResponseInner
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
    api_instance = api_client.SmartAppsApi(api_client)

    try:
        # List SMART on FHIR Applications
        api_response = api_instance.get_admin_smart_apps()
        print("The response of SmartAppsApi->get_admin_smart_apps:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SmartAppsApi->get_admin_smart_apps: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[GetAdminSmartApps200ResponseInner]**](GetAdminSmartApps200ResponseInner.md)

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

# **get_admin_smart_apps_by_client_id**
> GetAdminSmartApps200ResponseInner get_admin_smart_apps_by_client_id(client_id)

Get SMART on FHIR Application

Get a single SMART on FHIR application by clientId

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_smart_apps200_response_inner import GetAdminSmartApps200ResponseInner
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
    api_instance = api_client.SmartAppsApi(api_client)
    client_id = 'client_id_example' # str | SMART application client ID

    try:
        # Get SMART on FHIR Application
        api_response = api_instance.get_admin_smart_apps_by_client_id(client_id)
        print("The response of SmartAppsApi->get_admin_smart_apps_by_client_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SmartAppsApi->get_admin_smart_apps_by_client_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **client_id** | **str**| SMART application client ID | 

### Return type

[**GetAdminSmartApps200ResponseInner**](GetAdminSmartApps200ResponseInner.md)

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
**404** |  |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_admin_smart_apps**
> GetAdminSmartApps200ResponseInner post_admin_smart_apps(post_admin_smart_apps_request)

Create SMART on FHIR Application

Create a new SMART on FHIR application

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_smart_apps200_response_inner import GetAdminSmartApps200ResponseInner
from api_client.models.post_admin_smart_apps_request import PostAdminSmartAppsRequest
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
    api_instance = api_client.SmartAppsApi(api_client)
    post_admin_smart_apps_request = api_client.PostAdminSmartAppsRequest() # PostAdminSmartAppsRequest | 

    try:
        # Create SMART on FHIR Application
        api_response = api_instance.post_admin_smart_apps(post_admin_smart_apps_request)
        print("The response of SmartAppsApi->post_admin_smart_apps:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SmartAppsApi->post_admin_smart_apps: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_admin_smart_apps_request** | [**PostAdminSmartAppsRequest**](PostAdminSmartAppsRequest.md)|  | 

### Return type

[**GetAdminSmartApps200ResponseInner**](GetAdminSmartApps200ResponseInner.md)

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
**403** |  |  -  |
**404** |  |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_admin_smart_config_refresh**
> post_admin_smart_config_refresh()

Refresh SMART Configuration Cache

Manually refresh the cached SMART configuration from Keycloak

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
    api_instance = api_client.SmartAppsApi(api_client)

    try:
        # Refresh SMART Configuration Cache
        api_instance.post_admin_smart_config_refresh()
    except Exception as e:
        print("Exception when calling SmartAppsApi->post_admin_smart_config_refresh: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

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

# **put_admin_smart_apps_by_client_id**
> PutAdminSmartAppsByClientId200Response put_admin_smart_apps_by_client_id(client_id, put_admin_smart_apps_by_client_id_request)

Update SMART on FHIR Application

Update an existing SMART on FHIR application

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.put_admin_smart_apps_by_client_id200_response import PutAdminSmartAppsByClientId200Response
from api_client.models.put_admin_smart_apps_by_client_id_request import PutAdminSmartAppsByClientIdRequest
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
    api_instance = api_client.SmartAppsApi(api_client)
    client_id = 'client_id_example' # str | SMART application client ID
    put_admin_smart_apps_by_client_id_request = api_client.PutAdminSmartAppsByClientIdRequest() # PutAdminSmartAppsByClientIdRequest | 

    try:
        # Update SMART on FHIR Application
        api_response = api_instance.put_admin_smart_apps_by_client_id(client_id, put_admin_smart_apps_by_client_id_request)
        print("The response of SmartAppsApi->put_admin_smart_apps_by_client_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SmartAppsApi->put_admin_smart_apps_by_client_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **client_id** | **str**| SMART application client ID | 
 **put_admin_smart_apps_by_client_id_request** | [**PutAdminSmartAppsByClientIdRequest**](PutAdminSmartAppsByClientIdRequest.md)|  | 

### Return type

[**PutAdminSmartAppsByClientId200Response**](PutAdminSmartAppsByClientId200Response.md)

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
**403** |  |  -  |
**404** |  |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

