import type { Patient, Entry, NewEntry, Diagnosis } from "../types";
import React, { useState, type Dispatch, type SetStateAction, type SyntheticEvent } from "react";
import axios from "axios";
import patientService from "../services/patients";
import {
  Alert,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
} from "@mui/material";

interface AddEntryProps {
  patient: Patient | null;
  setPatient: Dispatch<SetStateAction<Patient | null>>;
  diagnoses?: Diagnosis[] | null;
  onClose?: () => void;
}

interface ZodIssueItem {
  message: string;
  path?: (string | number)[];
}

const formatZodError = (errorData: unknown): string => {
  if (typeof errorData === "string") return errorData;
  if (Array.isArray(errorData)) {
    return errorData
      .map((issue: ZodIssueItem) => {
        const field = issue.path && issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";
        return `${field}${issue.message}`;
      })
      .join(", ");
  }
  return "Unrecognized error response";
};

type EntryType = "HealthCheck" | "OccupationalHealthcare" | "Hospital";

const healthRatingOptions = [
  { value: 0, label: "0 — Healthy" },
  { value: 1, label: "1 — Low Risk" },
  { value: 2, label: "2 — High Risk" },
  { value: 3, label: "3 — Critical Risk" },
];

export const AddEntry = (props: AddEntryProps) => {
  const { patient, setPatient, diagnoses = [], onClose } = props;

  // 1. 条目类型
  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");

  // 2. 基础通用字段
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [specialist, setSpecialist] = useState<string>("");
  const [selectedDiagnosisCodes, setSelectedDiagnosisCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 3. HealthCheck 专属
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);

  // 4. Hospital 专属
  const [dischargeDate, setDischargeDate] = useState<string>("");
  const [dischargeCriteria, setDischargeCriteria] = useState<string>("");

  // 5. OccupationalHealthcare 专属
  const [employerName, setEmployerName] = useState<string>("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<string>("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<string>("");

  const resetForm = () => {
    setDescription("");
    setDate("");
    setSpecialist("");
    setSelectedDiagnosisCodes([]);
    setHealthCheckRating(0);
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setSickLeaveStartDate("");
    setSickLeaveEndDate("");
    setError(null);
    if (onClose) {
      onClose();
    }
  };

  const handleDiagnosisChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const addEntry = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (!patient) return;

    const baseEntry = {
      description,
      date,
      specialist,
      ...(selectedDiagnosisCodes.length > 0 && { diagnosisCodes: selectedDiagnosisCodes }),
    };

    let newEntryPayload: NewEntry;

    switch (entryType) {
      case "HealthCheck":
        newEntryPayload = {
          ...baseEntry,
          type: "HealthCheck",
          healthCheckRating,
        };
        break;
      case "Hospital":
        newEntryPayload = {
          ...baseEntry,
          type: "Hospital",
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };
        break;
      case "OccupationalHealthcare": {
        const hasSickLeave =
          sickLeaveStartDate.trim() !== "" && sickLeaveEndDate.trim() !== "";

        newEntryPayload = {
          ...baseEntry,
          type: "OccupationalHealthcare",
          employerName,
          ...(hasSickLeave && {
            sickLeave: {
              startDate: sickLeaveStartDate,
              endDate: sickLeaveEndDate,
            },
          }),
        };
        break;
      }
      default:
        return;
    }

    try {
      const addedEntry: Entry = await patientService.createEntry(patient.id, newEntryPayload);

      setPatient((prevPatient) => {
        if (!prevPatient) return null;
        return {
          ...prevPatient,
          entries: prevPatient.entries.concat(addedEntry),
        };
      });

      resetForm();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const resError = e.response?.data?.error;
        if (resError) {
          setError(formatZodError(resError));
        } else {
          setError(e.message || "Unrecognized axios error");
        }
      } else {
        setError("Unknown error");
      }
    }
  };

  return (
    <Box sx={{ border: "2px dashed #999", borderRadius: 1, p: 2, mt: 3, mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        New Entry
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={addEntry}>
        {/* 条目类型下拉框 */}
        <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
          <InputLabel id="entry-type-select-label">Entry type</InputLabel>
          <Select
            labelId="entry-type-select-label"
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as EntryType)}
          >
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
          </Select>
        </FormControl>

        {/* 日期选择器 */}
        <TextField
          label="Date"
          type="date"
          fullWidth
          variant="standard"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 1.5 }}
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />

        <TextField
          label="Description"
          fullWidth
          variant="standard"
          sx={{ mb: 1.5 }}
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />

        <TextField
          label="Specialist"
          fullWidth
          variant="standard"
          sx={{ mb: 2 }}
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />

        {/* 诊断代码多选下拉菜单 */}
        <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
          <InputLabel id="diagnoses-multiple-select-label">Diagnosis codes</InputLabel>
          <Select
            labelId="diagnoses-multiple-select-label"
            multiple
            value={selectedDiagnosisCodes}
            onChange={handleDiagnosisChange}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((val) => (
                  <Chip key={val} label={val} size="small" />
                ))}
              </Box>
            )}
          >
            {diagnoses?.map((diag) => (
              <MenuItem key={diag.code} value={diag.code}>
                {diag.code} — {diag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 动态分支 1：HealthCheck */}
        {entryType === "HealthCheck" && (
          <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
            <InputLabel id="health-rating-select-label">Health Check Rating</InputLabel>
            <Select
              labelId="health-rating-select-label"
              value={healthCheckRating}
              onChange={(e) => setHealthCheckRating(Number(e.target.value))}
            >
              {healthRatingOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* 动态分支 2：Hospital */}
        {entryType === "Hospital" && (
          <Box sx={{ mb: 2, p: 1.5, bgcolor: "rgba(0, 0, 0, 0.02)", borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
              Discharge details
            </Typography>
            <TextField
              label="Discharge Date"
              type="date"
              fullWidth
              variant="standard"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 1.5 }}
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              label="Discharge Criteria"
              fullWidth
              variant="standard"
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </Box>
        )}

        {/* 动态分支 3：OccupationalHealthcare */}
        {entryType === "OccupationalHealthcare" && (
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Employer Name"
              fullWidth
              variant="standard"
              sx={{ mb: 1.5 }}
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <Box sx={{ p: 1.5, bgcolor: "rgba(0, 0, 0, 0.02)", borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
                Sick Leave (optional)
              </Typography>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                variant="standard"
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 1.5 }}
                value={sickLeaveStartDate}
                onChange={({ target }) => setSickLeaveStartDate(target.value)}
              />
              <TextField
                label="End Date"
                type="date"
                fullWidth
                variant="standard"
                InputLabelProps={{ shrink: true }}
                value={sickLeaveEndDate}
                onChange={({ target }) => setSickLeaveEndDate(target.value)}
              />
            </Box>
          </Box>
        )}

        {/* 底部按钮 */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button color="error" variant="contained" type="button" onClick={resetForm}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Add
          </Button>
        </Box>
      </form>
    </Box>
  );
};
