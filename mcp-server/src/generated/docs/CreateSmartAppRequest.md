# CreateSmartAppRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**client_id** | **str** | OAuth2 client ID (must be unique) | 
**name** | **str** | Application name | 
**description** | **str** | Application description | [optional] 
**public_client** | **bool** | Whether this is a public client | [optional] [default to True]
**redirect_uris** | **List[str]** | Allowed redirect URIs | [optional] 
**web_origins** | **List[str]** | Allowed web origins | [optional] 
**default_scopes** | **List[str]** | Default SMART scopes | [optional] 
**optional_scopes** | **List[str]** | Optional SMART scopes | [optional] 
**smart_version** | **str** | SMART App Launch version | [optional] 
**fhir_version** | **str** | FHIR version | [optional] 
**app_type** | **str** |  | [optional] 
**client_type** | **str** |  | [optional] 
**public_key** | **str** | Public key for JWT authentication (PEM format) | [optional] 
**jwks_uri** | **str** | JWKS URI for JWT authentication | [optional] 
**system_scopes** | **List[str]** | System-level scopes for backend services | [optional] 

## Example

```python
from api_client.models.create_smart_app_request import CreateSmartAppRequest

# TODO update the JSON string below
json = "{}"
# create an instance of CreateSmartAppRequest from a JSON string
create_smart_app_request_instance = CreateSmartAppRequest.from_json(json)
# print the JSON string representation of the object
print(CreateSmartAppRequest.to_json())

# convert the object into a dict
create_smart_app_request_dict = create_smart_app_request_instance.to_dict()
# create an instance of CreateSmartAppRequest from a dict
create_smart_app_request_from_dict = CreateSmartAppRequest.from_dict(create_smart_app_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


