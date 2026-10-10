import express, { type Response } from 'express';
import patientService from '../services/patientService.ts';
import type { Patient, NonSensitivePatient } from '../types.ts';
const router = express.Router();
router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
	res.send(patientService.getNonSensitiveEntries());
});
router.post('/', (req, res: Response<Patient>) => {
	/* eslint-disable @typescript-eslint/no-unsafe-assignment */
	const { name, dateOfBirth, ssn, gender, occupation } = req.body;
	const addedEntry = patientService.addPatient({
		name, dateOfBirth, ssn, gender, occupation
	});
	res.json(addedEntry);
});
export default router;
