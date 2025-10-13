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
> DeleteAdminRolesByRoleName200Response delete_admin_idps_by_alias(alias)

Delete Identity Provider

Delete an identity provider by alias

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.delete_admin_roles_by_role_name200_response import DeleteAdminRolesByRoleName200Response
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

[**DeleteAdminRolesByRoleName200Response**](DeleteAdminRolesByRoleName200Response.md)

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
**404** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_admin_idps**
> List[GetAdminIdps200ResponseInner] get_admin_idps()

List Identity Providers

Get all configured identity providers

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_idps200_response_inner import GetAdminIdps200ResponseInner
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

[**List[GetAdminIdps200ResponseInner]**](GetAdminIdps200ResponseInner.md)

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

# **get_admin_idps_by_alias**
> GetAdminIdps200ResponseInner get_admin_idps_by_alias(alias)

Get Identity Provider

Get an identity provider by alias

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_idps200_response_inner import GetAdminIdps200ResponseInner
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

[**GetAdminIdps200ResponseInner**](GetAdminIdps200ResponseInner.md)

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
**404** |  |  -  |
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_admin_idps_count**
> GetAdminIdpsCount200Response get_admin_idps_count()

Get Identity Providers Count

Get the count of enabled and total identity providers

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_idps_count200_response import GetAdminIdpsCount200Response
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

[**GetAdminIdpsCount200Response**](GetAdminIdpsCount200Response.md)

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

# **post_admin_idps**
> GetAdminIdps200ResponseInner post_admin_idps(post_admin_idps_request)

Create Identity Provider

Create a new identity provider

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_idps200_response_inner import GetAdminIdps200ResponseInner
from api_client.models.post_admin_idps_request import PostAdminIdpsRequest
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
    post_admin_idps_request = api_client.PostAdminIdpsRequest() # PostAdminIdpsRequest | 

    try:
        # Create Identity Provider
        api_response = api_instance.post_admin_idps(post_admin_idps_request)
        print("The response of IdentityProvidersApi->post_admin_idps:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling IdentityProvidersApi->post_admin_idps: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_admin_idps_request** | [**PostAdminIdpsRequest**](PostAdminIdpsRequest.md)|  | 

### Return type

[**GetAdminIdps200ResponseInner**](GetAdminIdps200ResponseInner.md)

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **put_admin_idps_by_alias**
> PutAdminRolesByRoleName200Response put_admin_idps_by_alias(alias, put_admin_idps_by_alias_request)

Update Identity Provider

Update an identity provider by alias

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.put_admin_idps_by_alias_request import PutAdminIdpsByAliasRequest
from api_client.models.put_admin_roles_by_role_name200_response import PutAdminRolesByRoleName200Response
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
    put_admin_idps_by_alias_request = api_client.PutAdminIdpsByAliasRequest() # PutAdminIdpsByAliasRequest | 

    try:
        # Update Identity Provider
        api_response = api_instance.put_admin_idps_by_alias(alias, put_admin_idps_by_alias_request)
        print("The response of IdentityProvidersApi->put_admin_idps_by_alias:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling IdentityProvidersApi->put_admin_idps_by_alias: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **alias** | **str**|  | 
 **put_admin_idps_by_alias_request** | [**PutAdminIdpsByAliasRequest**](PutAdminIdpsByAliasRequest.md)|  | 

### Return type

[**PutAdminRolesByRoleName200Response**](PutAdminRolesByRoleName200Response.md)

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

