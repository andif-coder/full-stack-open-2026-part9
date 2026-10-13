import { useEffect, useState } from "react";
import { getAll } from "./services/diaryService";
import { type NonSensitiveDiaryEntry } from "./types";
import { NewDiary } from "./components/DiaryForm";
const App = () => {
	const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
	useEffect(() => {
		getAll()
			.then(data => {
				setDiaries(data);
			});
	}, []);
  return (
    <div>
			<h1>Flight Diaries</h1>
			{diaries.map(d => (
				<div key={d.id}>
					<h3>{d.date}</h3>
					<p>visibility: {d.visibility}</p>
					<p>weather: {d.weather}</p>
				</div>
			))}
			<NewDiary diaries={diaries} setDiaries={setDiaries}/>
    </div>
  );
};

export default App;

