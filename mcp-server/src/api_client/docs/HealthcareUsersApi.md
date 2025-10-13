# api_client.HealthcareUsersApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**delete_admin_healthcare_users_by_user_id**](HealthcareUsersApi.md#delete_admin_healthcare_users_by_user_id) | **DELETE** /admin/healthcare-users/{userId} | Delete Healthcare User
[**get_admin_healthcare_users**](HealthcareUsersApi.md#get_admin_healthcare_users) | **GET** /admin/healthcare-users/ | List Healthcare Users
[**get_admin_healthcare_users_by_user_id**](HealthcareUsersApi.md#get_admin_healthcare_users_by_user_id) | **GET** /admin/healthcare-users/{userId} | Get Healthcare User
[**post_admin_healthcare_users**](HealthcareUsersApi.md#post_admin_healthcare_users) | **POST** /admin/healthcare-users/ | Create Healthcare User
[**put_admin_healthcare_users_by_user_id**](HealthcareUsersApi.md#put_admin_healthcare_users_by_user_id) | **PUT** /admin/healthcare-users/{userId} | Update Healthcare User


# **delete_admin_healthcare_users_by_user_id**
> PutAdminSmartAppsByClientId200Response delete_admin_healthcare_users_by_user_id(user_id)

Delete Healthcare User

Delete a healthcare user by userId

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
    api_instance = api_client.HealthcareUsersApi(api_client)
    user_id = 'user_id_example' # str | User ID

    try:
        # Delete Healthcare User
        api_response = api_instance.delete_admin_healthcare_users_by_user_id(user_id)
        print("The response of HealthcareUsersApi->delete_admin_healthcare_users_by_user_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling HealthcareUsersApi->delete_admin_healthcare_users_by_user_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**| User ID | 

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

# **get_admin_healthcare_users**
> List[GetAdminHealthcareUsers200ResponseInner] get_admin_healthcare_users(limit=limit, offset=offset)

List Healthcare Users

Get all healthcare users with optional pagination

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_healthcare_users200_response_inner import GetAdminHealthcareUsers200ResponseInner
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
    api_instance = api_client.HealthcareUsersApi(api_client)
    limit = api_client.GetAdminHealthcareUsersLimitParameter() # GetAdminHealthcareUsersLimitParameter | Maximum number of items to return (optional)
    offset = api_client.GetAdminHealthcareUsersOffsetParameter() # GetAdminHealthcareUsersOffsetParameter | Number of items to skip (optional)

    try:
        # List Healthcare Users
        api_response = api_instance.get_admin_healthcare_users(limit=limit, offset=offset)
        print("The response of HealthcareUsersApi->get_admin_healthcare_users:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling HealthcareUsersApi->get_admin_healthcare_users: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **limit** | [**GetAdminHealthcareUsersLimitParameter**](.md)| Maximum number of items to return | [optional] 
 **offset** | [**GetAdminHealthcareUsersOffsetParameter**](.md)| Number of items to skip | [optional] 

### Return type

[**List[GetAdminHealthcareUsers200ResponseInner]**](GetAdminHealthcareUsers200ResponseInner.md)

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

# **get_admin_healthcare_users_by_user_id**
> GetAdminHealthcareUsers200ResponseInner get_admin_healthcare_users_by_user_id(user_id)

Get Healthcare User

Get a healthcare user by userId

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_healthcare_users200_response_inner import GetAdminHealthcareUsers200ResponseInner
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
    api_instance = api_client.HealthcareUsersApi(api_client)
    user_id = 'user_id_example' # str | User ID

    try:
        # Get Healthcare User
        api_response = api_instance.get_admin_healthcare_users_by_user_id(user_id)
        print("The response of HealthcareUsersApi->get_admin_healthcare_users_by_user_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling HealthcareUsersApi->get_admin_healthcare_users_by_user_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**| User ID | 

### Return type

[**GetAdminHealthcareUsers200ResponseInner**](GetAdminHealthcareUsers200ResponseInner.md)

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

# **post_admin_healthcare_users**
> GetAdminHealthcareUsers200ResponseInner post_admin_healthcare_users(post_admin_healthcare_users_request)

Create Healthcare User

Create a new healthcare user

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_healthcare_users200_response_inner import GetAdminHealthcareUsers200ResponseInner
from api_client.models.post_admin_healthcare_users_request import PostAdminHealthcareUsersRequest
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
    api_instance = api_client.HealthcareUsersApi(api_client)
    post_admin_healthcare_users_request = api_client.PostAdminHealthcareUsersRequest() # PostAdminHealthcareUsersRequest | 

    try:
        # Create Healthcare User
        api_response = api_instance.post_admin_healthcare_users(post_admin_healthcare_users_request)
        print("The response of HealthcareUsersApi->post_admin_healthcare_users:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling HealthcareUsersApi->post_admin_healthcare_users: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_admin_healthcare_users_request** | [**PostAdminHealthcareUsersRequest**](PostAdminHealthcareUsersRequest.md)|  | 

### Return type

[**GetAdminHealthcareUsers200ResponseInner**](GetAdminHealthcareUsers200ResponseInner.md)

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
**500** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **put_admin_healthcare_users_by_user_id**
> GetAdminHealthcareUsers200ResponseInner put_admin_healthcare_users_by_user_id(user_id, put_admin_healthcare_users_by_user_id_request)

Update Healthcare User

Update a healthcare user by userId

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_healthcare_users200_response_inner import GetAdminHealthcareUsers200ResponseInner
from api_client.models.put_admin_healthcare_users_by_user_id_request import PutAdminHealthcareUsersByUserIdRequest
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
    api_instance = api_client.HealthcareUsersApi(api_client)
    user_id = 'user_id_example' # str | User ID
    put_admin_healthcare_users_by_user_id_request = api_client.PutAdminHealthcareUsersByUserIdRequest() # PutAdminHealthcareUsersByUserIdRequest | 

    try:
        # Update Healthcare User
        api_response = api_instance.put_admin_healthcare_users_by_user_id(user_id, put_admin_healthcare_users_by_user_id_request)
        print("The response of HealthcareUsersApi->put_admin_healthcare_users_by_user_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling HealthcareUsersApi->put_admin_healthcare_users_by_user_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**| User ID | 
 **put_admin_healthcare_users_by_user_id_request** | [**PutAdminHealthcareUsersByUserIdRequest**](PutAdminHealthcareUsersByUserIdRequest.md)|  | 

### Return type

[**GetAdminHealthcareUsers200ResponseInner**](GetAdminHealthcareUsers200ResponseInner.md)

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

