# OAuthAnalyticsTopClient


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**client_id** | **str** | OAuth client ID | 
**client_name** | **str** | Client display name | 
**count** | **float** | Number of requests | 
**success_rate** | **float** | Success rate percentage | 

## Example

```python
from api_client.models.o_auth_analytics_top_client import OAuthAnalyticsTopClient

# TODO update the JSON string below
json = "{}"
# create an instance of OAuthAnalyticsTopClient from a JSON string
o_auth_analytics_top_client_instance = OAuthAnalyticsTopClient.from_json(json)
# print the JSON string representation of the object
print(OAuthAnalyticsTopClient.to_json())

# convert the object into a dict
o_auth_analytics_top_client_dict = o_auth_analytics_top_client_instance.to_dict()
# create an instance of OAuthAnalyticsTopClient from a dict
o_auth_analytics_top_client_from_dict = OAuthAnalyticsTopClient.from_dict(o_auth_analytics_top_client_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


