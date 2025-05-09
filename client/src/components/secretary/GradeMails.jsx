import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme
} from '@mui/material';

const GRADES_API_URL = 'http://localhost:8080/api/grades';
const STUDENTS_BY_GRADE_API_URL_BASE = 'http://localhost:8080/api/grade';

function GradeMails() {
  const [allGrades, setAllGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [students, setStudents] = useState([]);
  const [fetchedGradeName, setFetchedGradeName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentEmails, setSelectedStudentEmails] = useState(new Set());
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [errorGrades, setErrorGrades] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorStudents, setErrorStudents] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    console.log("Estudiantes seleccionados:", selectedStudentEmails);
  }, [selectedStudentEmails]);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoadingGrades(true);
      setErrorGrades(null);
      try {
        const response = await fetch(GRADES_API_URL);
        if (!response.ok) {
          throw new Error(`Error de red al cargar grados: ${response.status}`);
        }
        const data = await response.json();
        setAllGrades(data.grades || []);
      } catch (e) {
        setErrorGrades(e.message || 'Error al cargar los grados.');
        console.error("Failed to fetch grades:", e);
      } finally {
        setLoadingGrades(false);
      }
    };
    fetchGrades();
  }, []);

  useEffect(() => {
    if (!selectedGradeId) {
      setStudents([]);
      setFetchedGradeName('');
      setSelectedStudentEmails(new Set());
      return;
    }

    const fetchStudentsForGrade = async () => {
      setLoadingStudents(true);
      setErrorStudents(null);
      setSearchTerm('');
      setSelectedStudentEmails(new Set());
      try {
        const response = await fetch(`${STUDENTS_BY_GRADE_API_URL_BASE}/${selectedGradeId}/emails`);
        console.log("Respuesta:", response);
        if (!response.ok) {
          throw new Error(`Error de red al cargar estudiantes: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setStudents(data.emails || []);
        setFetchedGradeName(data.gradeName || '');
      } catch (e) {
        setErrorStudents(e.message || 'Error al cargar los estudiantes del grado.');
        console.error("Failed to fetch students for grade:", e);
        setStudents([]);
        setFetchedGradeName('');
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudentsForGrade();
  }, [selectedGradeId]);

  const handleGradeChange = (event) => {
    setSelectedGradeId(event.target.value);
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return students;
    }
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [students, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleSelectStudent = useCallback((studentEmail) => {
    setSelectedStudentEmails(prevSelectedEmails => {
      const newSelectedEmails = new Set(prevSelectedEmails);
      if (newSelectedEmails.has(studentEmail)) {
        newSelectedEmails.delete(studentEmail);
      } else {
        newSelectedEmails.add(studentEmail);
      }
      return newSelectedEmails;
    });
  }, []);

  const handleSelectAllChange = useCallback((event) => {
    const isChecked = event.target.checked;
    setSelectedStudentEmails(prevSelectedEmails => {
      const newSelectedEmails = new Set(prevSelectedEmails);
      if (isChecked) {
        filteredStudents.forEach(student => newSelectedEmails.add(student.email));
      } else {
        filteredStudents.forEach(student => newSelectedEmails.delete(student.email));
      }
      return newSelectedEmails;
    });
  }, [filteredStudents]);

  const numSelectedInFiltered = useMemo(() => {
    return filteredStudents.filter(student => selectedStudentEmails.has(student.email)).length;
  }, [filteredStudents, selectedStudentEmails]);

  const allFilteredSelected = filteredStudents.length > 0 && numSelectedInFiltered === filteredStudents.length;
  const someFilteredSelected = filteredStudents.length > 0 && numSelectedInFiltered > 0 && numSelectedInFiltered < filteredStudents.length;

  if (loadingGrades) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando grados...</Typography>
      </Box>
    );
  }

  if (errorGrades) {
    return <Typography color="error" sx={{ p: 2 }}>Error al cargar grados: {errorGrades}</Typography>;
  }

  return (
    <Paper elevation={1} sx={{ p: theme.spacing(1.5), display: 'flex', flexDirection: 'column', gap: theme.spacing(1.5) }}>
      <Typography variant="subtitle1" gutterBottom>
        Enviar Correos por Grado
      </Typography>

      <FormControl fullWidth variant="outlined" size="small">
        <InputLabel id="grade-select-label">Seleccionar Grado</InputLabel>
        <Select
          labelId="grade-select-label"
          id="grade-select"
          value={selectedGradeId}
          onChange={handleGradeChange}
          label="Seleccionar Grado"
        >
          <MenuItem value="">
            <em>Ninguno</em>
          </MenuItem>
          {allGrades.map((grade) => (
            <MenuItem key={grade.id} value={grade.id}>
              {grade.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedGradeId && fetchedGradeName && (
        <Box sx={{ mt: 0.5, mb: 0.5, p: theme.spacing(1), border: '1px solid #eee', borderRadius: 1, background: '#f9f9f9' }}>
          <Typography variant="body2" gutterBottom>
            Grado: {fetchedGradeName}
          </Typography>
        </Box>
      )}

      {selectedGradeId && loadingStudents && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80px">
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 1.5 }}>Cargando estudiantes de {fetchedGradeName || 'este grado'}...</Typography>
        </Box>
      )}

      {selectedGradeId && !loadingStudents && errorStudents && (
        <Typography color="error" sx={{ p: 1.5 }}>
          Error al cargar Estudiantes para {fetchedGradeName || 'el grado seleccionado'}: {errorStudents}
        </Typography>
      )}

      {selectedGradeId && !loadingStudents && !errorStudents && (
        <>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: fetchedGradeName ? 0 : 1.5 }}>
            Estudiantes de: {fetchedGradeName || "Grado Seleccionado"}
          </Typography>
          <TextField
            fullWidth
            label="Buscar estudiante por nombre o email"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={students.length === 0}
          />
          {students.length > 0 && (
            <FormControlLabel
              sx={{ mb: -1 }}
              control={
                <Checkbox
                  size="small"
                  checked={allFilteredSelected}
                  indeterminate={someFilteredSelected}
                  onChange={handleSelectAllChange}
                  disabled={filteredStudents.length === 0}
                />
              }
              labelTypographyProps={{ fontSize: '0.875rem' }}
              label={filteredStudents.length > 0 ? `Seleccionar ${filteredStudents.length} estudiante(s) visible(s)` : "No hay estudiantes que coincidan"}
            />
          )}
          <Box sx={{ maxHeight: 250, overflow: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
            <List dense disablePadding>
              {filteredStudents.length === 0 && !loadingStudents && (
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                    primary={students.length === 0 ? `No hay estudiantes en ${fetchedGradeName || 'este grado'}.` : "No se encontraron estudiantes que coincidan."}
                  />
                </ListItem>
              )}
              {filteredStudents.map((student) => (
                <ListItem
                  key={student.email}
                  button
                  onClick={() => handleToggleSelectStudent(student.email)}
                  sx={{ py: 0.25 }}
                >
                  <Checkbox
                    edge="start"
                    checked={selectedStudentEmails.has(student.email)}
                    tabIndex={-1}
                    disableRipple
                    size="small"
                  />
                  <ListItemText
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                    primary={student.name}
                    secondary={student.email}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {selectedStudentEmails.size > 0 && (
            <Typography variant="caption" sx={{ mt: 0.5 }}>
              Total seleccionado: {selectedStudentEmails.size} estudiante(s).
            </Typography>
          )}
        </>
      )}
    </Paper>
  );
}

export default GradeMails;