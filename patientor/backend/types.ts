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
export interface Patient {
	id: string;
	name: string;
	dateOfBirth: string;
	ssn: string;
	gender: GenderType;
	occupation: string;
}
export type NonSensitivePatient = Omit<Patient, 'ssn'>;
export type NewPatient = Omit<Patient, 'id'>;
