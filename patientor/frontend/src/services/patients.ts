import axios from "axios";
import type { Patient, NewPatient, NewEntry, Entry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: NewPatient) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const getOne = async (id: string) => {
	const { data } = await axios.get<Patient>(
		`${apiBaseUrl}/patients/${id}`
	);
	return data;
};

const createEntry = async (id: string, entry: NewEntry) => {
	const { data } = await axios.post<Entry>(
		`${apiBaseUrl}/patients/${id}/entries`,
		entry
	);
	return data;
}

export default {
  getAll, create, getOne, createEntry
};

