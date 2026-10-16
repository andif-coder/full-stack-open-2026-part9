import type { Patient, Entry } from "../types";
import React, { useState, type Dispatch, type SetStateAction, type SyntheticEvent } from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Alert, Button, TextField, Box, Typography } from "@mui/material";

interface AddEntryProps {
  patient: Patient | null;
  setPatient: Dispatch<SetStateAction<Patient | null>>;
}

interface ZodIssueItem {
  message: string;
  path?: (string | number)[];
}

// 格式化 Zod 错误数组为可读字符串
const formatZodError = (errorData: unknown): string => {
  if (typeof errorData === "string") return errorData;
  if (Array.isArray(errorData)) {
    return errorData
      .map((issue: ZodIssueItem) => {
        const field = issue.path && issue.path.length > 0 ? `${issue.path.join('.')}: ` : '';
        return `${field}${issue.message}`;
      })
      .join(', ');
  }
  return "Unrecognized error response";
};

export const AddEntry = (props: AddEntryProps) => {
  const { patient, setPatient } = props;
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [healthCheckRating, setHealthCheckRating] = useState<string>('0');
  const [diagCode, setDiagCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setDate('');
    setDescription('');
    setSpecialist('');
    setHealthCheckRating('0');
    setDiagCode('');
    setError(null);
  };

  const addEntry = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (!patient) return;

    const diagnosisCodes = diagCode
      .split(',')
      .map(code => code.trim())
      .filter(code => code.length > 0);

    const newEntryPayload = {
      type: "HealthCheck",
      date,
      description,
      specialist,
      healthCheckRating: Number(healthCheckRating),
      ...(diagnosisCodes.length > 0 && { diagnosisCodes }),
    };

    try {
      const { data } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patient.id}/entries`,
        newEntryPayload
      );

      setPatient(prevPatient => {
        if (!prevPatient) return null;
        return {
          ...prevPatient,
          entries: prevPatient.entries.concat(data),
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
        New HealthCheck Entry
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={addEntry}>
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
          label="Health Check Rating (0-3)"
          type="number"
          fullWidth
          variant="standard"
          sx={{ mb: 1.5 }}
          value={healthCheckRating}
          onChange={({ target }) => setHealthCheckRating(target.value)}
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

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
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
