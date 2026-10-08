import express from 'express'
import { calculateBmi } from './bmiCalculator.ts';
const app = express()
app.get('/hello', (_request, response) => {
	response.send('Hello Full Stack!');
})
app.get('/bmi', (request, response) => {
	const { height, weight } = request.query
	if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
		response.status(400).json({ error: 'malformatted parameters' });
		return ;
	}
	const heightNum = Number(height);
	const weightNum = Number(weight);
	const bmi = calculateBmi(heightNum, weightNum);
	response.json({
		weight: weightNum,
		height: heightNum,
		bmi: bmi,
	});
})
const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
