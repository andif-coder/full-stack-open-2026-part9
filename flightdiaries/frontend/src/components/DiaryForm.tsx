import { createDiary } from "../services/diaryService";
import { type NewDiaryEntry, type NonSensitiveDiaryEntry } from "../types";
import React, { useState } from "react";
interface NewDiaryProps {
	diaries: NonSensitiveDiaryEntry[];
	setDiaries: React.Dispatch<React.SetStateAction<NonSensitiveDiaryEntry[]>>;
}
export const NewDiary = (props: NewDiaryProps) => {
	const {diaries, setDiaries} = props;
	const [date, setDate] = useState('');
	const [visibility, setVisibility] = useState("");
	const [weather, setWeather] = useState("");
	const [comment, setComment] = useState("");
	const addDiary = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		const newDiary: NewDiaryEntry = {
			date,
			visibility: visibility as any,
			weather: weather as any,
			comment
		};
		const res = await createDiary(newDiary);
		setDiaries(diaries.concat(res));
		setDate('');
		setVisibility('');
		setWeather('');
		setComment('');
	}
	return (
		<div>
			<h2>new diary</h2>
			<form onSubmit={addDiary}>
				<div>
					weather:<input name="weather" value={weather} onChange={e => setWeather(e.target.value)}/>
					<br />
					visibility:<input name="visibility" value={visibility} onChange={e => setVisibility(e.target.value)}/>
					<br />
					date:<input name="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
					<br />
					comment:<input name="comment" value={comment} onChange={e => setComment(e.target.value)}/>
				</div>
				<button type="submit">add</button>
			</form>
		</div>
	);
}
