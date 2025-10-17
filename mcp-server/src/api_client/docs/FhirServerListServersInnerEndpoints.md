# FhirServerListServersInnerEndpoints


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**base** | **str** | Base FHIR endpoint URL | 
**smart_config** | **str** | SMART configuration endpoint URL | 
**metadata** | **str** | FHIR capability statement endpoint URL | 
**authorize** | **str** | OAuth2 authorization endpoint | [optional] 
**token** | **str** | OAuth2 token endpoint | [optional] 
**registration** | **str** | Dynamic client registration endpoint (RFC 7591) | [optional] 
**manage** | **str** | Token management endpoint | [optional] 
**introspection** | **str** | Token introspection endpoint | [optional] 
**revocation** | **str** | Token revocation endpoint | [optional] 

## Example

```python
from api_client.models.fhir_server_list_servers_inner_endpoints import FhirServerListServersInnerEndpoints

# TODO update the JSON string below
json = "{}"
# create an instance of FhirServerListServersInnerEndpoints from a JSON string
fhir_server_list_servers_inner_endpoints_instance = FhirServerListServersInnerEndpoints.from_json(json)
# print the JSON string representation of the object
print(FhirServerListServersInnerEndpoints.to_json())

# convert the object into a dict
fhir_server_list_servers_inner_endpoints_dict = fhir_server_list_servers_inner_endpoints_instance.to_dict()
# create an instance of FhirServerListServersInnerEndpoints from a dict
fhir_server_list_servers_inner_endpoints_from_dict = FhirServerListServersInnerEndpoints.from_dict(fhir_server_list_servers_inner_endpoints_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


