import { HealthCheck } from "./HealthCheck";
import { OccupationalHealthcare } from "./OccupationalHealthcare";
import { Hospital } from "./Hospital";
import { type Entry, type Diagnosis } from "../types";
const assertNever = (value: never): never => {
	throw new Error(
		`Unhandled discriminated union member: ${JSON.stringify(value)}`
	);
};
interface EntryDetailsProps {
	entry: Entry;
	diagnosisMap: Map<string, Diagnosis> | null;
}
export const EntryDetails = (props: EntryDetailsProps) => {
	const { entry, diagnosisMap } = props;
	switch(entry.type) {
		case "HealthCheck":
			return <HealthCheck entry={entry} diagnosisMap={diagnosisMap}/>;
		case "OccupationalHealthcare":
			return <OccupationalHealthcare entry={entry} diagnosisMap={diagnosisMap}/>;
		case "Hospital":
			return <Hospital entry={entry} diagnosisMap={diagnosisMap}/>;
		default:
			return assertNever(entry);
	};
};
