import { useParams } from "react-router-dom";
import patientService from "../services/patients";
import diagnosisService from "../services/diagnosis";
import { useEffect, useState } from "react";
import { Diagnosis, type Patient } from "../types";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender'; // 或者用其他替代图标表示 other
import { Typography, Box } from "@mui/material";

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
        patient.entries.map((entry) => (
          <Box key={entry.id} sx={{ mb: 2 }}>
            <Typography variant="body1">
              {entry.date} <i>{entry.description}</i>
            </Typography>

            {/* 如果该条目存在 diagnosisCodes，则渲染无序列表 */}
            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
              <ul>
                {entry.diagnosisCodes.map((code) => (
                  <li key={code}>
                    <Typography variant="body2">{code} {diagnosisMap?.get(code)?.name}</Typography>
                  </li>
                ))}
              </ul>
            )}
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          no entries
        </Typography>
      )}
		</Box>
	);
};
