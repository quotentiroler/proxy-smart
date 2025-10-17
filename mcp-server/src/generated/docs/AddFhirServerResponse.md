# AddFhirServerResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the server was added successfully | 
**message** | **str** | Success message | 
**server** | [**FhirServer**](FhirServer.md) |  | 

## Example

```python
from api_client.models.add_fhir_server_response import AddFhirServerResponse

# TODO update the JSON string below
json = "{}"
# create an instance of AddFhirServerResponse from a JSON string
add_fhir_server_response_instance = AddFhirServerResponse.from_json(json)
# print the JSON string representation of the object
print(AddFhirServerResponse.to_json())

# convert the object into a dict
add_fhir_server_response_dict = add_fhir_server_response_instance.to_dict()
# create an instance of AddFhirServerResponse from a dict
add_fhir_server_response_from_dict = AddFhirServerResponse.from_dict(add_fhir_server_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


