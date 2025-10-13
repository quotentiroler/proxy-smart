# PostFhirServersRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**url** | **str** | FHIR server base URL | 
**name** | **str** | Optional custom name for the server | [optional] 

## Example

```python
from api_client.models.post_fhir_servers_request import PostFhirServersRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostFhirServersRequest from a JSON string
post_fhir_servers_request_instance = PostFhirServersRequest.from_json(json)
# print the JSON string representation of the object
print(PostFhirServersRequest.to_json())

# convert the object into a dict
post_fhir_servers_request_dict = post_fhir_servers_request_instance.to_dict()
# create an instance of PostFhirServersRequest from a dict
post_fhir_servers_request_from_dict = PostFhirServersRequest.from_dict(post_fhir_servers_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


