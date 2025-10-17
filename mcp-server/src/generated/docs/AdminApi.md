# api_client.AdminApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_admin_client_registration_settings**](AdminApi.md#get_admin_client_registration_settings) | **GET** /admin/client-registration/settings | Get Dynamic Client Registration Settings
[**get_admin_keycloak_config_status**](AdminApi.md#get_admin_keycloak_config_status) | **GET** /admin/keycloak-config/status | Get Keycloak Admin Configuration
[**post_admin_client_registration_reset_defaults**](AdminApi.md#post_admin_client_registration_reset_defaults) | **POST** /admin/client-registration/reset-defaults | Reset Client Registration Settings to Defaults
[**post_admin_keycloak_config_configure**](AdminApi.md#post_admin_keycloak_config_configure) | **POST** /admin/keycloak-config/configure | Configure Keycloak Connection
[**post_admin_keycloak_config_test**](AdminApi.md#post_admin_keycloak_config_test) | **POST** /admin/keycloak-config/test | Test Keycloak Connection
[**post_admin_restart**](AdminApi.md#post_admin_restart) | **POST** /admin/restart | Restart Server
[**post_admin_shutdown**](AdminApi.md#post_admin_shutdown) | **POST** /admin/shutdown | Shutdown Server
[**post_admin_smart_config_refresh**](AdminApi.md#post_admin_smart_config_refresh) | **POST** /admin/smart-config/refresh | Refresh SMART Configuration Cache
[**put_admin_client_registration_settings**](AdminApi.md#put_admin_client_registration_settings) | **PUT** /admin/client-registration/settings | Update Dynamic Client Registration Settings


# **get_admin_client_registration_settings**
> ClientRegistrationSettings get_admin_client_registration_settings()

Get Dynamic Client Registration Settings

Get current settings for dynamic client registration

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.client_registration_settings import ClientRegistrationSettings
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
    api_instance = api_client.AdminApi(api_client)

    try:
        # Get Dynamic Client Registration Settings
        api_response = api_instance.get_admin_client_registration_settings()
        print("The response of AdminApi->get_admin_client_registration_settings:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AdminApi->get_admin_client_registration_settings: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**ClientRegistrationSettings**](ClientRegistrationSettings.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |
**401** | Response for status 401 |  -  |
**403** | Response for status 403 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_admin_keycloak_config_status**
> KeycloakConfigResponse get_admin_keycloak_config_status()

Get Keycloak Admin Configuration

Get current Keycloak settings for administrative purposes. Use /auth/config for public availability check.

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.keycloak_config_response import KeycloakConfigResponse
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
    api_instance = api_client.AdminApi(api_client)

    try:
        # Get Keycloak Admin Configuration
        api_response = api_instance.get_admin_keycloak_config_status()
        print("The response of AdminApi->get_admin_keycloak_config_status:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AdminApi->get_admin_keycloak_config_status: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**KeycloakConfigResponse**](KeycloakConfigResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |
**422** | Response for status 422 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_admin_client_registration_reset_defaults**
> SuccessResponse post_admin_client_registration_reset_defaults()

Reset Client Registration Settings to Defaults

Reset all client registration settings to their default values

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
    api_instance = api_client.AdminApi(api_client)

    try:
        # Reset Client Registration Settings to Defaults
        api_response = api_instance.post_admin_client_registration_reset_defaults()
        print("The response of AdminApi->post_admin_client_registration_reset_defaults:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AdminApi->post_admin_client_registration_reset_defaults: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

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
**401** | Response for status 401 |  -  |
**403** | Response for status 403 |  -  |
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_admin_keycloak_config_configure**
> SaveKeycloakConfigResponse post_admin_keycloak_config_configure(save_keycloak_config_request)

Configure Keycloak Connection

Save Keycloak configuration to environment and restart connection

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.save_keycloak_config_request import SaveKeycloakConfigRequest
from api_client.models.save_keycloak_config_response import SaveKeycloakConfigResponse
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
    api_instance = api_client.AdminApi(api_client)
    save_keycloak_config_request = api_client.SaveKeycloakConfigRequest() # SaveKeycloakConfigRequest | 

    try:
        # Configure Keycloak Connection
        api_response = api_instance.post_admin_keycloak_config_configure(save_keycloak_config_request)
        print("The response of AdminApi->post_admin_keycloak_config_configure:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AdminApi->post_admin_keycloak_config_configure: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **save_keycloak_config_request** | [**SaveKeycloakConfigRequest**](SaveKeycloakConfigRequest.md)|  | 

### Return type

[**SaveKeycloakConfigResponse**](SaveKeycloakConfigResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_admin_keycloak_config_test**
> TestKeycloakConnectionResponse post_admin_keycloak_config_test(test_keycloak_connection_request)

Test Keycloak Connection

Test connection to Keycloak without saving configuration

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.test_keycloak_connection_request import TestKeycloakConnectionRequest
from api_client.models.test_keycloak_connection_response import TestKeycloakConnectionResponse
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
    api_instance = api_client.AdminApi(api_client)
    test_keycloak_connection_request = api_client.TestKeycloakConnectionRequest() # TestKeycloakConnectionRequest | 

    try:
        # Test Keycloak Connection
        api_response = api_instance.post_admin_keycloak_config_test(test_keycloak_connection_request)
        print("The response of AdminApi->post_admin_keycloak_config_test:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AdminApi->post_admin_keycloak_config_test: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **test_keycloak_connection_request** | [**TestKeycloakConnectionRequest**](TestKeycloakConnectionRequest.md)|  | 

### Return type

[**TestKeycloakConnectionResponse**](TestKeycloakConnectionResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_admin_restart**
> ServerOperationResponse post_admin_restart()

Restart Server

Restart the SMART on FHIR server (admin only)

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.server_operation_response import ServerOperationResponse
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
    api_instance = api_client.AdminApi(api_client)

    try:
        # Restart Server
        api_response = api_instance.post_admin_restart()
        print("The response of AdminApi->post_admin_restart:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AdminApi->post_admin_restart: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**ServerOperationResponse**](ServerOperationResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

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

# **post_admin_shutdown**
> ServerOperationResponse post_admin_shutdown()

Shutdown Server

Gracefully shutdown the SMART on FHIR server (admin only)

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.server_operation_response import ServerOperationResponse
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
    api_instance = api_client.AdminApi(api_client)

    try:
        # Shutdown Server
        api_response = api_instance.post_admin_shutdown()
        print("The response of AdminApi->post_admin_shutdown:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AdminApi->post_admin_shutdown: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**ServerOperationResponse**](ServerOperationResponse.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

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

# **post_admin_smart_config_refresh**
> SmartConfigRefreshResponse post_admin_smart_config_refresh()

Refresh SMART Configuration Cache

Manually refresh the cached SMART configuration from Keycloak

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.smart_config_refresh_response import SmartConfigRefreshResponse
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
    api_instance = api_client.AdminApi(api_client)

    try:
        # Refresh SMART Configuration Cache
        api_response = api_instance.post_admin_smart_config_refresh()
        print("The response of AdminApi->post_admin_smart_config_refresh:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AdminApi->post_admin_smart_config_refresh: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**SmartConfigRefreshResponse**](SmartConfigRefreshResponse.md)

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

# **put_admin_client_registration_settings**
> SuccessResponse put_admin_client_registration_settings(client_registration_settings)

Update Dynamic Client Registration Settings

Update settings for dynamic client registration

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.client_registration_settings import ClientRegistrationSettings
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
    api_instance = api_client.AdminApi(api_client)
    client_registration_settings = api_client.ClientRegistrationSettings() # ClientRegistrationSettings | 

    try:
        # Update Dynamic Client Registration Settings
        api_response = api_instance.put_admin_client_registration_settings(client_registration_settings)
        print("The response of AdminApi->put_admin_client_registration_settings:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AdminApi->put_admin_client_registration_settings: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **client_registration_settings** | [**ClientRegistrationSettings**](ClientRegistrationSettings.md)|  | 

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
**500** | Response for status 500 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

