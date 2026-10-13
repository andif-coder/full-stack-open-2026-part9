import { type CoursePart } from "../types";
import { Part } from "./Part";
interface ContentProps {
	parts: CoursePart[];
}
export const Content = (props: ContentProps) => {
	return (
		<div>
		{props.parts.map((p) => (
			<Part key={p.name} part={p} />
			))}
		</div>
	);
};
