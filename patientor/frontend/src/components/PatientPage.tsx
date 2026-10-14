import { useParams } from "react-router-dom";
import patientService from "../services/patients";
import { useEffect, useState } from "react";
import { type Patient } from "../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender'; // 或者用其他替代图标表示 other
import { Typography, Box } from "@mui/material";

export const PatientPage = () => {
	const { id } = useParams<{ id: string }>();
	const [patient, setPatient] = useState<Patient | null>(null);
	useEffect(() => {
		if (id) {
			try {
				patientService.getOne(id).then(res => { setPatient(res); });
			} catch(error: unknown) {
				console.error(error);
			}
		}
	}, [id]);
	if (!patient) {
		return <div>loading...</div>;
	}
	return (
		<Box sx={{ mt: 2, mb: 2 }}>
		  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
		    <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
		      {patient.name}
		    </Typography>
		    {patient.gender === "male" && <MaleIcon />}
		    {patient.gender === "female" && <FemaleIcon />}
		    {patient.gender === "other" && <TransgenderIcon />}
		  </Box>
		
		  <Typography variant="body1">ssn: {patient.ssn}</Typography>
		  <Typography variant="body1">occupation: {patient.occupation}</Typography>
		  <Typography variant="body1">date of birth: {patient.dateOfBirth}</Typography>
		</Box>
	);
};
