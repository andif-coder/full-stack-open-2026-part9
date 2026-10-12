import { Header } from "./components/Header";
import { Total } from "./components/Total"
import { type CoursePart } from "./types"
import { Content } from "./components/Content";
const App = () => {
  const courseName: string = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  const totalExercises: number = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
			<Header name={courseName} />
			<Content parts={courseParts} />
			<Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;
