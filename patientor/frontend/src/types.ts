import { z } from "zod";
export const Gender = {
	Male: 'male',
	Female: 'female',
	Other: 'other'
} as const;
export interface Diagnosis {
	code: string;
	name: string;
	latin?: string;
}
export type Gender = typeof Gender[keyof typeof Gender];

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}
const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;
type HealthCheckRating = typeof HealthCheckRating[keyof typeof HealthCheckRating];
interface Discharge {
	date: string;
	criteria: string;
}
export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
interface SickLeave {
	startDate: string;
	endDate: string;
}
export interface OccupationalHealthcareEntry extends BaseEntry {
	type: "OccupationalHealthcare";
	employerName: string;
	sickLeave?: SickLeave;
}
export interface HospitalEntry extends BaseEntry {
	type: "Hospital";
	discharge: Discharge;
}
export type Entry = 
	| HealthCheckEntry 
	| OccupationalHealthcareEntry 
	| HospitalEntry;

export const NewPatientEntrySchema = z.object({
	name: z.string(),
	dateOfBirth: z.iso.date(),
	ssn: z.string(),
	gender: z.enum(Gender),
	occupation: z.string()
});
export type NewPatient = z.infer<typeof NewPatientEntrySchema>;
export interface Patient extends NewPatient {
	id: string;
	entries: Entry[];
};
export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
