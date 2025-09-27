import React, { useEffect, useId, useState } from 'react';
import type { LaunchContext, Patient } from '../types/fhir';
import { formatPatientName } from '../types/fhir';

interface Props {
  launchContext?: LaunchContext;
  onChange?: (ctx: LaunchContext) => void;
  // Optional: If you want to display patient summary inline
  patient?: Patient | null;
}

export const LaunchContextPanel: React.FC<Props> = ({ launchContext = {}, onChange, patient = null }) => {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState<LaunchContext>(launchContext);
  const patientId = useId();
  const encounterId = useId();
  const providerId = useId();
  const clientId = useId();

  useEffect(() => {
    setLocal(launchContext);
  }, [launchContext]);

  const toggleEdit = () => setEditing(e => !e);

  const handleField = (k: keyof LaunchContext) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...local, [k]: e.target.value };
    setLocal(updated);
    onChange?.(updated);
  };

  return (
    <section className="p-4 bg-white rounded shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Launch Context</h3>
        <div className="space-x-2">
          <button
            type="button"
            onClick={toggleEdit}
            className="px-3 py-1 text-sm border rounded bg-gray-50 hover:bg-gray-100"
            aria-pressed={editing}
          >
            {editing ? 'Lock' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600" htmlFor={patientId}>Patient ID</label>
          {editing ? (
            <input
              id={patientId}
              value={local.patientId ?? ''}
              onChange={handleField('patientId')}
              className="w-full border rounded px-2 py-1"
              placeholder="Patient ID (Resource id)"
            />
          ) : (
            <div className="mt-1 text-sm text-gray-800" aria-labelledby={patientId}>{local.patientId ?? '\u2014'}</div>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-600" htmlFor={encounterId}>Encounter ID</label>
          {editing ? (
            <input
              id={encounterId}
              value={local.encounterId ?? ''}
              onChange={handleField('encounterId')}
              className="w-full border rounded px-2 py-1"
              placeholder="Encounter ID"
            />
          ) : (
            <div className="mt-1 text-sm text-gray-800" aria-labelledby={encounterId}>{local.encounterId ?? '\u2014'}</div>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-600" htmlFor={providerId}>Provider ID</label>
          {editing ? (
            <input
              id={providerId}
              value={local.providerId ?? ''}
              onChange={handleField('providerId')}
              className="w-full border rounded px-2 py-1"
              placeholder="Practitioner ID"
            />
          ) : (
            <div className="mt-1 text-sm text-gray-800" aria-labelledby={providerId}>{local.providerId ?? '\u2014'}</div>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-600" htmlFor={clientId}>Client/App</label>
          {editing ? (
            <input
              id={clientId}
              value={local.appClientId ?? ''}
              onChange={handleField('appClientId')}
              className="w-full border rounded px-2 py-1"
              placeholder="Client ID"
            />
          ) : (
            <div className="mt-1 text-sm text-gray-800" aria-labelledby={clientId}>{local.appClientId ?? '\u2014'}</div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium">Patient Snapshot</h4>
        {patient ? (
          <div className="mt-2 text-sm">
            <div className="text-gray-700">{formatPatientName(patient)}</div>
            <div className="text-gray-500 text-xs">DOB: {patient.birthDate ?? '\u2014'}</div>
            <div className="text-gray-500 text-xs">Gender: {patient.gender ?? '\u2014'}</div>
          </div>
        ) : (
          <div className="mt-2 text-sm text-gray-500">No patient loaded</div>
        )}
      </div>

      <div className="mt-4 text-right">
        <small className="text-xs text-gray-400">Raw launch params available in debug logs</small>
      </div>
    </section>
  );
};

export default LaunchContextPanel;
