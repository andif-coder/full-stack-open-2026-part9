import { createDiary } from "../services/diaryService";
import { type Visibility, type Weather, type NewDiaryEntry, type NonSensitiveDiaryEntry } from "../types";
import React, { useState } from "react";
import axios from "axios";
interface NewDiaryProps {
	diaries: NonSensitiveDiaryEntry[];
	setDiaries: React.Dispatch<React.SetStateAction<NonSensitiveDiaryEntry[]>>;
}
interface NotificationProps {
	msg: string;
}
const Notification = (props: NotificationProps) => {
	if (props.msg === '') {
		return null;
	}
	return (
		<div className="error">
			{props.msg}
		</div>
	);
};
export const NewDiary = (props: NewDiaryProps) => {
	const {diaries, setDiaries} = props;
	const [date, setDate] = useState('');
	const [visibility, setVisibility] = useState("");
	const [weather, setWeather] = useState("");
	const [comment, setComment] = useState("");
	const [msg, setMsg] = useState("");
	const addDiary = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		try {
			const newDiary: NewDiaryEntry = {
				date,
				visibility: visibility as Visibility,
				weather: weather as Weather,
				comment
			};
			const res = await createDiary(newDiary);
			setDiaries(diaries.concat(res));
			setDate('');
			setVisibility('');
			setWeather('');
			setComment('');
		}	catch (error: unknown) {
			console.log(error);
			if (axios.isAxiosError(error)) {
	  	  if (error.response && typeof error.response.data === 'string') {
	  	    setMsg(error.response.data);
	  	  } else {
	  	    setMsg('Failed to add diary entry');
	  	  }
	  	} else if (error instanceof Error) {
	  	  setMsg(error.message);
	  	} else {
	  	  setMsg('Unknown error occurred');
	  	}
	  	setTimeout(() => {
	  	  setMsg('');
	  	}, 3000);
		}
	}
	return (
		<div>
			<h2>new diary</h2>
			<Notification msg={msg} />
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
