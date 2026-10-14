import { z } from "zod";
export const GenderType = {
	Male: 'male',
	Female: 'female',
	Other: 'other'
} as const;
export interface Diagnosis {
	code: string;
	name: string;
	latin?: string;
}
export type GenderType = typeof GenderType[keyof typeof GenderType];

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
interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
interface SickLeave {
	startDate: string;
	endDate: string;
};
interface OccupationalHealthcareEntry extends BaseEntry {
	type: "OccupationalHealthcare";
	employerName: string;
	sickLeave?: SickLeave;
}
interface HospitalEntry extends BaseEntry {
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
	gender: z.enum(GenderType),
	occupation: z.string()
});
export type NewPatient = z.infer<typeof NewPatientEntrySchema>;
export interface Patient extends NewPatient {
	id: string;
	entries: Entry[];
};
export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;
