# api_client.SmartAppsApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**delete_admin_smart_apps_by_client_id**](SmartAppsApi.md#delete_admin_smart_apps_by_client_id) | **DELETE** /admin/smart-apps/{clientId} | Delete SMART on FHIR Application
[**get_admin_smart_apps**](SmartAppsApi.md#get_admin_smart_apps) | **GET** /admin/smart-apps/ | List SMART on FHIR Applications
[**get_admin_smart_apps_by_client_id**](SmartAppsApi.md#get_admin_smart_apps_by_client_id) | **GET** /admin/smart-apps/{clientId} | Get SMART on FHIR Application
[**post_admin_smart_apps**](SmartAppsApi.md#post_admin_smart_apps) | **POST** /admin/smart-apps/ | Create SMART on FHIR Application
[**put_admin_smart_apps_by_client_id**](SmartAppsApi.md#put_admin_smart_apps_by_client_id) | **PUT** /admin/smart-apps/{clientId} | Update SMART on FHIR Application


# **delete_admin_smart_apps_by_client_id**
> SuccessResponse delete_admin_smart_apps_by_client_id(client_id)

Delete SMART on FHIR Application

Delete a SMART on FHIR application by clientId

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.success_response import SuccessResponse
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
    client_id = 'client_id_example' # str | 

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
 **client_id** | **str**|  | 

### Return type

[**SuccessResponse**](SuccessResponse.md)

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
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_admin_smart_apps**
> List[SmartApp] get_admin_smart_apps()

List SMART on FHIR Applications

Get all registered SMART on FHIR applications

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.smart_app import SmartApp
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

[**List[SmartApp]**](SmartApp.md)

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
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_admin_smart_apps_by_client_id**
> SmartApp get_admin_smart_apps_by_client_id(client_id)

Get SMART on FHIR Application

Get a single SMART on FHIR application by clientId

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.smart_app import SmartApp
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
    client_id = 'client_id_example' # str | 

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
 **client_id** | **str**|  | 

### Return type

[**SmartApp**](SmartApp.md)

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
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_admin_smart_apps**
> SmartApp post_admin_smart_apps(create_smart_app_request)

Create SMART on FHIR Application

Create a new SMART on FHIR application

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.create_smart_app_request import CreateSmartAppRequest
from api_client.models.smart_app import SmartApp
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
    create_smart_app_request = api_client.CreateSmartAppRequest() # CreateSmartAppRequest | 

    try:
        # Create SMART on FHIR Application
        api_response = api_instance.post_admin_smart_apps(create_smart_app_request)
        print("The response of SmartAppsApi->post_admin_smart_apps:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SmartAppsApi->post_admin_smart_apps: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **create_smart_app_request** | [**CreateSmartAppRequest**](CreateSmartAppRequest.md)|  | 

### Return type

[**SmartApp**](SmartApp.md)

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
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **put_admin_smart_apps_by_client_id**
> SuccessResponse put_admin_smart_apps_by_client_id(client_id, update_smart_app_request)

Update SMART on FHIR Application

Update an existing SMART on FHIR application

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.success_response import SuccessResponse
from api_client.models.update_smart_app_request import UpdateSmartAppRequest
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
    client_id = 'client_id_example' # str | 
    update_smart_app_request = api_client.UpdateSmartAppRequest() # UpdateSmartAppRequest | 

    try:
        # Update SMART on FHIR Application
        api_response = api_instance.put_admin_smart_apps_by_client_id(client_id, update_smart_app_request)
        print("The response of SmartAppsApi->put_admin_smart_apps_by_client_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling SmartAppsApi->put_admin_smart_apps_by_client_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **client_id** | **str**|  | 
 **update_smart_app_request** | [**UpdateSmartAppRequest**](UpdateSmartAppRequest.md)|  | 

### Return type

[**SuccessResponse**](SuccessResponse.md)

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
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

