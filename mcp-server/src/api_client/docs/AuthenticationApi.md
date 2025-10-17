# api_client.AuthenticationApi

All URIs are relative to *http://localhost:3001*

Method | HTTP request | Description
------------- | ------------- | -------------
[**get_auth_authorize**](AuthenticationApi.md#get_auth_authorize) | **GET** /auth/authorize | OAuth Authorization Endpoint
[**get_auth_config**](AuthenticationApi.md#get_auth_config) | **GET** /auth/config | Get authentication configuration
[**get_auth_identity_providers**](AuthenticationApi.md#get_auth_identity_providers) | **GET** /auth/identity-providers | Get Public Identity Providers
[**get_auth_login**](AuthenticationApi.md#get_auth_login) | **GET** /auth/login | Login Page Redirect
[**get_auth_logout**](AuthenticationApi.md#get_auth_logout) | **GET** /auth/logout | Logout Endpoint
[**get_auth_userinfo**](AuthenticationApi.md#get_auth_userinfo) | **GET** /auth/userinfo | Get Current User Profile
[**post_auth_introspect**](AuthenticationApi.md#post_auth_introspect) | **POST** /auth/introspect | Token Introspection
[**post_auth_register**](AuthenticationApi.md#post_auth_register) | **POST** /auth/register | Dynamic Client Registration
[**post_auth_token**](AuthenticationApi.md#post_auth_token) | **POST** /auth/token | OAuth Token Exchange


# **get_auth_authorize**
> get_auth_authorize(response_type=response_type, client_id=client_id, redirect_uri=redirect_uri, scope=scope, state=state, code_challenge=code_challenge, code_challenge_method=code_challenge_method, authorization_details=authorization_details, kc_idp_hint=kc_idp_hint)

OAuth Authorization Endpoint

Redirects to Keycloak authorization endpoint for OAuth flow with support for authorization details

### Example


```python
import api_client
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
    api_instance = api_client.AuthenticationApi(api_client)
    response_type = 'response_type_example' # str |  (optional)
    client_id = 'client_id_example' # str |  (optional)
    redirect_uri = 'redirect_uri_example' # str |  (optional)
    scope = 'scope_example' # str |  (optional)
    state = 'state_example' # str |  (optional)
    code_challenge = 'code_challenge_example' # str |  (optional)
    code_challenge_method = 'code_challenge_method_example' # str |  (optional)
    authorization_details = 'authorization_details_example' # str |  (optional)
    kc_idp_hint = 'kc_idp_hint_example' # str |  (optional)

    try:
        # OAuth Authorization Endpoint
        api_instance.get_auth_authorize(response_type=response_type, client_id=client_id, redirect_uri=redirect_uri, scope=scope, state=state, code_challenge=code_challenge, code_challenge_method=code_challenge_method, authorization_details=authorization_details, kc_idp_hint=kc_idp_hint)
    except Exception as e:
        print("Exception when calling AuthenticationApi->get_auth_authorize: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **response_type** | **str**|  | [optional] 
 **client_id** | **str**|  | [optional] 
 **redirect_uri** | **str**|  | [optional] 
 **scope** | **str**|  | [optional] 
 **state** | **str**|  | [optional] 
 **code_challenge** | **str**|  | [optional] 
 **code_challenge_method** | **str**|  | [optional] 
 **authorization_details** | **str**|  | [optional] 
 **kc_idp_hint** | **str**|  | [optional] 

### Return type

void (empty response body)

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_auth_config**
> AuthConfigResponse get_auth_config()

Get authentication configuration

Returns the current authentication configuration status

### Example


```python
import api_client
from api_client.models.auth_config_response import AuthConfigResponse
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
    api_instance = api_client.AuthenticationApi(api_client)

    try:
        # Get authentication configuration
        api_response = api_instance.get_auth_config()
        print("The response of AuthenticationApi->get_auth_config:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthenticationApi->get_auth_config: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**AuthConfigResponse**](AuthConfigResponse.md)

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_auth_identity_providers**
> List[PublicIdentityProvider] get_auth_identity_providers()

Get Public Identity Providers

Get list of enabled identity providers for login page (public endpoint)

### Example


```python
import api_client
from api_client.models.public_identity_provider import PublicIdentityProvider
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
    api_instance = api_client.AuthenticationApi(api_client)

    try:
        # Get Public Identity Providers
        api_response = api_instance.get_auth_identity_providers()
        print("The response of AuthenticationApi->get_auth_identity_providers:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthenticationApi->get_auth_identity_providers: %s\n" % e)
```



### Parameters

This endpoint does not need any parameter.

### Return type

[**List[PublicIdentityProvider]**](PublicIdentityProvider.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_auth_login**
> get_auth_login(client_id=client_id, redirect_uri=redirect_uri, scope=scope, state=state, code_challenge=code_challenge, code_challenge_method=code_challenge_method, authorization_details=authorization_details)

Login Page Redirect

Simplified login endpoint that redirects to Keycloak with sensible defaults for UI applications

### Example


```python
import api_client
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
    api_instance = api_client.AuthenticationApi(api_client)
    client_id = 'client_id_example' # str |  (optional)
    redirect_uri = 'redirect_uri_example' # str |  (optional)
    scope = 'scope_example' # str |  (optional)
    state = 'state_example' # str |  (optional)
    code_challenge = 'code_challenge_example' # str |  (optional)
    code_challenge_method = 'code_challenge_method_example' # str |  (optional)
    authorization_details = 'authorization_details_example' # str |  (optional)

    try:
        # Login Page Redirect
        api_instance.get_auth_login(client_id=client_id, redirect_uri=redirect_uri, scope=scope, state=state, code_challenge=code_challenge, code_challenge_method=code_challenge_method, authorization_details=authorization_details)
    except Exception as e:
        print("Exception when calling AuthenticationApi->get_auth_login: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **client_id** | **str**|  | [optional] 
 **redirect_uri** | **str**|  | [optional] 
 **scope** | **str**|  | [optional] 
 **state** | **str**|  | [optional] 
 **code_challenge** | **str**|  | [optional] 
 **code_challenge_method** | **str**|  | [optional] 
 **authorization_details** | **str**|  | [optional] 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_auth_logout**
> get_auth_logout(post_logout_redirect_uri=post_logout_redirect_uri, id_token_hint=id_token_hint, client_id=client_id)

Logout Endpoint

Proxies logout requests to Keycloak with sensible defaults

### Example


```python
import api_client
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
    api_instance = api_client.AuthenticationApi(api_client)
    post_logout_redirect_uri = 'post_logout_redirect_uri_example' # str |  (optional)
    id_token_hint = 'id_token_hint_example' # str |  (optional)
    client_id = 'client_id_example' # str |  (optional)

    try:
        # Logout Endpoint
        api_instance.get_auth_logout(post_logout_redirect_uri=post_logout_redirect_uri, id_token_hint=id_token_hint, client_id=client_id)
    except Exception as e:
        print("Exception when calling AuthenticationApi->get_auth_logout: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_logout_redirect_uri** | **str**|  | [optional] 
 **id_token_hint** | **str**|  | [optional] 
 **client_id** | **str**|  | [optional] 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_auth_userinfo**
> UserInfoResponse get_auth_userinfo(authorization)

Get Current User Profile

Get authenticated user profile information from JWT token

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.user_info_response import UserInfoResponse
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
    api_instance = api_client.AuthenticationApi(api_client)
    authorization = 'authorization_example' # str | 

    try:
        # Get Current User Profile
        api_response = api_instance.get_auth_userinfo(authorization)
        print("The response of AuthenticationApi->get_auth_userinfo:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthenticationApi->get_auth_userinfo: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **authorization** | **str**|  | 

### Return type

[**UserInfoResponse**](UserInfoResponse.md)

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_auth_introspect**
> IntrospectResponse post_auth_introspect(introspect_request)

Token Introspection

Validate and get information about an access token

### Example


```python
import api_client
from api_client.models.introspect_request import IntrospectRequest
from api_client.models.introspect_response import IntrospectResponse
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
    api_instance = api_client.AuthenticationApi(api_client)
    introspect_request = api_client.IntrospectRequest() # IntrospectRequest | 

    try:
        # Token Introspection
        api_response = api_instance.post_auth_introspect(introspect_request)
        print("The response of AuthenticationApi->post_auth_introspect:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthenticationApi->post_auth_introspect: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **introspect_request** | [**IntrospectRequest**](IntrospectRequest.md)|  | 

### Return type

[**IntrospectResponse**](IntrospectResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_auth_register**
> ClientRegistrationResponse post_auth_register(client_registration_request)

Dynamic Client Registration

Register a new OAuth2 client dynamically according to RFC 7591. This is a public endpoint that does not require authentication.

### Example


```python
import api_client
from api_client.models.client_registration_request import ClientRegistrationRequest
from api_client.models.client_registration_response import ClientRegistrationResponse
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
    api_instance = api_client.AuthenticationApi(api_client)
    client_registration_request = api_client.ClientRegistrationRequest() # ClientRegistrationRequest | 

    try:
        # Dynamic Client Registration
        api_response = api_instance.post_auth_register(client_registration_request)
        print("The response of AuthenticationApi->post_auth_register:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthenticationApi->post_auth_register: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **client_registration_request** | [**ClientRegistrationRequest**](ClientRegistrationRequest.md)|  | 

### Return type

[**ClientRegistrationResponse**](ClientRegistrationResponse.md)

### Authorization

No authorization required

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

# **post_auth_token**
> TokenResponse post_auth_token(token_request)

OAuth Token Exchange

Exchange authorization code for access token with SMART launch context and authorization details for multiple FHIR servers

### Example


```python
import api_client
from api_client.models.token_request import TokenRequest
from api_client.models.token_response import TokenResponse
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
    api_instance = api_client.AuthenticationApi(api_client)
    token_request = api_client.TokenRequest() # TokenRequest | 

    try:
        # OAuth Token Exchange
        api_response = api_instance.post_auth_token(token_request)
        print("The response of AuthenticationApi->post_auth_token:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthenticationApi->post_auth_token: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **token_request** | [**TokenRequest**](TokenRequest.md)|  | 

### Return type

[**TokenResponse**](TokenResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, application/x-www-form-urlencoded, multipart/form-data
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Response for status 200 |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

