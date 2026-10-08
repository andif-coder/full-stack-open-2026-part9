interface ExercisesValues {
	target: number;
	hours: number[];
}
const parseArguments = (args: string[]): ExercisesValues => {
	if (args.length < 4) throw new Error('Not enough arguments');
	for (const arg of args.slice(2)) {
		if (isNaN(Number(arg))) {
			throw new Error('Provided values were not numbers!');
		}
	}
	return {
		target: Number(args[2]),
		hours: args.slice(3).map(arg => Number(arg))
	};
};
interface Exercises {
	periodLength: number,
	trainingDays: number,
	success: boolean,
	rating: number,
	ratingDescription: string,
	target: number,
	average: number
}
export const calculateExercises = (exercises_hours: number[], target: number): Exercises => {
	const periodLength = exercises_hours.length;
	const trainingDays = exercises_hours.filter(e => e > 0).length;
	const average = periodLength ? exercises_hours.reduce((sum, cur) => { return sum + cur;}, 0) / periodLength : 0;
	const success = average >= target;
	let rating: number;
	let ratingDescription: string;
	if (average >= target) {
	  rating = 3;
	  ratingDescription = 'great job, target reached!';
	} else if (average >= target * 0.75) {
	  rating = 2;
	  ratingDescription = 'not too bad but could be better';
	} else {
	  rating = 1;
	  ratingDescription = 'too bad, target not reached';
	}
	return { periodLength, trainingDays, success, rating, ratingDescription, target, average };
};
if (process.argv[1] === import.meta.filename) {
	try {
		const { target, hours } = parseArguments(process.argv);
		console.log(calculateExercises(hours, target));
	} catch(error: unknown) {
		let errorMsg = 'Something bad happened.';
		if (error instanceof Error) {
			errorMsg += ' Error: ' + error.message;
		}
		console.log(errorMsg);
	}
}
