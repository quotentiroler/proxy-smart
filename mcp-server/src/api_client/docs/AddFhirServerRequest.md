# AddFhirServerRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**url** | **str** | Base URL of the FHIR server to add | 
**name** | **str** | Optional custom name for the server | [optional] 

## Example

```python
from api_client.models.add_fhir_server_request import AddFhirServerRequest

# TODO update the JSON string below
json = "{}"
# create an instance of AddFhirServerRequest from a JSON string
add_fhir_server_request_instance = AddFhirServerRequest.from_json(json)
# print the JSON string representation of the object
print(AddFhirServerRequest.to_json())

# convert the object into a dict
add_fhir_server_request_dict = add_fhir_server_request_instance.to_dict()
# create an instance of AddFhirServerRequest from a dict
add_fhir_server_request_from_dict = AddFhirServerRequest.from_dict(add_fhir_server_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


