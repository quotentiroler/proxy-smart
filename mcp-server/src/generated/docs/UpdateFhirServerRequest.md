# UpdateFhirServerRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**url** | **str** | New base URL for the FHIR server | 
**name** | **str** | New name for the server | [optional] 

## Example

```python
from api_client.models.update_fhir_server_request import UpdateFhirServerRequest

# TODO update the JSON string below
json = "{}"
# create an instance of UpdateFhirServerRequest from a JSON string
update_fhir_server_request_instance = UpdateFhirServerRequest.from_json(json)
# print the JSON string representation of the object
print(UpdateFhirServerRequest.to_json())

# convert the object into a dict
update_fhir_server_request_dict = update_fhir_server_request_instance.to_dict()
# create an instance of UpdateFhirServerRequest from a dict
update_fhir_server_request_from_dict = UpdateFhirServerRequest.from_dict(update_fhir_server_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


