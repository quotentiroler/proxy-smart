# MtlsConfigCertDetails


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**subject** | **str** | Certificate subject DN | 
**issuer** | **str** | Certificate issuer DN | 
**valid_from** | **str** | Certificate validity start date (ISO 8601) | 
**valid_to** | **str** | Certificate validity end date (ISO 8601) | 
**fingerprint** | **str** | Certificate fingerprint (SHA-256) | 

## Example

```python
from api_client.models.mtls_config_cert_details import MtlsConfigCertDetails

# TODO update the JSON string below
json = "{}"
# create an instance of MtlsConfigCertDetails from a JSON string
mtls_config_cert_details_instance = MtlsConfigCertDetails.from_json(json)
# print the JSON string representation of the object
print(MtlsConfigCertDetails.to_json())

# convert the object into a dict
mtls_config_cert_details_dict = mtls_config_cert_details_instance.to_dict()
# create an instance of MtlsConfigCertDetails from a dict
mtls_config_cert_details_from_dict = MtlsConfigCertDetails.from_dict(mtls_config_cert_details_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


