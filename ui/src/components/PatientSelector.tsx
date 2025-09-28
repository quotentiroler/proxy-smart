import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Patient } from '../types/fhir';
import { formatPatientName } from '../types/fhir';

interface Props {
  onSelect: (p: Patient) => void;
  fhirBaseUrl?: string;
  placeholder?: string;
}

export const PatientSelector: React.FC<Props> = ({ onSelect, fhirBaseUrl, placeholder }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const baseUrl = useMemo(() => {
    const envUrl = (import.meta as any)?.env?.VITE_FHIR_BASE_URL as string | undefined;
    return fhirBaseUrl || envUrl || '/api/fhir';
  }, [fhirBaseUrl]);

  useEffect(() => {
    if (!query || query.trim().length < 1) {
      setResults([]);
      setError(null);
      if (abortRef.current) abortRef.current.abort();
      return;
    }

    setLoading(true);
    setError(null);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timeout = window.setTimeout(() => {
      const url = `${baseUrl}/Patient?name=${encodeURIComponent(query)}&_count=20`;
      fetch(url, { credentials: 'same-origin', signal: controller.signal })
        .then(async res => {
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
          return res.json();
        })
        .then(bundle => {
          if (controller.signal.aborted) return;
          const entries = Array.isArray(bundle?.entry) ? bundle.entry : [];
          const patients = entries.map((e: any) => e.resource).filter(Boolean) as Patient[];
          setResults(patients);
        })
        .catch(err => {
          if (controller.signal.aborted) return;
          setError(String(err));
          setResults([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query, baseUrl]);

  return (
    <div className="p-3 bg-white rounded shadow-sm border border-gray-200">
      <label className="block text-xs text-gray-600" htmlFor="patient-search-input">Search patient</label>
      <div className="flex items-center gap-2 mt-1">
        <input
          id="patient-search-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder ?? 'Search by family/given name'}
          className="flex-1 border rounded px-2 py-1"
          aria-label="Search patient"
        />
        {loading && <span className="text-sm text-gray-500" aria-live="polite">Searching…</span>}
      </div>

      <div className="mt-2" aria-live="polite">
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {!error && results.length === 0 && query && !loading && (
          <div className="text-sm text-gray-500">No patients found</div>
        )}

        <ul className="mt-2 space-y-1">
          {results.map(p => {
            const nameText = formatPatientName(p);
            return (
              <li key={p.id || nameText}>
                <button
                  type="button"
                  onClick={() => onSelect(p)}
                  className="w-full text-left px-2 py-2 rounded hover:bg-gray-50 flex items-center justify-between"
                  aria-label={`Select patient ${nameText}`}
                >
                  <div>
                    <div className="text-sm font-medium text-gray-800">{nameText}</div>
                    <div className="text-xs text-gray-500">DOB: {p.birthDate ?? '\u2014'}</div>
                  </div>
                  <div className="text-xs text-gray-400">{p.id}</div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PatientSelector;
