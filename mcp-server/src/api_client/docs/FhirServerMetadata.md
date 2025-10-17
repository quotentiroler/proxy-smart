# FhirServerMetadata


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**fhir_version** | **str** | FHIR version supported by server | 
**server_version** | **str** | Server software version | [optional] 
**server_name** | **str** | Server software name | [optional] 
**supported** | **bool** | Whether this version is supported | 

## Example

```python
from api_client.models.fhir_server_metadata import FhirServerMetadata

# TODO update the JSON string below
json = "{}"
# create an instance of FhirServerMetadata from a JSON string
fhir_server_metadata_instance = FhirServerMetadata.from_json(json)
# print the JSON string representation of the object
print(FhirServerMetadata.to_json())

# convert the object into a dict
fhir_server_metadata_dict = fhir_server_metadata_instance.to_dict()
# create an instance of FhirServerMetadata from a dict
fhir_server_metadata_from_dict = FhirServerMetadata.from_dict(fhir_server_metadata_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


