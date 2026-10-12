import { type NewPatient } from "./types.ts";
import { NewPatientEntrySchema } from "./types.ts";
export const parseNewPatient = (obj: unknown): NewPatient => {
	return NewPatientEntrySchema.parse(obj);
};
