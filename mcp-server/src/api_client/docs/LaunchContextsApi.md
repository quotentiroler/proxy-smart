# api_client.LaunchContextsApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**delete_admin_launch_contexts_by_user_id_encounter**](LaunchContextsApi.md#delete_admin_launch_contexts_by_user_id_encounter) | **DELETE** /admin/launch-contexts/{userId}/encounter | Remove Encounter Context
[**delete_admin_launch_contexts_by_user_id_fhir_context**](LaunchContextsApi.md#delete_admin_launch_contexts_by_user_id_fhir_context) | **DELETE** /admin/launch-contexts/{userId}/fhir-context | Remove FHIR Context
[**delete_admin_launch_contexts_by_user_id_fhir_user**](LaunchContextsApi.md#delete_admin_launch_contexts_by_user_id_fhir_user) | **DELETE** /admin/launch-contexts/{userId}/fhir-user | Remove FHIR User Context
[**delete_admin_launch_contexts_by_user_id_intent**](LaunchContextsApi.md#delete_admin_launch_contexts_by_user_id_intent) | **DELETE** /admin/launch-contexts/{userId}/intent | Remove Intent Context
[**delete_admin_launch_contexts_by_user_id_need_patient_banner**](LaunchContextsApi.md#delete_admin_launch_contexts_by_user_id_need_patient_banner) | **DELETE** /admin/launch-contexts/{userId}/need-patient-banner | Remove Need Patient Banner Context
[**delete_admin_launch_contexts_by_user_id_patient**](LaunchContextsApi.md#delete_admin_launch_contexts_by_user_id_patient) | **DELETE** /admin/launch-contexts/{userId}/patient | Remove Patient Context
[**delete_admin_launch_contexts_by_user_id_smart_style_url**](LaunchContextsApi.md#delete_admin_launch_contexts_by_user_id_smart_style_url) | **DELETE** /admin/launch-contexts/{userId}/smart-style-url | Remove Smart Style URL Context
[**delete_admin_launch_contexts_by_user_id_tenant**](LaunchContextsApi.md#delete_admin_launch_contexts_by_user_id_tenant) | **DELETE** /admin/launch-contexts/{userId}/tenant | Remove Tenant Context
[**get_admin_launch_contexts**](LaunchContextsApi.md#get_admin_launch_contexts) | **GET** /admin/launch-contexts/ | List Launch Contexts
[**post_admin_launch_contexts_by_user_id_encounter_by_encounter_id**](LaunchContextsApi.md#post_admin_launch_contexts_by_user_id_encounter_by_encounter_id) | **POST** /admin/launch-contexts/{userId}/encounter/{encounterId} | Set Encounter Context
[**post_admin_launch_contexts_by_user_id_fhir_context**](LaunchContextsApi.md#post_admin_launch_contexts_by_user_id_fhir_context) | **POST** /admin/launch-contexts/{userId}/fhir-context | Set FHIR Context
[**post_admin_launch_contexts_by_user_id_fhir_user_by_fhir_user_id**](LaunchContextsApi.md#post_admin_launch_contexts_by_user_id_fhir_user_by_fhir_user_id) | **POST** /admin/launch-contexts/{userId}/fhir-user/{fhirUserId} | Set FHIR User Context
[**post_admin_launch_contexts_by_user_id_patient_by_patient_id**](LaunchContextsApi.md#post_admin_launch_contexts_by_user_id_patient_by_patient_id) | **POST** /admin/launch-contexts/{userId}/patient/{patientId} | Set Patient Context
[**put_admin_launch_contexts_by_user_id_intent**](LaunchContextsApi.md#put_admin_launch_contexts_by_user_id_intent) | **PUT** /admin/launch-contexts/{userId}/intent | Set Intent Context
[**put_admin_launch_contexts_by_user_id_need_patient_banner**](LaunchContextsApi.md#put_admin_launch_contexts_by_user_id_need_patient_banner) | **PUT** /admin/launch-contexts/{userId}/need-patient-banner | Set Need Patient Banner Context
[**put_admin_launch_contexts_by_user_id_smart_style_url**](LaunchContextsApi.md#put_admin_launch_contexts_by_user_id_smart_style_url) | **PUT** /admin/launch-contexts/{userId}/smart-style-url | Set Smart Style URL Context
[**put_admin_launch_contexts_by_user_id_tenant**](LaunchContextsApi.md#put_admin_launch_contexts_by_user_id_tenant) | **PUT** /admin/launch-contexts/{userId}/tenant | Set Tenant Context


# **delete_admin_launch_contexts_by_user_id_encounter**
> DeleteAdminRolesByRoleName200Response delete_admin_launch_contexts_by_user_id_encounter(user_id)

Remove Encounter Context

Remove the encounter context for a user

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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 

    try:
        # Remove Encounter Context
        api_response = api_instance.delete_admin_launch_contexts_by_user_id_encounter(user_id)
        print("The response of LaunchContextsApi->delete_admin_launch_contexts_by_user_id_encounter:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->delete_admin_launch_contexts_by_user_id_encounter: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_admin_launch_contexts_by_user_id_fhir_context**
> DeleteAdminRolesByRoleName200Response delete_admin_launch_contexts_by_user_id_fhir_context(user_id)

Remove FHIR Context

Remove additional FHIR resources in context

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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 

    try:
        # Remove FHIR Context
        api_response = api_instance.delete_admin_launch_contexts_by_user_id_fhir_context(user_id)
        print("The response of LaunchContextsApi->delete_admin_launch_contexts_by_user_id_fhir_context:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->delete_admin_launch_contexts_by_user_id_fhir_context: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_admin_launch_contexts_by_user_id_fhir_user**
> DeleteAdminRolesByRoleName200Response delete_admin_launch_contexts_by_user_id_fhir_user(user_id)

Remove FHIR User Context

Remove the fhirUser context for a user

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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 

    try:
        # Remove FHIR User Context
        api_response = api_instance.delete_admin_launch_contexts_by_user_id_fhir_user(user_id)
        print("The response of LaunchContextsApi->delete_admin_launch_contexts_by_user_id_fhir_user:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->delete_admin_launch_contexts_by_user_id_fhir_user: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_admin_launch_contexts_by_user_id_intent**
> DeleteAdminRolesByRoleName200Response delete_admin_launch_contexts_by_user_id_intent(user_id)

Remove Intent Context

Remove the intent context for a user

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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 

    try:
        # Remove Intent Context
        api_response = api_instance.delete_admin_launch_contexts_by_user_id_intent(user_id)
        print("The response of LaunchContextsApi->delete_admin_launch_contexts_by_user_id_intent:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->delete_admin_launch_contexts_by_user_id_intent: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_admin_launch_contexts_by_user_id_need_patient_banner**
> DeleteAdminRolesByRoleName200Response delete_admin_launch_contexts_by_user_id_need_patient_banner(user_id)

Remove Need Patient Banner Context

Remove the need-patient-banner context for a user

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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 

    try:
        # Remove Need Patient Banner Context
        api_response = api_instance.delete_admin_launch_contexts_by_user_id_need_patient_banner(user_id)
        print("The response of LaunchContextsApi->delete_admin_launch_contexts_by_user_id_need_patient_banner:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->delete_admin_launch_contexts_by_user_id_need_patient_banner: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_admin_launch_contexts_by_user_id_patient**
> DeleteAdminRolesByRoleName200Response delete_admin_launch_contexts_by_user_id_patient(user_id)

Remove Patient Context

Remove the patient context for a user

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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 

    try:
        # Remove Patient Context
        api_response = api_instance.delete_admin_launch_contexts_by_user_id_patient(user_id)
        print("The response of LaunchContextsApi->delete_admin_launch_contexts_by_user_id_patient:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->delete_admin_launch_contexts_by_user_id_patient: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_admin_launch_contexts_by_user_id_smart_style_url**
> DeleteAdminRolesByRoleName200Response delete_admin_launch_contexts_by_user_id_smart_style_url(user_id)

Remove Smart Style URL Context

Remove the smart-style-url context for a user

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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 

    try:
        # Remove Smart Style URL Context
        api_response = api_instance.delete_admin_launch_contexts_by_user_id_smart_style_url(user_id)
        print("The response of LaunchContextsApi->delete_admin_launch_contexts_by_user_id_smart_style_url:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->delete_admin_launch_contexts_by_user_id_smart_style_url: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **delete_admin_launch_contexts_by_user_id_tenant**
> DeleteAdminRolesByRoleName200Response delete_admin_launch_contexts_by_user_id_tenant(user_id)

Remove Tenant Context

Remove the tenant context for a user

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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 

    try:
        # Remove Tenant Context
        api_response = api_instance.delete_admin_launch_contexts_by_user_id_tenant(user_id)
        print("The response of LaunchContextsApi->delete_admin_launch_contexts_by_user_id_tenant:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->delete_admin_launch_contexts_by_user_id_tenant: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_admin_launch_contexts**
> List[GetAdminLaunchContexts200ResponseInner] get_admin_launch_contexts()

List Launch Contexts

Get all users with launch context attributes

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_admin_launch_contexts200_response_inner import GetAdminLaunchContexts200ResponseInner
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
    api_instance = api_client.LaunchContextsApi(api_client)

    try:
        # List Launch Contexts
        api_response = api_instance.get_admin_launch_contexts()
        print("The response of LaunchContextsApi->get_admin_launch_contexts:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->get_admin_launch_contexts: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[GetAdminLaunchContexts200ResponseInner]**](GetAdminLaunchContexts200ResponseInner.md)

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

# **post_admin_launch_contexts_by_user_id_encounter_by_encounter_id**
> PutAdminRolesByRoleName200Response post_admin_launch_contexts_by_user_id_encounter_by_encounter_id(user_id, encounter_id)

Set Encounter Context

Set the encounter context for a user

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 
    encounter_id = 'encounter_id_example' # str | 

    try:
        # Set Encounter Context
        api_response = api_instance.post_admin_launch_contexts_by_user_id_encounter_by_encounter_id(user_id, encounter_id)
        print("The response of LaunchContextsApi->post_admin_launch_contexts_by_user_id_encounter_by_encounter_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->post_admin_launch_contexts_by_user_id_encounter_by_encounter_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 
 **encounter_id** | **str**|  | 

### Return type

[**PutAdminRolesByRoleName200Response**](PutAdminRolesByRoleName200Response.md)

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_admin_launch_contexts_by_user_id_fhir_context**
> PutAdminRolesByRoleName200Response post_admin_launch_contexts_by_user_id_fhir_context(user_id, post_admin_launch_contexts_by_user_id_fhir_context_request)

Set FHIR Context

Set additional FHIR resources in context as per SMART 2.2.0 spec

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.post_admin_launch_contexts_by_user_id_fhir_context_request import PostAdminLaunchContextsByUserIdFhirContextRequest
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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 
    post_admin_launch_contexts_by_user_id_fhir_context_request = api_client.PostAdminLaunchContextsByUserIdFhirContextRequest() # PostAdminLaunchContextsByUserIdFhirContextRequest | 

    try:
        # Set FHIR Context
        api_response = api_instance.post_admin_launch_contexts_by_user_id_fhir_context(user_id, post_admin_launch_contexts_by_user_id_fhir_context_request)
        print("The response of LaunchContextsApi->post_admin_launch_contexts_by_user_id_fhir_context:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->post_admin_launch_contexts_by_user_id_fhir_context: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 
 **post_admin_launch_contexts_by_user_id_fhir_context_request** | [**PostAdminLaunchContextsByUserIdFhirContextRequest**](PostAdminLaunchContextsByUserIdFhirContextRequest.md)|  | 

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

# **post_admin_launch_contexts_by_user_id_fhir_user_by_fhir_user_id**
> PutAdminRolesByRoleName200Response post_admin_launch_contexts_by_user_id_fhir_user_by_fhir_user_id(user_id, fhir_user_id)

Set FHIR User Context

Set the fhirUser context for a user (e.g., Practitioner/123)

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 
    fhir_user_id = 'fhir_user_id_example' # str | 

    try:
        # Set FHIR User Context
        api_response = api_instance.post_admin_launch_contexts_by_user_id_fhir_user_by_fhir_user_id(user_id, fhir_user_id)
        print("The response of LaunchContextsApi->post_admin_launch_contexts_by_user_id_fhir_user_by_fhir_user_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->post_admin_launch_contexts_by_user_id_fhir_user_by_fhir_user_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 
 **fhir_user_id** | **str**|  | 

### Return type

[**PutAdminRolesByRoleName200Response**](PutAdminRolesByRoleName200Response.md)

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_admin_launch_contexts_by_user_id_patient_by_patient_id**
> PutAdminRolesByRoleName200Response post_admin_launch_contexts_by_user_id_patient_by_patient_id(user_id, patient_id)

Set Patient Context

Set the patient context for a user

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 
    patient_id = 'patient_id_example' # str | 

    try:
        # Set Patient Context
        api_response = api_instance.post_admin_launch_contexts_by_user_id_patient_by_patient_id(user_id, patient_id)
        print("The response of LaunchContextsApi->post_admin_launch_contexts_by_user_id_patient_by_patient_id:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->post_admin_launch_contexts_by_user_id_patient_by_patient_id: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 
 **patient_id** | **str**|  | 

### Return type

[**PutAdminRolesByRoleName200Response**](PutAdminRolesByRoleName200Response.md)

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **put_admin_launch_contexts_by_user_id_intent**
> PutAdminRolesByRoleName200Response put_admin_launch_contexts_by_user_id_intent(user_id, put_admin_launch_contexts_by_user_id_intent_request)

Set Intent Context

Set the intent context for a user

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.put_admin_launch_contexts_by_user_id_intent_request import PutAdminLaunchContextsByUserIdIntentRequest
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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 
    put_admin_launch_contexts_by_user_id_intent_request = api_client.PutAdminLaunchContextsByUserIdIntentRequest() # PutAdminLaunchContextsByUserIdIntentRequest | 

    try:
        # Set Intent Context
        api_response = api_instance.put_admin_launch_contexts_by_user_id_intent(user_id, put_admin_launch_contexts_by_user_id_intent_request)
        print("The response of LaunchContextsApi->put_admin_launch_contexts_by_user_id_intent:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->put_admin_launch_contexts_by_user_id_intent: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 
 **put_admin_launch_contexts_by_user_id_intent_request** | [**PutAdminLaunchContextsByUserIdIntentRequest**](PutAdminLaunchContextsByUserIdIntentRequest.md)|  | 

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

# **put_admin_launch_contexts_by_user_id_need_patient_banner**
> PutAdminRolesByRoleName200Response put_admin_launch_contexts_by_user_id_need_patient_banner(user_id, put_admin_launch_contexts_by_user_id_need_patient_banner_request)

Set Need Patient Banner Context

Set whether patient banner is required for a user

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.put_admin_launch_contexts_by_user_id_need_patient_banner_request import PutAdminLaunchContextsByUserIdNeedPatientBannerRequest
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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 
    put_admin_launch_contexts_by_user_id_need_patient_banner_request = api_client.PutAdminLaunchContextsByUserIdNeedPatientBannerRequest() # PutAdminLaunchContextsByUserIdNeedPatientBannerRequest | 

    try:
        # Set Need Patient Banner Context
        api_response = api_instance.put_admin_launch_contexts_by_user_id_need_patient_banner(user_id, put_admin_launch_contexts_by_user_id_need_patient_banner_request)
        print("The response of LaunchContextsApi->put_admin_launch_contexts_by_user_id_need_patient_banner:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->put_admin_launch_contexts_by_user_id_need_patient_banner: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 
 **put_admin_launch_contexts_by_user_id_need_patient_banner_request** | [**PutAdminLaunchContextsByUserIdNeedPatientBannerRequest**](PutAdminLaunchContextsByUserIdNeedPatientBannerRequest.md)|  | 

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

# **put_admin_launch_contexts_by_user_id_smart_style_url**
> PutAdminRolesByRoleName200Response put_admin_launch_contexts_by_user_id_smart_style_url(user_id, put_admin_launch_contexts_by_user_id_smart_style_url_request)

Set Smart Style URL Context

Set the smart-style-url context for a user

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.put_admin_launch_contexts_by_user_id_smart_style_url_request import PutAdminLaunchContextsByUserIdSmartStyleUrlRequest
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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 
    put_admin_launch_contexts_by_user_id_smart_style_url_request = api_client.PutAdminLaunchContextsByUserIdSmartStyleUrlRequest() # PutAdminLaunchContextsByUserIdSmartStyleUrlRequest | 

    try:
        # Set Smart Style URL Context
        api_response = api_instance.put_admin_launch_contexts_by_user_id_smart_style_url(user_id, put_admin_launch_contexts_by_user_id_smart_style_url_request)
        print("The response of LaunchContextsApi->put_admin_launch_contexts_by_user_id_smart_style_url:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->put_admin_launch_contexts_by_user_id_smart_style_url: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 
 **put_admin_launch_contexts_by_user_id_smart_style_url_request** | [**PutAdminLaunchContextsByUserIdSmartStyleUrlRequest**](PutAdminLaunchContextsByUserIdSmartStyleUrlRequest.md)|  | 

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

# **put_admin_launch_contexts_by_user_id_tenant**
> PutAdminRolesByRoleName200Response put_admin_launch_contexts_by_user_id_tenant(user_id, put_admin_launch_contexts_by_user_id_tenant_request)

Set Tenant Context

Set the tenant context for a user

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.put_admin_launch_contexts_by_user_id_tenant_request import PutAdminLaunchContextsByUserIdTenantRequest
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
    api_instance = api_client.LaunchContextsApi(api_client)
    user_id = 'user_id_example' # str | 
    put_admin_launch_contexts_by_user_id_tenant_request = api_client.PutAdminLaunchContextsByUserIdTenantRequest() # PutAdminLaunchContextsByUserIdTenantRequest | 

    try:
        # Set Tenant Context
        api_response = api_instance.put_admin_launch_contexts_by_user_id_tenant(user_id, put_admin_launch_contexts_by_user_id_tenant_request)
        print("The response of LaunchContextsApi->put_admin_launch_contexts_by_user_id_tenant:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling LaunchContextsApi->put_admin_launch_contexts_by_user_id_tenant: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **user_id** | **str**|  | 
 **put_admin_launch_contexts_by_user_id_tenant_request** | [**PutAdminLaunchContextsByUserIdTenantRequest**](PutAdminLaunchContextsByUserIdTenantRequest.md)|  | 

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

