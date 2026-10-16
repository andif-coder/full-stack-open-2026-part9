import express, { type Response } from 'express';
import patientService from '../services/patientService.ts';
import { NewEntrySchema, type NonSensitivePatient } from '../types.ts';
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
router.get('/:id', (req, res) => {
	const { id } = req.params;
	if (!id || typeof id !== 'string') {
		res.status(400).send({ error: 'Missing or invalid id parameter' });
		return ;
	}
	const patient = patientService.queryPatient(id);
	if (!patient) {
		res.status(404).send({ error: `can't find patient with id: ${id}` });
		return ;
	}
	res.json(patient);
});
router.post('/:id/entries', (req, res) => {
	const { id } = req.params;
	const parseResult = NewEntrySchema.safeParse(req.body);
	if (!parseResult.success) {
		return res.status(400).json({ error: parseResult.error.issues });
	}
	try {
		const addedEntry = patientService.addEntry(id, parseResult.data);
		return res.status(201).json(addedEntry);
	} catch (error: unknown) {
		let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(404).json({ error: errorMessage });
	}
});
export default router;
