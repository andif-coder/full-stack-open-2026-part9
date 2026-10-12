import express, { type Response } from 'express';
import patientService from '../services/patientService.ts';
import type { NonSensitivePatient } from '../types.ts';
import { parseNewPatient } from '../utils.ts';
import { z } from 'zod';
const router = express.Router();
router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
	res.send(patientService.getNonSensitiveEntries());
});
router.post('/', (req, res) => {
	try {
		const newEntry = parseNewPatient(req.body);
		const addedEntry = patientService.addPatient(newEntry);
		res.json(addedEntry);
	} catch(error: unknown) {
		if (error instanceof z.ZodError) {
			res.status(400).send({ error: error.issues });
		} else {
			res.status(400).send({ error: 'unknown error' });
		}
	}
});
export default router;
