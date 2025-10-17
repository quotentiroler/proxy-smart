# api_client.IdentityProvidersApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**delete_admin_idps_by_alias**](IdentityProvidersApi.md#delete_admin_idps_by_alias) | **DELETE** /admin/idps/{alias} | Delete Identity Provider
[**get_admin_idps**](IdentityProvidersApi.md#get_admin_idps) | **GET** /admin/idps/ | List Identity Providers
[**get_admin_idps_by_alias**](IdentityProvidersApi.md#get_admin_idps_by_alias) | **GET** /admin/idps/{alias} | Get Identity Provider
[**get_admin_idps_count**](IdentityProvidersApi.md#get_admin_idps_count) | **GET** /admin/idps/count | Get Identity Providers Count
[**post_admin_idps**](IdentityProvidersApi.md#post_admin_idps) | **POST** /admin/idps/ | Create Identity Provider
[**put_admin_idps_by_alias**](IdentityProvidersApi.md#put_admin_idps_by_alias) | **PUT** /admin/idps/{alias} | Update Identity Provider


# **delete_admin_idps_by_alias**
> SuccessResponse delete_admin_idps_by_alias(alias)

Delete Identity Provider

Delete an identity provider by alias

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
    api_instance = api_client.IdentityProvidersApi(api_client)
    alias = 'alias_example' # str | 

    try:
        # Delete Identity Provider
        api_response = api_instance.delete_admin_idps_by_alias(alias)
        print("The response of IdentityProvidersApi->delete_admin_idps_by_alias:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling IdentityProvidersApi->delete_admin_idps_by_alias: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **alias** | **str**|  | 

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

# **get_admin_idps**
> List[IdentityProviderResponse] get_admin_idps()

List Identity Providers

Get all configured identity providers

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.identity_provider_response import IdentityProviderResponse
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
    api_instance = api_client.IdentityProvidersApi(api_client)

    try:
        # List Identity Providers
        api_response = api_instance.get_admin_idps()
        print("The response of IdentityProvidersApi->get_admin_idps:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling IdentityProvidersApi->get_admin_idps: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[IdentityProviderResponse]**](IdentityProviderResponse.md)

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

# **get_admin_idps_by_alias**
> IdentityProviderResponse get_admin_idps_by_alias(alias)

Get Identity Provider

Get an identity provider by alias

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.identity_provider_response import IdentityProviderResponse
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
    api_instance = api_client.IdentityProvidersApi(api_client)
    alias = 'alias_example' # str | 

    try:
        # Get Identity Provider
        api_response = api_instance.get_admin_idps_by_alias(alias)
        print("The response of IdentityProvidersApi->get_admin_idps_by_alias:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling IdentityProvidersApi->get_admin_idps_by_alias: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **alias** | **str**|  | 

### Return type

[**IdentityProviderResponse**](IdentityProviderResponse.md)

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

# **get_admin_idps_count**
> CountResponse get_admin_idps_count()

Get Identity Providers Count

Get the count of enabled and total identity providers

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.count_response import CountResponse
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
    api_instance = api_client.IdentityProvidersApi(api_client)

    try:
        # Get Identity Providers Count
        api_response = api_instance.get_admin_idps_count()
        print("The response of IdentityProvidersApi->get_admin_idps_count:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling IdentityProvidersApi->get_admin_idps_count: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**CountResponse**](CountResponse.md)

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

# **post_admin_idps**
> IdentityProviderResponse post_admin_idps(create_identity_provider_request)

Create Identity Provider

Create a new identity provider

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.create_identity_provider_request import CreateIdentityProviderRequest
from api_client.models.identity_provider_response import IdentityProviderResponse
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
    api_instance = api_client.IdentityProvidersApi(api_client)
    create_identity_provider_request = api_client.CreateIdentityProviderRequest() # CreateIdentityProviderRequest | 

    try:
        # Create Identity Provider
        api_response = api_instance.post_admin_idps(create_identity_provider_request)
        print("The response of IdentityProvidersApi->post_admin_idps:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling IdentityProvidersApi->post_admin_idps: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **create_identity_provider_request** | [**CreateIdentityProviderRequest**](CreateIdentityProviderRequest.md)|  | 

### Return type

[**IdentityProviderResponse**](IdentityProviderResponse.md)

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

# **put_admin_idps_by_alias**
> SuccessResponse put_admin_idps_by_alias(alias, update_identity_provider_request)

Update Identity Provider

Update an identity provider by alias

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.success_response import SuccessResponse
from api_client.models.update_identity_provider_request import UpdateIdentityProviderRequest
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
    api_instance = api_client.IdentityProvidersApi(api_client)
    alias = 'alias_example' # str | 
    update_identity_provider_request = api_client.UpdateIdentityProviderRequest() # UpdateIdentityProviderRequest | 

    try:
        # Update Identity Provider
        api_response = api_instance.put_admin_idps_by_alias(alias, update_identity_provider_request)
        print("The response of IdentityProvidersApi->put_admin_idps_by_alias:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling IdentityProvidersApi->put_admin_idps_by_alias: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **alias** | **str**|  | 
 **update_identity_provider_request** | [**UpdateIdentityProviderRequest**](UpdateIdentityProviderRequest.md)|  | 

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

