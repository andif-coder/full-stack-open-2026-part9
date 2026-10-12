import express, { type Response } from 'express';
import patientService from '../services/patientService.ts';
import type { Patient, NonSensitivePatient } from '../types.ts';
import { parseNewPatient } from '../utils.ts';
const router = express.Router();
router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
	res.send(patientService.getNonSensitiveEntries());
});
router.post('/', (req, res: Response<Patient | string>) => {
	try {
		const newEntry = parseNewPatient(req.body);
		const addedEntry = patientService.addPatient(newEntry);
		res.json(addedEntry);
	} catch(error: unknown) {
		let errorMessage = 'Something went wrong';
		if (error instanceof Error) {
			errorMessage += ' Error: ' + error.message;
		}
		res.status(400).send(errorMessage);
	}
});
export default router;
