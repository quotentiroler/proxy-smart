import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Link,
  User,
  Database,
  Plus,
  Trash2,
  ExternalLink,
  Users,
  Stethoscope,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// FHIR Resource Types that can be linked to Person
export type LinkedResourceType = 'Patient' | 'Practitioner' | 'RelatedPerson';

// Identity Assurance Levels as per FHIR spec
export type AssuranceLevel = 'level1' | 'level2' | 'level3' | 'level4';

export interface PersonLink {
  id: string;
  target: {
    resourceType: LinkedResourceType;
    reference: string;
    display?: string;
  };
  assurance: AssuranceLevel;
  created: string;
  notes?: string;
}

export interface PersonResource {
  id: string;
  serverName: string;
  serverUrl: string;
  display: string;
  name: {
    family: string;
    given: string[];
  };
  links: PersonLink[];
}

interface PersonResourceLinkerProps {
  availablePersons?: PersonResource[];
  onPersonUpdate: (personId: string, updatedLinks: PersonLink[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function PersonResourceLinker({ 
  availablePersons = [], 
  onPersonUpdate, 
  isOpen, 
  onClose 
}: PersonResourceLinkerProps) {
  const [selectedPersonId, setSelectedPersonId] = useState<string>('');
  const [showAddLinkForm, setShowAddLinkForm] = useState(false);
  const [newLink, setNewLink] = useState<Partial<PersonLink>>({
    target: {
      resourceType: 'Patient',
      reference: '',
      display: ''
    },
    assurance: 'level2',
    notes: ''
  });

  const selectedPerson = availablePersons?.find(p => p.id === selectedPersonId);

  // Get resource type icon
  const getResourceTypeIcon = (resourceType: LinkedResourceType) => {
    switch (resourceType) {
      case 'Patient':
        return <User className="w-4 h-4" />;
      case 'Practitioner':
        return <Stethoscope className="w-4 h-4" />;
      case 'RelatedPerson':
        return <Users className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  // Get assurance level color
  const getAssuranceLevelColor = (level: AssuranceLevel) => {
    switch (level) {
      case 'level1':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'level2':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'level3':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'level4':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Add new link
  const handleAddLink = () => {
    if (!selectedPerson || !newLink.target?.reference) {
      return;
    }

    const link: PersonLink = {
      id: Date.now().toString(),
      target: {
        resourceType: newLink.target.resourceType as LinkedResourceType,
        reference: newLink.target.reference,
        display: newLink.target.display || newLink.target.reference
      },
      assurance: newLink.assurance as AssuranceLevel,
      created: new Date().toISOString(),
      notes: newLink.notes
    };

    const updatedLinks = [...selectedPerson.links, link];
    onPersonUpdate(selectedPersonId, updatedLinks);
    setShowAddLinkForm(false);
    resetNewLinkForm();
  };

  // Remove link
  const handleRemoveLink = (linkId: string) => {
    if (!selectedPerson) return;
    
    const updatedLinks = selectedPerson.links.filter(link => link.id !== linkId);
    onPersonUpdate(selectedPersonId, updatedLinks);
  };

  // Reset new link form
  const resetNewLinkForm = () => {
    setNewLink({
      target: {
        resourceType: 'Patient',
        reference: '',
        display: ''
      },
      assurance: 'level2',
      notes: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
              <Link className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                Person Resource Linker
              </DialogTitle>
              <DialogDescription className="text-gray-600 font-medium mt-1">
                Link Person resources to other FHIR resources on the same server
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Step 1: Select Person Resource */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>1. Select Person Resource</span>
            </CardTitle>
            <CardDescription>
              Choose which Person resource to manage links for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedPersonId} onValueChange={setSelectedPersonId}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select a Person resource" />
              </SelectTrigger>
              <SelectContent>
                {availablePersons.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>{person.display}</span>
                      <Badge variant="outline" className="text-xs">
                        {person.serverName}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedPerson && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">{selectedPerson.display}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700">
                        <strong>Server:</strong> {selectedPerson.serverName}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      <strong>Person ID:</strong> {selectedPerson.id}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">
                      {selectedPerson.links.length} links
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Manage Links (only show if person is selected) */}
        {selectedPerson && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Link className="w-5 h-5" />
                    <span>2. Manage Resource Links</span>
                  </CardTitle>
                  <CardDescription>
                    Add or remove links to other resources on {selectedPerson.serverName}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowAddLinkForm(true)}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Link Form */}
              {showAddLinkForm && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <h4 className="font-semibold text-green-900 mb-4">Add New Resource Link</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Resource Type</Label>
                      <Select
                        value={newLink.target?.resourceType}
                        onValueChange={(value) => setNewLink(prev => ({
                          ...prev,
                          target: { ...prev.target!, resourceType: value as LinkedResourceType }
                        }))}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select resource type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Patient">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>Patient</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="Practitioner">
                            <div className="flex items-center space-x-2">
                              <Stethoscope className="w-4 h-4" />
                              <span>Practitioner</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="RelatedPerson">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>RelatedPerson</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Assurance Level</Label>
                      <Select
                        value={newLink.assurance}
                        onValueChange={(value) => setNewLink(prev => ({
                          ...prev,
                          assurance: value as AssuranceLevel
                        }))}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="level1">Level 1 - Little confidence</SelectItem>
                          <SelectItem value="level2">Level 2 - Some confidence</SelectItem>
                          <SelectItem value="level3">Level 3 - High confidence</SelectItem>
                          <SelectItem value="level4">Level 4 - Very high confidence</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium">Resource Reference</Label>
                    <Input
                      placeholder="e.g., Patient/123 or Practitioner/456"
                      value={newLink.target?.reference}
                      onChange={(e) => setNewLink(prev => ({
                        ...prev,
                        target: { ...prev.target!, reference: e.target.value }
                      }))}
                      className="rounded-xl"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Enter the resource ID that exists on {selectedPerson.serverName}
                    </p>
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium">Display Name (Optional)</Label>
                    <Input
                      placeholder="e.g., John Doe or Dr. Smith"
                      value={newLink.target?.display}
                      onChange={(e) => setNewLink(prev => ({
                        ...prev,
                        target: { ...prev.target!, display: e.target.value }
                      }))}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="mt-4">
                    <Label className="text-sm font-medium">Notes (Optional)</Label>
                    <Input
                      placeholder="Additional notes about this link..."
                      value={newLink.notes}
                      onChange={(e) => setNewLink(prev => ({ ...prev, notes: e.target.value }))}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <Button
                      onClick={handleAddLink}
                      className="px-6 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddLinkForm(false);
                        resetNewLinkForm();
                      }}
                      className="px-6 py-2 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Existing Links */}
              {selectedPerson.links.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Existing Links</h4>
                  {selectedPerson.links.map(link => (
                    <div key={link.id} className="p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                            {getResourceTypeIcon(link.target.resourceType)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h5 className="font-semibold text-gray-900">
                                {link.target.display || link.target.reference}
                              </h5>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-sm text-gray-600">
                              {link.target.resourceType} • {link.target.reference}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={`text-xs ${getAssuranceLevelColor(link.assurance)}`}>
                                {link.assurance.toUpperCase()}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Added {new Date(link.created).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`${selectedPerson.serverUrl}/${link.target.reference}`, '_blank')}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveLink(link.id)}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {link.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600 italic">{link.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No links yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Link this Person to other resources on {selectedPerson.serverName}
                  </p>
                  <Button
                    onClick={() => setShowAddLinkForm(true)}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Show message if no person selected */}
        {!selectedPerson && (
          <Card className="bg-gray-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a Person Resource
              </h3>
              <p className="text-gray-600">
                Choose a Person resource above to manage its links to other FHIR resources
              </p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Export a trigger component for easy integration
export function PersonResourceLinkerTrigger({ 
  children, 
  availablePersons = [], 
  onPersonUpdate 
}: {
  children: React.ReactNode;
  availablePersons?: PersonResource[];
  onPersonUpdate: (personId: string, updatedLinks: PersonLink[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>
      <PersonResourceLinker
        availablePersons={availablePersons}
        onPersonUpdate={onPersonUpdate}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
