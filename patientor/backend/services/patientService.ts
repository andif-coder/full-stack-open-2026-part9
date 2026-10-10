import patientsData from '../data/patients.ts';
import type { Patient, NonSensitivePatient, NewPatient } from '../types.ts';
import { v1 as uuid } from 'uuid';
const getEntries = (): Patient[] => {
	return patientsData;
};
const getNonSensitiveEntries = (): NonSensitivePatient[] => {
	return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
		id, name, dateOfBirth, gender, occupation
	}));
};
const addPatient = (entry: NewPatient): Patient =>{
	const addedPatient = {
		...entry,
		id: uuid()
	};
	patientsData.push(addedPatient);
	return addedPatient;
};
export default {
	getEntries,
	getNonSensitiveEntries,
	addPatient
};
