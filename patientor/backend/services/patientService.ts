import patientsData from '../data/patients.ts';
import type { Patient, NonSensitivePatient } from '../types.ts';
const getEntries = (): Patient[] => {
	return patientsData;
};
const getNonSensitiveEntries = (): NonSensitivePatient[] => {
	return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
		id, name, dateOfBirth, gender, occupation
	}));
};
export default {
	getEntries,
	getNonSensitiveEntries
};
