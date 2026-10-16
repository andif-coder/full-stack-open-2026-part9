import type { Patient, Entry, NewEntry } from "../types";
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
} from "@mui/material";

interface AddEntryProps {
  patient: Patient | null;
  setPatient: Dispatch<SetStateAction<Patient | null>>;
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

export const AddEntry = (props: AddEntryProps) => {
  const { patient, setPatient } = props;

  // 1. 条目类型状态
  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");

  // 2. 公共基础字段状态
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [specialist, setSpecialist] = useState<string>("");
  const [diagCode, setDiagCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // 3. HealthCheck 专属状态
  const [healthCheckRating, setHealthCheckRating] = useState<string>("0");

  // 4. Hospital 专属状态
  const [dischargeDate, setDischargeDate] = useState<string>("");
  const [dischargeCriteria, setDischargeCriteria] = useState<string>("");

  // 5. OccupationalHealthcare 专属状态
  const [employerName, setEmployerName] = useState<string>("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<string>("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<string>("");

  const resetForm = () => {
    setDescription("");
    setDate("");
    setSpecialist("");
    setDiagCode("");
    setHealthCheckRating("0");
    setDischargeDate("");
    setDischargeCriteria("");
    setEmployerName("");
    setSickLeaveStartDate("");
    setSickLeaveEndDate("");
    setError(null);
  };

  const addEntry = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (!patient) return;

    // 解析逗号分隔的诊断码
    const diagnosisCodes = diagCode
      .split(",")
      .map((code) => code.trim())
      .filter((code) => code.length > 0);

    const baseEntry = {
      description,
      date,
      specialist,
      ...(diagnosisCodes.length > 0 && { diagnosisCodes }),
    };

    // 根据选中的类型动态组装符合 NewEntry 判别联合的 payload
    let newEntryPayload: NewEntry;

    switch (entryType) {
      case "HealthCheck":
        newEntryPayload = {
          ...baseEntry,
          type: "HealthCheck",
          healthCheckRating: Number(healthCheckRating),
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
        const hasSickLeave = sickLeaveStartDate !== "" || sickLeaveEndDate !== "";
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
      // 优先调用服务层封装的接口
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
        {/* 条目类型切换下拉框 */}
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

        {/* 公共字段 */}
        <TextField
          label="Description"
          fullWidth
          variant="standard"
          sx={{ mb: 1.5 }}
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
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
          label="Specialist"
          fullWidth
          variant="standard"
          sx={{ mb: 1.5 }}
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <TextField
          label="Diagnosis Codes (comma-separated)"
          placeholder="e.g. M24.2, M51.2"
          fullWidth
          variant="standard"
          sx={{ mb: 2 }}
          value={diagCode}
          onChange={({ target }) => setDiagCode(target.value)}
        />

        {/* 动态分支 1：HealthCheck */}
        {entryType === "HealthCheck" && (
          <TextField
            label="Health Check Rating (0-3)"
            type="number"
            fullWidth
            variant="standard"
            sx={{ mb: 2 }}
            value={healthCheckRating}
            onChange={({ target }) => setHealthCheckRating(target.value)}
          />
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
