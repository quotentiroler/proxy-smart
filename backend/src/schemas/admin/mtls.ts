import { t, type Static } from 'elysia'
import { CertificateDetails } from './common'

/**
 * mTLS Configuration schemas for secure server communication
 */

export const MtlsConfigResponse = t.Object({
  enabled: t.Boolean({ description: 'Whether mTLS is enabled for this server' }),
  hasCertificates: t.Object({
    clientCert: t.Boolean({ description: 'Whether client certificate is uploaded' }),
    clientKey: t.Boolean({ description: 'Whether client private key is uploaded' }),
    caCert: t.Boolean({ description: 'Whether CA certificate is uploaded' })
  }),
  certDetails: t.Optional(CertificateDetails)
}, { title: 'MtlsConfig' })

export const UpdateMtlsConfigRequest = t.Object({
  enabled: t.Boolean({ description: 'Enable or disable mTLS for this server' })
}, { title: 'UpdateMtlsConfigRequest' })

export const UploadCertificateRequest = t.Object({
  type: t.Union([
    t.Literal('client'),
    t.Literal('key'),
    t.Literal('ca')
  ], { description: 'Type of certificate to upload' }),
  content: t.String({ description: 'Base64-encoded certificate or key content' }),
  filename: t.Optional(t.String({ description: 'Original filename (for reference)' }))
}, { title: 'UploadCertificateRequest' })

export const CertificateUploadResponse = t.Object({
  success: t.Boolean({ description: 'Whether the upload was successful' }),
  message: t.String({ description: 'Success or error message' }),
  certDetails: t.Optional(CertificateDetails)
}, { title: 'CertificateUpload' })

// TypeScript type inference helpers
export type MtlsConfigResponseType = Static<typeof MtlsConfigResponse>
export type UpdateMtlsConfigRequestType = Static<typeof UpdateMtlsConfigRequest>
export type UploadCertificateRequestType = Static<typeof UploadCertificateRequest>
export type CertificateUploadResponseType = Static<typeof CertificateUploadResponse>
