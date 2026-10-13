import axios from 'axios';
import { type NonSensitiveDiaryEntry } from '../types';
const baseUrl = 'http://localhost:3000/api/diaries';
export const getAll = async () => {
	const res = await axios.get<NonSensitiveDiaryEntry[]>(baseUrl)
	return res.data;
};
