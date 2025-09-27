/* Minimal FHIR types used by UI components. Extend as needed. */
export interface HumanName {
  use?: string;
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
}

export interface Patient {
  resourceType?: 'Patient';
  id?: string;
  name?: HumanName[];
  birthDate?: string;
  gender?: string;
  telecom?: Array<{ system?: string; value?: string; use?: string }>;
  address?: Array<{ line?: string[]; city?: string; state?: string; postalCode?: string; country?: string }>;
  [key: string]: any;
}

export interface LaunchContext {
  patientId?: string;
  encounterId?: string;
  providerId?: string;
  appClientId?: string;
  raw?: Record<string, any>;
}

export function formatHumanName(name?: HumanName): string {
  if (!name) return '';
  if (name.text) return name.text;
  const given = name.given?.join(' ') ?? '';
  const family = name.family ?? '';
  return [given, family].filter(Boolean).join(' ').trim();
}

export function formatPatientName(p?: Patient | null | undefined): string {
  if (!p) return '';
  const names = p.name ?? [];
  if (!names.length) return 'Unnamed';
  const formatted = names.map(n => formatHumanName(n)).filter(Boolean);
  return formatted.length ? formatted.join(', ') : 'Unnamed';
}
