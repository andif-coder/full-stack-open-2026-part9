import { Typography, Box } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { type HospitalEntry, type Diagnosis } from "../types";

interface HospitalProps {
  entry: HospitalEntry;
  diagnosisMap: Map<string, Diagnosis> | null;
}

export const Hospital = ({ entry, diagnosisMap }: HospitalProps) => {
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
        <LocalHospitalIcon />
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

      {entry.discharge && (
        <Typography variant="body2" sx={{ my: 0.5 }}>
          discharge ({entry.discharge.date}): {entry.discharge.criteria}
        </Typography>
      )}

      <Typography variant="body2" sx={{ mt: 0.5 }}>
        diagnose by {entry.specialist}
      </Typography>
    </Box>
  );
};
