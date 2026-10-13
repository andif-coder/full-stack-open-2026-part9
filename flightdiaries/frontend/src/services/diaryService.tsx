import axios from 'axios';
import { type DiaryEntry, type NewDiaryEntry, type NonSensitiveDiaryEntry } from '../types';
const baseUrl = 'http://localhost:3000/api/diaries';
export const getAll = async () => {
	const res = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl)
	return res.data;
};
export const createDiary = async (diary: NewDiaryEntry) => {
	const res = await axios.post<DiaryEntry>(baseUrl, diary);
	return res.data;
};
