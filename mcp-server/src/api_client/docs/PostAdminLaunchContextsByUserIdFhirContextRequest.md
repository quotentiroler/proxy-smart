# PostAdminLaunchContextsByUserIdFhirContextRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**fhir_context** | **str** | Additional FHIR resources in context (JSON array of objects) | 

## Example

```python
from api_client.models.post_admin_launch_contexts_by_user_id_fhir_context_request import PostAdminLaunchContextsByUserIdFhirContextRequest

# TODO update the JSON string below
json = "{}"
# create an instance of PostAdminLaunchContextsByUserIdFhirContextRequest from a JSON string
post_admin_launch_contexts_by_user_id_fhir_context_request_instance = PostAdminLaunchContextsByUserIdFhirContextRequest.from_json(json)
# print the JSON string representation of the object
print(PostAdminLaunchContextsByUserIdFhirContextRequest.to_json())

# convert the object into a dict
post_admin_launch_contexts_by_user_id_fhir_context_request_dict = post_admin_launch_contexts_by_user_id_fhir_context_request_instance.to_dict()
# create an instance of PostAdminLaunchContextsByUserIdFhirContextRequest from a dict
post_admin_launch_contexts_by_user_id_fhir_context_request_from_dict = PostAdminLaunchContextsByUserIdFhirContextRequest.from_dict(post_admin_launch_contexts_by_user_id_fhir_context_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


