import express from 'express';
import cors from 'cors';
import diagnosisRoute from './routes/diagnosisRoute.ts';
import patientRoute from './routes/patientRoute.ts';
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3001;
app.get('/api/ping', (_req, res) => {
	console.log('someone pinged here');
	res.send('pong');
});
app.use('/api/diagnoses', diagnosisRoute);
app.use('/api/patients', patientRoute);
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
