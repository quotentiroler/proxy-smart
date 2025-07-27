import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Shield, Loader2, Server, Database, Trash2 } from 'lucide-react';
import type { 
  FhirServer, 
  CreateHealthcareUserRequest, 
  HealthcareUserFormData
} from '@/lib/types/api';

interface HealthcareUserAddFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateHealthcareUserRequest) => Promise<void>;
  submitting: boolean;
  fhirServers: FhirServer[];
  availableRealmRoles: string[];
  availableClientRoles: Record<string, string[]>;
  getAllAvailableRoles: () => string[];
}

const initialFormData: HealthcareUserFormData = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  organization: '',
  password: '',
  temporaryPassword: false,
  realmRoles: [],
  clientRoles: {},
  // UI helper fields
  primaryRole: '',
  fhirPersons: [],
};

export function HealthcareUserAddForm({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  fhirServers,
  availableRealmRoles,
  availableClientRoles,
  getAllAvailableRoles
}: HealthcareUserAddFormProps) {
  const [formData, setFormData] = useState<HealthcareUserFormData>(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare API data directly from form data (minimal conversion)
    const apiData: CreateHealthcareUserRequest = {
      username: formData.username,
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      organization: formData.organization,
      password: formData.password,
      temporaryPassword: formData.temporaryPassword,
      realmRoles: formData.realmRoles?.length ? formData.realmRoles : undefined,
      clientRoles: formData.clientRoles && Object.keys(formData.clientRoles).length 
        ? formData.clientRoles 
        : undefined,
      // Convert UI helper field to API format
      fhirUser: formData.fhirPersons?.length 
        ? formData.fhirPersons
            .filter(fp => fp.serverName && fp.personId)
            .map(fp => `${fp.serverName}:${fp.personId}`)
            .join(',')
        : undefined,
    };
    
    await onSubmit(apiData);
    setFormData(initialFormData);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    onClose();
  };

  const addFhirPersonAssociation = () => {
    setFormData(prev => ({
      ...prev,
      fhirPersons: [...(prev.fhirPersons || []), {
        serverName: '',
        personId: '',
        display: '',
        created: new Date().toISOString()
      }]
    }));
  };

  const removeFhirPersonAssociation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fhirPersons: (prev.fhirPersons || []).filter((_, i) => i !== index)
    }));
  };

  const updateFhirPersonAssociation = (index: number, field: keyof NonNullable<HealthcareUserFormData['fhirPersons']>[0], value: string) => {
    setFormData(prev => ({
      ...prev,
      fhirPersons: (prev.fhirPersons || []).map((assoc, i) =>
        i === index ? { ...assoc, [field]: value } : assoc
      )
    }));
  };

  const createPersonInFhir = async (serverName: string, userData: { firstName: string; lastName: string; email: string }) => {
    // Mock implementation
    const mockPersonId = `Person/${Date.now()}`;
    console.log(`Creating Person resource in ${serverName}:`, userData);
    return mockPersonId;
  };

  if (!isOpen) return null;

  return (
    <div className="bg-card/70 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shadow-sm">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">Add New Healthcare User</h3>
            <p className="text-muted-foreground font-medium">Create a new user account for healthcare professionals</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="username" className="text-sm font-semibold text-foreground">Username</Label>
            <Input
              id="username"
              placeholder="e.g., john.smith"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="rounded-xl border-border focus:border-primary focus:ring-primary shadow-sm"
              required
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.smith@hospital.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="rounded-xl border-border focus:border-primary focus:ring-primary shadow-sm"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="firstName" className="text-sm font-semibold text-foreground">First Name</Label>
            <Input
              id="firstName"
              placeholder="e.g., John"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="rounded-xl border-border focus:border-primary focus:ring-primary shadow-sm"
              required
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="lastName" className="text-sm font-semibold text-foreground">Last Name</Label>
            <Input
              id="lastName"
              placeholder="e.g., Smith"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="rounded-xl border-border focus:border-primary focus:ring-primary shadow-sm"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="organization" className="text-sm font-semibold text-foreground">Organization</Label>
            <Input
              id="organization"
              placeholder="e.g., Cardiology Department"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="rounded-xl border-border focus:border-primary focus:ring-primary shadow-sm"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="fhirPersons" className="text-sm font-semibold text-foreground">FHIR Person Associations</Label>
            <div className="space-y-4 bg-primary/5 p-4 rounded-xl border border-primary/20">
              {(formData.fhirPersons || []).map((association, index) => (
                <div key={index} className="space-y-3 bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-semibold text-foreground">FHIR Server Association #{index + 1}</h5>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFhirPersonAssociation(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">FHIR Server</Label>
                      <Select
                        value={association.serverName}
                        onValueChange={(value) => updateFhirPersonAssociation(index, 'serverName', value)}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select FHIR server" />
                        </SelectTrigger>
                        <SelectContent>
                          {fhirServers.map(server => (
                            <SelectItem key={server.name} value={server.name}>
                              <div className="flex items-center space-x-2">
                                <Server className="w-4 h-4" />
                                <span>{server.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <Label className="text-xs font-medium text-muted-foreground">Person ID</Label>
                        <Input
                          placeholder="e.g., Person/12345"
                          value={association.personId}
                          onChange={(e) => updateFhirPersonAssociation(index, 'personId', e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            if (association.serverName) {
                              const personId = await createPersonInFhir(association.serverName, {
                                firstName: formData.firstName,
                                lastName: formData.lastName,
                                email: formData.email
                              });
                              updateFhirPersonAssociation(index, 'personId', personId);
                            }
                          }}
                          disabled={!association.serverName}
                          className="rounded-lg"
                        >
                          <Database className="w-4 h-4 mr-1" />
                          Create
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addFhirPersonAssociation}
                className="w-full rounded-lg border-dashed border-primary/30 text-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add FHIR Server Association
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-semibold text-foreground">Password (Optional)</Label>
            <Input
              id="password"
              type="password"
              placeholder="Leave blank for no password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="rounded-xl border-border focus:border-primary focus:ring-primary shadow-sm"
            />
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 pt-7">
              <input
                id="temporaryPassword"
                type="checkbox"
                checked={formData.temporaryPassword}
                onChange={(e) => setFormData({ ...formData, temporaryPassword: e.target.checked })}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <Label htmlFor="temporaryPassword" className="text-sm text-foreground">Temporary password</Label>
            </div>
          </div>
        </div>
        
        {/* Role Management Section */}
        <div className="space-y-6 bg-primary/5 p-6 rounded-xl border border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Role Management</h4>
              <p className="text-sm text-muted-foreground">Assign roles to control user permissions</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold text-foreground mb-3 block">Primary Role</Label>
              <select
                value={formData.primaryRole}
                onChange={(e) => setFormData({ ...formData, primaryRole: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              >
                <option value="">Select primary role...</option>
                {getAllAvailableRoles().map((role) => (
                  <option key={role} value={role} className="capitalize">
                    {role}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label className="text-sm font-semibold text-foreground mb-3 block">Realm Roles</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableRealmRoles.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <input
                      id={`realm-${role}`}
                      type="checkbox"
                      checked={(formData.realmRoles || []).includes(role)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            realmRoles: [...(formData.realmRoles || []), role]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            realmRoles: (formData.realmRoles || []).filter(r => r !== role)
                          });
                        }
                      }}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor={`realm-${role}`} className="text-sm text-foreground capitalize">
                      {role}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-semibold text-foreground mb-3 block">Admin UI Roles</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableClientRoles['admin-ui']?.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <input
                      id={`client-${role}`}
                      type="checkbox"
                      checked={(formData.clientRoles as Record<string, string[]>)?.[`admin-ui`]?.includes(role) || false}
                      onChange={(e) => {
                        const currentAdminUiRoles = (formData.clientRoles as Record<string, string[]>)?.[`admin-ui`] || [];
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            clientRoles: {
                              ...(formData.clientRoles as Record<string, string[]>),
                              'admin-ui': [...currentAdminUiRoles, role]
                            }
                          });
                        } else {
                          setFormData({
                            ...formData,
                            clientRoles: {
                              ...(formData.clientRoles as Record<string, string[]>),
                              'admin-ui': currentAdminUiRoles.filter((r: string) => r !== role)
                            }
                          });
                        }
                      }}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor={`client-${role}`} className="text-sm text-foreground capitalize">
                      {role.replace('-', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 pt-4">
          <Button 
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Add User'
            )}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={submitting}
            className="px-8 py-3 border-border text-foreground font-semibold rounded-xl hover:bg-muted transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
