# SetNeedPatientBannerRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**need_patient_banner** | **bool** | Whether patient banner is required | 

## Example

```python
from api_client.models.set_need_patient_banner_request import SetNeedPatientBannerRequest

# TODO update the JSON string below
json = "{}"
# create an instance of SetNeedPatientBannerRequest from a JSON string
set_need_patient_banner_request_instance = SetNeedPatientBannerRequest.from_json(json)
# print the JSON string representation of the object
print(SetNeedPatientBannerRequest.to_json())

# convert the object into a dict
set_need_patient_banner_request_dict = set_need_patient_banner_request_instance.to_dict()
# create an instance of SetNeedPatientBannerRequest from a dict
set_need_patient_banner_request_from_dict = SetNeedPatientBannerRequest.from_dict(set_need_patient_banner_request_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


