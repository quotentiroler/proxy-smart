import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import type { IdentityProviderFormData } from '@/lib/types/api';

interface IdPAddFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  newIdp: IdentityProviderFormData;
  setNewIdp: (
    idp:
      | IdentityProviderFormData
      | ((previous: IdentityProviderFormData) => IdentityProviderFormData)
  ) => void;
}

export function IdPAddForm({ isOpen, onClose, onSubmit, newIdp, setNewIdp }: IdPAddFormProps) {
  if (!isOpen) return null;

  const updateConfig = <K extends keyof IdentityProviderFormData['config']>(
    key: K,
    value: IdentityProviderFormData['config'][K]
  ) => {
    setNewIdp((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value,
      },
    }));
  };

  return (
    <div className="bg-card/70 backdrop-blur-sm p-8 rounded-2xl border border-border shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/30 rounded-xl flex items-center justify-center shadow-sm">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">Add New Identity Provider</h3>
            <p className="text-muted-foreground font-medium">Configure a new identity provider for healthcare system authentication</p>
          </div>
        </div>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="displayName" className="text-sm font-semibold text-foreground">Display Name</Label>
            <Input
              id="displayName"
              placeholder="e.g., Hospital Azure AD"
              value={newIdp.displayName ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                setNewIdp((prev) => ({
                  ...prev,
                  displayName: value,
                  alias: prev.alias || value.toLowerCase().replace(/\s+/g, '-'),
                  config: {
                    ...prev.config,
                    displayName: value,
                  },
                }));
              }}
              className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
              required
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="alias" className="text-sm font-semibold text-foreground">Alias (unique identifier)</Label>
            <Input
              id="alias"
              placeholder="e.g., hospital-azure-ad"
              value={newIdp.alias}
              onChange={(e) => setNewIdp({ ...newIdp, alias: e.target.value })}
              className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="vendor" className="text-sm font-semibold text-foreground">Provider Vendor</Label>
            <Input
              id="vendor"
              placeholder="e.g., Microsoft Azure, Google, Okta"
              value={newIdp.vendorName ?? ''}
              onChange={(e) => setNewIdp({ ...newIdp, vendorName: e.target.value })}
              className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="enabled" className="text-sm font-semibold text-foreground">Enable Provider Immediately</Label>
            <div className="flex items-center space-x-3 h-12 px-4 rounded-xl border border-border bg-background">
              <input
                id="enabled"
                type="checkbox"
                checked={newIdp.enabled ?? true}
                onChange={(e) => setNewIdp({ ...newIdp, enabled: e.target.checked })}
                className="rounded border-border"
              />
              <span className="text-sm text-foreground">Enabled</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="type" className="text-sm font-semibold text-foreground">Authentication Type</Label>
            <select
              id="type"
              className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-sm focus:border-ring focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
              value={(newIdp.providerId ?? 'saml').toUpperCase()}
              onChange={(e) => setNewIdp({ ...newIdp, providerId: e.target.value.toLowerCase() })}
            >
              <option value="SAML">SAML 2.0</option>
              <option value="OAUTH2">OAuth 2.0</option>
              <option value="OIDC">OpenID Connect</option>
              <option value="LDAP">LDAP</option>
            </select>
          </div>
          <div className="space-y-3">
            <Label htmlFor="entityId" className="text-sm font-semibold text-foreground">Entity ID / Client ID</Label>
            <Input
              id="entityId"
              placeholder="Entity identifier or client ID"
              value={newIdp.config.entityId ?? ''}
              onChange={(e) => updateConfig('entityId', e.target.value)}
              className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
              required
            />
          </div>
        </div>
        <div className="space-y-3">
          <Label htmlFor="ssoUrl" className="text-sm font-semibold text-foreground">SSO URL / Authorization Endpoint</Label>
          <Input
            id="ssoUrl"
            type="url"
            placeholder="https://login.provider.com/sso"
            value={newIdp.config.singleSignOnServiceUrl ?? ''}
            onChange={(e) => updateConfig('singleSignOnServiceUrl', e.target.value)}
            className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
            required
          />
        </div>

        {/* Additional Configuration Fields */}
        <div className="mt-8 pt-6 border-t border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4">Additional Configuration</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <Label htmlFor="configDisplayName" className="text-sm font-semibold text-foreground">UI Display Override</Label>
              <Input
                id="configDisplayName"
                placeholder="Friendly name for login screens"
                value={newIdp.config.displayName ?? ''}
                onChange={(e) => updateConfig('displayName', e.target.value)}
                className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="issuer" className="text-sm font-semibold text-foreground">Issuer</Label>
              <Input
                id="issuer"
                placeholder="Identity provider issuer URL"
                value={newIdp.config.issuer ?? ''}
                onChange={(e) => updateConfig('issuer', e.target.value)}
                className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
              />
            </div>
          </div>

          {/* OIDC/OAuth2 specific fields */}
          {(['oidc', 'oauth2'].includes((newIdp.providerId ?? '').toLowerCase())) && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="clientSecret" className="text-sm font-semibold text-foreground">Client Secret</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    placeholder="OAuth2/OIDC client secret"
                    value={newIdp.config.clientSecret ?? ''}
                    onChange={(e) => updateConfig('clientSecret', e.target.value)}
                    className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="tokenUrl" className="text-sm font-semibold text-foreground">Token URL</Label>
                  <Input
                    id="tokenUrl"
                    type="url"
                    placeholder="https://login.provider.com/token"
                    value={newIdp.config.tokenUrl ?? ''}
                    onChange={(e) => updateConfig('tokenUrl', e.target.value)}
                    className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="userInfoUrl" className="text-sm font-semibold text-foreground">User Info URL</Label>
                  <Input
                    id="userInfoUrl"
                    type="url"
                    placeholder="https://login.provider.com/userinfo"
                    value={newIdp.config.userInfoUrl ?? ''}
                    onChange={(e) => updateConfig('userInfoUrl', e.target.value)}
                    className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="defaultScopes" className="text-sm font-semibold text-foreground">Default Scopes</Label>
                  <Input
                    id="defaultScopes"
                    placeholder="openid profile email"
                    value={newIdp.config.defaultScopes ?? ''}
                    onChange={(e) => updateConfig('defaultScopes', e.target.value)}
                    className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SAML specific fields */}
          {(newIdp.providerId ?? '').toLowerCase() === 'saml' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="signatureAlgorithm" className="text-sm font-semibold text-foreground">Signature Algorithm</Label>
                  <select
                    id="signatureAlgorithm"
                    className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-sm focus:border-ring focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
                    value={newIdp.config.signatureAlgorithm ?? 'RS256'}
                    onChange={(e) => updateConfig('signatureAlgorithm', e.target.value)}
                  >
                    <option value="RS256">RSA-SHA256</option>
                    <option value="RS384">RSA-SHA384</option>
                    <option value="RS512">RSA-SHA512</option>
                    <option value="ES256">ECDSA-SHA256</option>
                    <option value="ES384">ECDSA-SHA384</option>
                    <option value="ES512">ECDSA-SHA512</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="nameIdFormat" className="text-sm font-semibold text-foreground">NameID Format</Label>
                  <select
                    id="nameIdFormat"
                    className="flex h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-sm focus:border-ring focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-200"
                    value={newIdp.config.nameIdPolicyFormat ?? 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent'}
                    onChange={(e) => updateConfig('nameIdPolicyFormat', e.target.value)}
                  >
                    <option value="urn:oasis:names:tc:SAML:2.0:nameid-format:persistent">Persistent</option>
                    <option value="urn:oasis:names:tc:SAML:2.0:nameid-format:transient">Transient</option>
                    <option value="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">Email Address</option>
                    <option value="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">Unspecified</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="certificate" className="text-sm font-semibold text-foreground">X.509 Certificate</Label>
                <Textarea
                  id="certificate"
                  placeholder="-----BEGIN CERTIFICATE-----&#10;MIIBIjANBgkqhkiG9w0BAQ...&#10;-----END CERTIFICATE-----"
                  value={newIdp.config.signingCertificate ?? ''}
                  onChange={(e) => updateConfig('signingCertificate', e.target.value)}
                  className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm min-h-[120px]"
                  rows={5}
                />
              </div>
            </div>
          )}

          {/* Common additional fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <Label htmlFor="logoutUrl" className="text-sm font-semibold text-foreground">Logout URL</Label>
              <Input
                id="logoutUrl"
                type="url"
                placeholder="https://login.provider.com/logout"
                value={newIdp.config.logoutUrl ?? newIdp.config.singleLogoutServiceUrl ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewIdp((prev) => ({
                    ...prev,
                    config: {
                      ...prev.config,
                      logoutUrl: value,
                      singleLogoutServiceUrl: value,
                    },
                  }));
                }}
                className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="metadataUrl" className="text-sm font-semibold text-foreground">Metadata URL</Label>
              <Input
                id="metadataUrl"
                type="url"
                placeholder="https://login.provider.com/.well-known/metadata"
                value={newIdp.config.metadataDescriptorUrl ?? ''}
                onChange={(e) => updateConfig('metadataDescriptorUrl', e.target.value)}
                className="rounded-xl border-border focus:border-ring focus:ring-ring shadow-sm"
              />
            </div>
          </div>

          {/* Security Options */}
          <div className="mt-6 pt-4 border-t border-border">
            <h5 className="text-md font-semibold text-foreground mb-4">Security Options</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="validateSignature"
                  checked={newIdp.config.validateSignature ?? false}
                  onChange={(e) => updateConfig('validateSignature', e.target.checked)}
                  className="rounded border-border"
                />
                <Label htmlFor="validateSignature" className="text-sm text-foreground">Validate Signature</Label>
              </div>
              {(newIdp.providerId ?? '').toLowerCase() === 'saml' && (
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="wantAuthnRequestsSigned"
                    checked={newIdp.config.wantAuthnRequestsSigned ?? false}
                    onChange={(e) => updateConfig('wantAuthnRequestsSigned', e.target.checked)}
                    className="rounded border-border"
                  />
                  <Label htmlFor="wantAuthnRequestsSigned" className="text-sm text-foreground">Want AuthnRequests Signed</Label>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Button 
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Add Identity Provider
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="px-8 py-3 border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
