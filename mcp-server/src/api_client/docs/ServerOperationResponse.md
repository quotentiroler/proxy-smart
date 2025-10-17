# ServerOperationResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**success** | **bool** | Whether the operation was successful | 
**message** | **str** | Operation message | 
**timestamp** | **str** | Timestamp (ISO 8601) | 

## Example

```python
from api_client.models.server_operation_response import ServerOperationResponse

# TODO update the JSON string below
json = "{}"
# create an instance of ServerOperationResponse from a JSON string
server_operation_response_instance = ServerOperationResponse.from_json(json)
# print the JSON string representation of the object
print(ServerOperationResponse.to_json())

# convert the object into a dict
server_operation_response_dict = server_operation_response_instance.to_dict()
# create an instance of ServerOperationResponse from a dict
server_operation_response_from_dict = ServerOperationResponse.from_dict(server_operation_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


