import { createDiary } from "../services/diaryService";
import { Visibility, Weather, type NewDiaryEntry, type NonSensitiveDiaryEntry } from "../types";
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
	const [visibility, setVisibility] = useState<Visibility>(Visibility.Ok);
	const [weather, setWeather] = useState<Weather>(Weather.Sunny);
	const [comment, setComment] = useState("");
	const [msg, setMsg] = useState("");
	const addDiary = async (event: React.SyntheticEvent) => {
		event.preventDefault();
		try {
			const newDiary: NewDiaryEntry = {
				date,
				visibility,
				weather,
				comment
			};
			const res = await createDiary(newDiary);
			setDiaries(diaries.concat(res));
			setDate('');
			setVisibility(Visibility.Ok);
			setWeather(Weather.Sunny);
			setComment('');
		}	catch (error: unknown) {
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
					<span>visibility</span>
					{Object.values(Visibility).map((val) => (
						<label key={val}> {val}
						<input 
							type="radio"
							name="visibility"
							value={val}
							checked={visibility === val}
							onChange={() => setVisibility(val)}
						/>
						</label>
					))}
				</div>
				<div>
					<span>weather</span>
					{Object.values(Weather).map((val) => (
						<label key={val}> {val}
						<input 
							type="radio"
							name="weather"
							value={val}
							checked={weather === val}
							onChange={() => setWeather(val)}
						/>
						</label>
					))}
				</div>
				<div>
					date:<input name="date" type="date" value={date} onChange={e => setDate(e.target.value)} />
					<br />
					comment:<input name="comment" value={comment} onChange={e => setComment(e.target.value)}/>
				</div>
				<button type="submit">add</button>
			</form>
		</div>
	);
}
