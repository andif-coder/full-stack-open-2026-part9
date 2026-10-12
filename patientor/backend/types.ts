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
};
export type NonSensitivePatient = Omit<Patient, 'ssn'>;
