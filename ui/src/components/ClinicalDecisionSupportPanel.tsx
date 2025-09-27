import React, { useMemo, useState } from 'react';
import type { Patient } from '../types/fhir';
import { formatPatientName } from '../types/fhir';

interface Props {
  patient?: Patient | null;
  // Endpoint to request CDS suggestions; default assumed to be proxied
  cdsEndpoint?: string;
  // Optional: include more context if available
  encounterId?: string;
}

export const ClinicalDecisionSupportPanel: React.FC<Props> = ({ patient = null, cdsEndpoint, encounterId }) => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const endpoint = useMemo(() => {
    const envUrl = (import.meta as any)?.env?.VITE_CDS_ENDPOINT as string | undefined;
    return cdsEndpoint || envUrl || '/api/cds';
  }, [cdsEndpoint]);

  const requestCds = async () => {
    if (!patient?.id) {
      setError('No patient selected');
      return;
    }
    setLoading(true);
    setError(null);
    setItems(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ patientId: patient.id, encounterId }),
      });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      // Expecting a simple list of suggestions; adapt to CDS Hooks structure if present
      const suggestions = Array.isArray(data?.suggestions) ? data.suggestions : (Array.isArray(data) ? data : []);
      setItems(suggestions);
    } catch (err: any) {
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-4 bg-white rounded shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Clinical Decision Support</h3>
      </div>

      <div className="text-sm text-gray-700">
        <div>Patient: {formatPatientName(patient || undefined) || '\u2014'}</div>
        <div className="text-xs text-gray-500">ID: {patient?.id ?? '\u2014'}</div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={requestCds}
          disabled={loading || !patient?.id}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {loading ? 'Requesting…' : 'Request CDS'}
        </button>
      </div>

      <div className="mt-4" aria-live="polite">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {!error && items && (
          <div className="space-y-2">
            {items.length === 0 && <div className="text-sm text-gray-500">No suggestions returned</div>}
            {items.map((it: any, idx: number) => (
              <div key={idx} className="border rounded p-2 bg-gray-50">
                <div className="text-sm font-medium">{it.title ?? it.summary ?? 'Suggestion'}</div>
                <div className="text-xs text-gray-600">{it.detail ?? (typeof it === 'string' ? it : JSON.stringify(it))}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ClinicalDecisionSupportPanel;
