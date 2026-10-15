import { Typography, Box } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import { type OccupationalHealthcareEntry, type Diagnosis } from "../types";

interface OccupationalHealthcareProps {
  entry: OccupationalHealthcareEntry;
  diagnosisMap: Map<string, Diagnosis> | null;
}

export const OccupationalHealthcare = ({
  entry,
  diagnosisMap,
}: OccupationalHealthcareProps) => {
  return (
    <Box
      sx={{
        border: "1px solid #000",
        borderRadius: 1,
        p: 1.5,
        mb: 1.5,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {entry.date}
        </Typography>
        <WorkIcon />
        <Typography variant="body1" sx={{ fontWeight: "bold", fontStyle: "italic" }}>
          {entry.employerName}
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ fontStyle: "italic", my: 0.5 }}>
        {entry.description}
      </Typography>

      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
          {entry.diagnosisCodes.map((code, idx) => (
            <li key={`${code}-${idx}`}>
              <Typography variant="body2">
                {code} {diagnosisMap?.get(code)?.name}
              </Typography>
            </li>
          ))}
        </ul>
      )}

      {entry.sickLeave && (
        <Typography variant="body2" sx={{ my: 0.5 }}>
          sick leave: {entry.sickLeave.startDate} ~ {entry.sickLeave.endDate}
        </Typography>
      )}

      <Typography variant="body2" sx={{ mt: 0.5 }}>
        diagnose by {entry.specialist}
      </Typography>
    </Box>
  );
};
