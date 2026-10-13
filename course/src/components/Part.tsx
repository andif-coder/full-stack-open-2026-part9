import { type CoursePart } from '../types'
interface PartProps {
	part: CoursePart;
}
const assertNever = (value: never): never => {
	throw new Error(`Unhandled discriminated member: ${JSON.stringify(value)}`);
}
export const Part = (props: PartProps) => {
	switch(props.part.kind) {
		case "basic":
			return (
				<div>
					<h2> {props.part.name} {props.part.exerciseCount}</h2>
					<p>{props.part.description}</p>
				</div>
			)
		case "group":
			return (
				<div>
					<h2> {props.part.name} {props.part.exerciseCount}</h2>
					<p>{props.part.groupProjectCount}</p>
				</div>
			)
		case "background":
			return (
				<div>
					<h2> {props.part.name} {props.part.exerciseCount}</h2>
					<p>{props.part.description}</p>
					<p>{props.part.backgroundMaterial}</p>
				</div>
			)
		case "special":
			return (
				<div>
					<h2> {props.part.name} {props.part.exerciseCount}</h2>
					<p>{props.part.description}</p>
					{props.part.requirements.map((r: string) => (<p key={r}>{r}</p>))}
				</div>
			)
		default:
			return assertNever(props.part);
	}
};
