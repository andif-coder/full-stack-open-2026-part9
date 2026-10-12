import { type CoursePart } from "../types";
interface ContentProps {
	parts: CoursePart[];
}
export const Content = (props: ContentProps) => {
	return (
		<div>
		{props.parts.map((part) => (
			 <p key={part.name}>
				{part.name} {part.exerciseCount}
			 </p>
			))}
		</div>
	);
};
