import { Typography, Box } from "@mui/material";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { type HealthCheckEntry, type Diagnosis } from "../types";

interface HealthCheckProps {
  entry: HealthCheckEntry;
  diagnosisMap: Map<string, Diagnosis> | null;
}

export const HealthCheck = ({ entry, diagnosisMap }: HealthCheckProps) => {
  // 根据评级映射心形颜色：0-健康(绿), 1-低风险(黄), 2-高风险(橙), 3-危急(红)
  const getRatingColor = (rating: number): string => {
    switch (rating) {
      case 0:
        return "#2e7d32"; // green
      case 1:
        return "#fbc02d"; // yellow
      case 2:
        return "#ff9800"; // orange
      case 3:
      default:
        return "#d32f2f"; // red
    }
  };

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
        <MedicalServicesIcon />
      </Box>

      <Typography variant="body1" sx={{ fontStyle: "italic", my: 0.5 }}>
        {entry.description}
      </Typography>

      <Box sx={{ my: 0.5 }}>
        <FavoriteIcon sx={{ color: getRatingColor(entry.healthCheckRating) }} />
      </Box>

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

      <Typography variant="body2" sx={{ mt: 0.5 }}>
        diagnose by {entry.specialist}
      </Typography>
    </Box>
  );
};
