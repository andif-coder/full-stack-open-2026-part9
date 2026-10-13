import { NewEntrySchema, type NewDiaryEntry } from "./types";
export const parseDiary = (obj: unknown): NewDiaryEntry => {
	return NewEntrySchema.parse(obj);
};
