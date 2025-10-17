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
> SuccessResponse delete_admin_healthcare_users_by_user_id(user_id)

Delete Healthcare User

Delete a healthcare user by userId

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
    api_instance = api_client.HealthcareUsersApi(api_client)
    user_id = 'user_id_example' # str | 

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
 **user_id** | **str**|  | 

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

# **get_admin_healthcare_users**
> List[HealthcareUser] get_admin_healthcare_users(limit=limit, offset=offset)

List Healthcare Users

Get all healthcare users with optional pagination

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.healthcare_user import HealthcareUser
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
    limit = api_client.GetAdminHealthcareUsersLimitParameter() # GetAdminHealthcareUsersLimitParameter |  (optional)
    offset = api_client.GetAdminHealthcareUsersOffsetParameter() # GetAdminHealthcareUsersOffsetParameter |  (optional)

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
 **limit** | [**GetAdminHealthcareUsersLimitParameter**](.md)|  | [optional] 
 **offset** | [**GetAdminHealthcareUsersOffsetParameter**](.md)|  | [optional] 

### Return type

[**List[HealthcareUser]**](HealthcareUser.md)

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

# **get_admin_healthcare_users_by_user_id**
> HealthcareUser get_admin_healthcare_users_by_user_id(user_id)

Get Healthcare User

Get a healthcare user by userId

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.healthcare_user import HealthcareUser
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
    user_id = 'user_id_example' # str | 

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
 **user_id** | **str**|  | 

### Return type

[**HealthcareUser**](HealthcareUser.md)

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

# **post_admin_healthcare_users**
> HealthcareUser post_admin_healthcare_users(create_healthcare_user_request)

Create Healthcare User

Create a new healthcare user

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.create_healthcare_user_request import CreateHealthcareUserRequest
from api_client.models.healthcare_user import HealthcareUser
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
    create_healthcare_user_request = api_client.CreateHealthcareUserRequest() # CreateHealthcareUserRequest | 

    try:
        # Create Healthcare User
        api_response = api_instance.post_admin_healthcare_users(create_healthcare_user_request)
        print("The response of HealthcareUsersApi->post_admin_healthcare_users:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling HealthcareUsersApi->post_admin_healthcare_users: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **create_healthcare_user_request** | [**CreateHealthcareUserRequest**](CreateHealthcareUserRequest.md)|  | 

### Return type

[**HealthcareUser**](HealthcareUser.md)

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

# **put_admin_healthcare_users_by_user_id**
> HealthcareUser put_admin_healthcare_users_by_user_id(user_id, update_healthcare_user_request)

Update Healthcare User

Update a healthcare user by userId

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.healthcare_user import HealthcareUser
from api_client.models.update_healthcare_user_request import UpdateHealthcareUserRequest
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
    user_id = 'user_id_example' # str | 
    update_healthcare_user_request = api_client.UpdateHealthcareUserRequest() # UpdateHealthcareUserRequest | 

    try:
        # Update Healthcare User
        api_response = api_instance.put_admin_healthcare_users_by_user_id(user_id, update_healthcare_user_request)
        print("The response of HealthcareUsersApi->put_admin_healthcare_users_by_user_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling HealthcareUsersApi->put_admin_healthcare_users_by_user_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 
 **update_healthcare_user_request** | [**UpdateHealthcareUserRequest**](UpdateHealthcareUserRequest.md)|  | 

### Return type

[**HealthcareUser**](HealthcareUser.md)

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

