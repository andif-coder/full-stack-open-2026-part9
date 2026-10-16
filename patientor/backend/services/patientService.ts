import patientsData from '../data/patients.ts';
import { type Patient, type NonSensitivePatient, type NewPatient, type Entry, type NewEntry } from '../types.ts';
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
		id: uuid(),
		entries: []
	};
	patientsData.push(addedPatient);
	return addedPatient;
};
const queryPatient = (id: string): Patient | undefined => {
	const res = patientsData.find(p => p.id === id);
	return res;
}
const addEntry = (id: string, entry: NewEntry): Entry => {
	const patient = patientsData.find(p => p.id === id);
	if (!patient) {
		throw new Error(`Patient with id ${id} not found`);
	}
	const newEntry: Entry = {
		...entry,
		id: uuid(),
	};
	if (!patient.entries) {
		patient.entries = [];
	}
	patient.entries.push(newEntry);
	return newEntry;
}
export default {
	getEntries,
	getNonSensitiveEntries,
	addPatient,
	queryPatient,
	addEntry
};
