import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';
const app = express();
app.use(express.json());
app.get('/hello', (_request, response) => {
	response.send('Hello Full Stack!');
});
app.get('/bmi', (request, response) => {
	const { height, weight } = request.query;
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
});
app.post('/exercises', (request, response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = request.body;
  if (daily_exercises === undefined || target === undefined) {
    response.status(400).json({ error: 'parameters missing' });
    return;
  }
  if (isNaN(Number(target)) || !Array.isArray(daily_exercises)) {
    response.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  for (const e of daily_exercises) {
    if (isNaN(Number(e))) {
      response.status(400).json({ error: 'malformatted parameters' });
      return;
    }
  }
  const hours = daily_exercises.map(e => Number(e));
  const targetNum = Number(target);
  const ret = calculateExercises(hours, targetNum);
  
  response.json(ret);
});
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
