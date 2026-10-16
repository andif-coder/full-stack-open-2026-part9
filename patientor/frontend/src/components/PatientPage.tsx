import { useParams } from "react-router-dom";
import patientService from "../services/patients";
import { useEffect, useState } from "react";
import { Diagnosis, type Patient } from "../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender'; // 或者用其他替代图标表示 other
import { Typography, Box } from "@mui/material";
import { EntryDetails } from "./EntryDetails";
import { AddEntry } from "./AddEntry";

interface PatientPageProps {
	diagnoses: Diagnosis[];
}
export const PatientPage = (props: PatientPageProps) => {
	const { id } = useParams<{ id: string }>();
	const diagnoses = props.diagnoses;
	const [patient, setPatient] = useState<Patient | null>(null);
	useEffect(() => {
			const fetchPatient = async () => {
				if (id) {
					try {
						const res = await patientService.getOne(id);
						setPatient(res);
					} catch(error: unknown) {
						console.error(error);
					}
				}
			}
			void fetchPatient();
	}, [id]);
	if (!patient) {
		return <div>loading...</div>;
	}
	const diagnosisMap: Map<string, Diagnosis> | null = diagnoses ? new Map<string, Diagnosis>(
		diagnoses.map(d => [d.code, d])
	) : null;
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
			<Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
        entries
      </Typography>

      {patient.entries && patient.entries.length > 0 ? (
        patient.entries.map((entry) => (<EntryDetails key={entry.id} diagnosisMap={diagnosisMap} entry={entry}/>))
      ) : (
        <Typography variant="body2" color="textSecondary">
          no entries
        </Typography>
      )}
			{
				<AddEntry setPatient={setPatient} patient={patient} />
			}
		</Box>
	);
};
