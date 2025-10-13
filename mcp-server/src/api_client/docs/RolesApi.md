# api_client.RolesApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**delete_admin_roles_by_role_name**](RolesApi.md#delete_admin_roles_by_role_name) | **DELETE** /admin/roles/{roleName} | Delete Healthcare Role
[**get_admin_roles**](RolesApi.md#get_admin_roles) | **GET** /admin/roles/ | List All Roles
[**get_admin_roles_by_role_name**](RolesApi.md#get_admin_roles_by_role_name) | **GET** /admin/roles/{roleName} | Get Healthcare Role
[**post_admin_roles**](RolesApi.md#post_admin_roles) | **POST** /admin/roles/ | Create Healthcare Role
[**put_admin_roles_by_role_name**](RolesApi.md#put_admin_roles_by_role_name) | **PUT** /admin/roles/{roleName} | Update Healthcare Role


# **delete_admin_roles_by_role_name**
> DeleteAdminRolesByRoleName200Response delete_admin_roles_by_role_name(role_name)

Delete Healthcare Role

Delete a healthcare-specific role by name

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
    api_instance = api_client.RolesApi(api_client)
    role_name = 'role_name_example' # str | 

    try:
        # Delete Healthcare Role
        api_response = api_instance.delete_admin_roles_by_role_name(role_name)
        print("The response of RolesApi->delete_admin_roles_by_role_name:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RolesApi->delete_admin_roles_by_role_name: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **role_name** | **str**|  | 

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
**400** |  |  -  |
**401** |  |  -  |
**404** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_admin_roles**
> List[GetAdminRoles200ResponseInner] get_admin_roles()

List All Roles

Get all roles

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_roles200_response_inner import GetAdminRoles200ResponseInner
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
    api_instance = api_client.RolesApi(api_client)

    try:
        # List All Roles
        api_response = api_instance.get_admin_roles()
        print("The response of RolesApi->get_admin_roles:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RolesApi->get_admin_roles: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[GetAdminRoles200ResponseInner]**](GetAdminRoles200ResponseInner.md)

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

# **get_admin_roles_by_role_name**
> GetAdminRoles200ResponseInner get_admin_roles_by_role_name(role_name)

Get Healthcare Role

Get a healthcare-specific role by name

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_roles200_response_inner import GetAdminRoles200ResponseInner
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
    api_instance = api_client.RolesApi(api_client)
    role_name = 'role_name_example' # str | 

    try:
        # Get Healthcare Role
        api_response = api_instance.get_admin_roles_by_role_name(role_name)
        print("The response of RolesApi->get_admin_roles_by_role_name:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RolesApi->get_admin_roles_by_role_name: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **role_name** | **str**|  | 

### Return type

[**GetAdminRoles200ResponseInner**](GetAdminRoles200ResponseInner.md)

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

# **post_admin_roles**
> GetAdminRoles200ResponseInner post_admin_roles(post_admin_roles_request)

Create Healthcare Role

Create a new healthcare-specific role

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_roles200_response_inner import GetAdminRoles200ResponseInner
from api_client.models.post_admin_roles_request import PostAdminRolesRequest
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
    api_instance = api_client.RolesApi(api_client)
    post_admin_roles_request = api_client.PostAdminRolesRequest() # PostAdminRolesRequest | 

    try:
        # Create Healthcare Role
        api_response = api_instance.post_admin_roles(post_admin_roles_request)
        print("The response of RolesApi->post_admin_roles:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RolesApi->post_admin_roles: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_admin_roles_request** | [**PostAdminRolesRequest**](PostAdminRolesRequest.md)|  | 

### Return type

[**GetAdminRoles200ResponseInner**](GetAdminRoles200ResponseInner.md)

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

# **put_admin_roles_by_role_name**
> PutAdminRolesByRoleName200Response put_admin_roles_by_role_name(role_name, put_admin_roles_by_role_name_request)

Update Healthcare Role

Update a healthcare-specific role by name

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.put_admin_roles_by_role_name200_response import PutAdminRolesByRoleName200Response
from api_client.models.put_admin_roles_by_role_name_request import PutAdminRolesByRoleNameRequest
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
    api_instance = api_client.RolesApi(api_client)
    role_name = 'role_name_example' # str | 
    put_admin_roles_by_role_name_request = api_client.PutAdminRolesByRoleNameRequest() # PutAdminRolesByRoleNameRequest | 

    try:
        # Update Healthcare Role
        api_response = api_instance.put_admin_roles_by_role_name(role_name, put_admin_roles_by_role_name_request)
        print("The response of RolesApi->put_admin_roles_by_role_name:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RolesApi->put_admin_roles_by_role_name: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **role_name** | **str**|  | 
 **put_admin_roles_by_role_name_request** | [**PutAdminRolesByRoleNameRequest**](PutAdminRolesByRoleNameRequest.md)|  | 

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
**404** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

