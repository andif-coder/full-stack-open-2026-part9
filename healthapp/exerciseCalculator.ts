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
	let rating = 1;
	let ratingDescription = 'bad';
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
	return { periodLength, trainingDays, success, rating, ratingDescription, target, average }
}
console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
