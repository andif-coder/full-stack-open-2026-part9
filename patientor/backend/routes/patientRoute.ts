import express, { type Response } from 'express';
import patientService from '../services/patientService.ts';
import type { NonSensitivePatient } from '../types.ts';
const router = express.Router();
router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
	res.send(patientService.getNonSensitiveEntries());
});
export default router;
