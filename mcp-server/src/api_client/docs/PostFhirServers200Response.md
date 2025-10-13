# PostFhirServers200Response


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the server was added successfully | 
**message** | **str** | Success message | 
**server** | [**FhirServer**](FhirServer.md) |  | 

## Example

```python
from api_client.models.post_fhir_servers200_response import PostFhirServers200Response

# TODO update the JSON string below
json = "{}"
# create an instance of PostFhirServers200Response from a JSON string
post_fhir_servers200_response_instance = PostFhirServers200Response.from_json(json)
# print the JSON string representation of the object
print(PostFhirServers200Response.to_json())

# convert the object into a dict
post_fhir_servers200_response_dict = post_fhir_servers200_response_instance.to_dict()
# create an instance of PostFhirServers200Response from a dict
post_fhir_servers200_response_from_dict = PostFhirServers200Response.from_dict(post_fhir_servers200_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


