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
    response_type = 'response_type_example' # str | OAuth response type (optional)
    client_id = 'client_id_example' # str | OAuth client ID (optional)
    redirect_uri = 'redirect_uri_example' # str | OAuth redirect URI (optional)
    scope = 'scope_example' # str | OAuth scope (optional)
    state = 'state_example' # str | OAuth state parameter (optional)
    code_challenge = 'code_challenge_example' # str | PKCE code challenge (optional)
    code_challenge_method = 'code_challenge_method_example' # str | PKCE code challenge method (optional)
    authorization_details = 'authorization_details_example' # str | Authorization details JSON string for multiple FHIR servers (optional)
    kc_idp_hint = 'kc_idp_hint_example' # str | Keycloak Identity Provider hint to skip provider selection (optional)

    try:
        # OAuth Authorization Endpoint
        api_instance.get_auth_authorize(response_type=response_type, client_id=client_id, redirect_uri=redirect_uri, scope=scope, state=state, code_challenge=code_challenge, code_challenge_method=code_challenge_method, authorization_details=authorization_details, kc_idp_hint=kc_idp_hint)
    except Exception as e:
        print("Exception when calling AuthenticationApi->get_auth_authorize: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **response_type** | **str**| OAuth response type | [optional] 
 **client_id** | **str**| OAuth client ID | [optional] 
 **redirect_uri** | **str**| OAuth redirect URI | [optional] 
 **scope** | **str**| OAuth scope | [optional] 
 **state** | **str**| OAuth state parameter | [optional] 
 **code_challenge** | **str**| PKCE code challenge | [optional] 
 **code_challenge_method** | **str**| PKCE code challenge method | [optional] 
 **authorization_details** | **str**| Authorization details JSON string for multiple FHIR servers | [optional] 
 **kc_idp_hint** | **str**| Keycloak Identity Provider hint to skip provider selection | [optional] 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_auth_config**
> GetAuthConfig200Response get_auth_config()

Get authentication configuration

Returns the current authentication configuration status

### Example


```python
import api_client
from api_client.models.get_auth_config200_response import GetAuthConfig200Response
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

[**GetAuthConfig200Response**](GetAuthConfig200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_auth_identity_providers**
> List[GetAuthIdentityProviders200ResponseInner] get_auth_identity_providers()

Get Public Identity Providers

Get list of enabled identity providers for login page (public endpoint)

### Example


```python
import api_client
from api_client.models.get_auth_identity_providers200_response_inner import GetAuthIdentityProviders200ResponseInner
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

[**List[GetAuthIdentityProviders200ResponseInner]**](GetAuthIdentityProviders200ResponseInner.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

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
    client_id = 'client_id_example' # str | OAuth client ID (defaults to admin-ui) (optional)
    redirect_uri = 'redirect_uri_example' # str | OAuth redirect URI (defaults to base URL) (optional)
    scope = 'scope_example' # str | OAuth scope (defaults to openid profile email) (optional)
    state = 'state_example' # str | OAuth state parameter (auto-generated if not provided) (optional)
    code_challenge = 'code_challenge_example' # str | PKCE code challenge (optional)
    code_challenge_method = 'code_challenge_method_example' # str | PKCE code challenge method (optional)
    authorization_details = 'authorization_details_example' # str | Authorization details JSON string for multiple FHIR servers (optional)

    try:
        # Login Page Redirect
        api_instance.get_auth_login(client_id=client_id, redirect_uri=redirect_uri, scope=scope, state=state, code_challenge=code_challenge, code_challenge_method=code_challenge_method, authorization_details=authorization_details)
    except Exception as e:
        print("Exception when calling AuthenticationApi->get_auth_login: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **client_id** | **str**| OAuth client ID (defaults to admin-ui) | [optional] 
 **redirect_uri** | **str**| OAuth redirect URI (defaults to base URL) | [optional] 
 **scope** | **str**| OAuth scope (defaults to openid profile email) | [optional] 
 **state** | **str**| OAuth state parameter (auto-generated if not provided) | [optional] 
 **code_challenge** | **str**| PKCE code challenge | [optional] 
 **code_challenge_method** | **str**| PKCE code challenge method | [optional] 
 **authorization_details** | **str**| Authorization details JSON string for multiple FHIR servers | [optional] 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

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
    post_logout_redirect_uri = 'post_logout_redirect_uri_example' # str | Post-logout redirect URI (defaults to base URL) (optional)
    id_token_hint = 'id_token_hint_example' # str | ID token hint for logout (optional)
    client_id = 'client_id_example' # str | OAuth client ID (optional)

    try:
        # Logout Endpoint
        api_instance.get_auth_logout(post_logout_redirect_uri=post_logout_redirect_uri, id_token_hint=id_token_hint, client_id=client_id)
    except Exception as e:
        print("Exception when calling AuthenticationApi->get_auth_logout: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_logout_redirect_uri** | **str**| Post-logout redirect URI (defaults to base URL) | [optional] 
 **id_token_hint** | **str**| ID token hint for logout | [optional] 
 **client_id** | **str**| OAuth client ID | [optional] 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_auth_userinfo**
> GetAuthUserinfo200Response get_auth_userinfo(authorization)

Get Current User Profile

Get authenticated user profile information from JWT token

### Example

* Bearer (JWT) Authentication (BearerAuth):

```python
import api_client
from api_client.models.get_auth_userinfo200_response import GetAuthUserinfo200Response
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
    authorization = 'authorization_example' # str | Bearer token

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
 **authorization** | **str**| Bearer token | 

### Return type

[**GetAuthUserinfo200Response**](GetAuthUserinfo200Response.md)

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

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_auth_introspect**
> PostAuthIntrospect200Response post_auth_introspect(post_auth_introspect_request)

Token Introspection

Validate and get information about an access token

### Example


```python
import api_client
from api_client.models.post_auth_introspect200_response import PostAuthIntrospect200Response
from api_client.models.post_auth_introspect_request import PostAuthIntrospectRequest
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
    post_auth_introspect_request = api_client.PostAuthIntrospectRequest() # PostAuthIntrospectRequest | 

    try:
        # Token Introspection
        api_response = api_instance.post_auth_introspect(post_auth_introspect_request)
        print("The response of AuthenticationApi->post_auth_introspect:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthenticationApi->post_auth_introspect: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_auth_introspect_request** | [**PostAuthIntrospectRequest**](PostAuthIntrospectRequest.md)|  | 

### Return type

[**PostAuthIntrospect200Response**](PostAuthIntrospect200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, multipart/form-data, text/plain
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_auth_register**
> post_auth_register(post_auth_register_request)

Dynamic Client Registration

Register a new OAuth2 client dynamically according to RFC 7591. This is a public endpoint that does not require authentication.

### Example


```python
import api_client
from api_client.models.post_auth_register_request import PostAuthRegisterRequest
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
    post_auth_register_request = api_client.PostAuthRegisterRequest() # PostAuthRegisterRequest | 

    try:
        # Dynamic Client Registration
        api_instance.post_auth_register(post_auth_register_request)
    except Exception as e:
        print("Exception when calling AuthenticationApi->post_auth_register: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_auth_register_request** | [**PostAuthRegisterRequest**](PostAuthRegisterRequest.md)|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, multipart/form-data, text/plain
 - **Accept**: Not defined

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **post_auth_token**
> PostAuthToken200Response post_auth_token(post_auth_token_request)

OAuth Token Exchange

Exchange authorization code for access token with SMART launch context and authorization details for multiple FHIR servers

### Example


```python
import api_client
from api_client.models.post_auth_token200_response import PostAuthToken200Response
from api_client.models.post_auth_token_request import PostAuthTokenRequest
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
    post_auth_token_request = api_client.PostAuthTokenRequest() # PostAuthTokenRequest | 

    try:
        # OAuth Token Exchange
        api_response = api_instance.post_auth_token(post_auth_token_request)
        print("The response of AuthenticationApi->post_auth_token:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling AuthenticationApi->post_auth_token: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **post_auth_token_request** | [**PostAuthTokenRequest**](PostAuthTokenRequest.md)|  | 

### Return type

[**PostAuthToken200Response**](PostAuthToken200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, multipart/form-data, text/plain
 - **Accept**: application/json, multipart/form-data, text/plain

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** |  |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

