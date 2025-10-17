# UpdateFhirServerResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the server was updated successfully | 
**message** | **str** | Success message | 
**server** | [**FhirServer**](FhirServer.md) |  | 

## Example

```python
from api_client.models.update_fhir_server_response import UpdateFhirServerResponse

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateFhirServerResponse from a JSON string
update_fhir_server_response_instance = UpdateFhirServerResponse.from_json(json)
# print the JSON string representation of the object
print(UpdateFhirServerResponse.to_json())

# convert the object into a dict
update_fhir_server_response_dict = update_fhir_server_response_instance.to_dict()
# create an instance of UpdateFhirServerResponse from a dict
update_fhir_server_response_from_dict = UpdateFhirServerResponse.from_dict(update_fhir_server_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


