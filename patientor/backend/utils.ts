import { GenderType, type NewPatient } from "./types.ts";
const isString = (text: unknown): text is string => {
	return typeof text === 'string' || text instanceof String;
};
const isDate = (date: string): boolean => {
	return Boolean(Date.parse(date));
};
const parseName = (name: unknown): string => {
	if (!name || !isString(name)) {
		throw new Error('Incorrect or missing name');
	}
	return name;
};
const parseDate = (date: unknown): string => {
	if (!date || !isString(date) || !isDate(date)) {
		throw new Error('Incorrect or missing dateOfBirth');
	}
	return date;
};
const parseSsn = (ssn: unknown): string =>{
	if (!ssn || !isString(ssn)) {
		throw new Error('Incorrect or missing ssn');
	}
	return ssn;
};
const isGenderType = (gender: string): gender is GenderType => {
	return (Object.values(GenderType) as string[]).includes(gender);
};
const parseGender = (gender: unknown): GenderType => {
	if (!gender || !isString(gender) || !isGenderType(gender)) {
		throw new Error('Incorrect or missing gender');
	}
	return gender;
};
const parseOccupation = (occupation: unknown): string => {
	if (!occupation || !isString(occupation)) {
		throw new Error('Incorrect or missing occupation');
	}
	return occupation;
};
export const parseNewPatient = (obj: unknown): NewPatient => {
	if (!obj || typeof obj !== 'object') {
		throw new Error('Incorrect or missing data');
	}
	if ('name' in obj && 'dateOfBirth' in obj && 'ssn' in obj && 'gender' in obj && 'occupation' in obj) {
		const newPatient: NewPatient = {
			name: parseName(obj.name),
			dateOfBirth: parseDate(obj.dateOfBirth),
			ssn: parseSsn(obj.ssn),
			gender: parseGender(obj.gender),
			occupation: parseOccupation(obj.occupation)
		};
		return newPatient;
	}
	throw new Error('Incorrect data: some fields are missing');
};
