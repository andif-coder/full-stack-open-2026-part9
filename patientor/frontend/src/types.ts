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

export const BaseEntrySchema = z.object({
  description: z.string().min(1),
  date: z.iso.date(),
  specialist: z.string().min(1),
  diagnosisCodes: z.array(z.string()).optional()
});
const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;
type HealthCheckRating = typeof HealthCheckRating[keyof typeof HealthCheckRating];

export const HealthCheckRatingSchema = z.union([
	z.literal(HealthCheckRating.Healthy),
	z.literal(HealthCheckRating.LowRisk),
	z.literal(HealthCheckRating.HighRisk),
	z.literal(HealthCheckRating.CriticalRisk)
]);

export const HealthCheckEntrySchema = BaseEntrySchema.extend({
	type: z.literal("HealthCheck"),
	healthCheckRating: HealthCheckRatingSchema,
});
export type HealthCheckEntry = z.infer<typeof HealthCheckEntrySchema> & { id : string };

export const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
	type: z.literal("OccupationalHealthcare"),
	employerName: z.string().min(1),
	sickLeave: z.object({
		startDate: z.iso.date(),
		endDate: z.iso.date(),
	}).optional(),
});
export type OccupationalHealthcareEntry = z.infer<typeof OccupationalHealthcareEntrySchema> & { id : string };
export const HospitalEntrySchema = BaseEntrySchema.extend({
	type: z.literal("Hospital"),
	discharge: z.object({
		date: z.iso.date(),
		criteria: z.string().min(1),
	}),
});
export type HospitalEntry = z.infer<typeof HospitalEntrySchema> & { id : string };
export const NewEntrySchema = z.discriminatedUnion("type", [
	HealthCheckEntrySchema,
	OccupationalHealthcareEntrySchema,
	HospitalEntrySchema,
]);
export type NewEntry = z.infer<typeof NewEntrySchema>;
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
