import diagnosisData from '../data/diagnoses.ts';
import { type Diagnosis } from '../types.ts';
const getEntries = (): Diagnosis[] => {
	return diagnosisData;
};
export default {
	getEntries
};
