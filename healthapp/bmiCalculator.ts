interface BmiValues {
	height: number;
	weight: number;
}
const parseArguments = (args: string[]): BmiValues => {
	if (args.length < 4) throw new Error('Not enough arguments');
	if (args.length > 4) throw new Error('Too many arguments');
	if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
		return {
			height: Number(args[2]),
			weight: Number(args[3]),
		}
	} else {
		throw new Error('Provided values were not numbers!')
	}
}
export const calculateBmi = (height: number, weight: number): string => {
	const height_m = height / 100;
	const bmi = weight / (height_m * height_m);
	if (bmi < 16) {
		return "Underweight (Severe thinness)";
	} else if (bmi < 17) {
		return "Underweight (Moderate thinness)";
	} else if (bmi < 18.5) {
		return "Underweight (Mild thinness)";
	} else if (bmi < 25) {
		return "Normal range";
	} else if (bmi < 30) {
		return "Overweight (Pre-obese)";
	} else if (bmi < 35) {
		return "Obese (Class I)";
	} else if (bmi < 40) {
		return "Obese (Class II)";
	} else {
		return "Obese (Class III)";
	}
}
if (process.argv[1] === import.meta.filename) {
	try {
		const { height, weight } = parseArguments(process.argv);
		console.log(calculateBmi(height, weight))
	} catch (error: unknown) {
		let errorMsg = 'Something bad happened.';
		if (error instanceof Error) {
			errorMsg += ' Error: ' + error.message;
		}
		console.log(errorMsg)
	}
}
