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
  Collapse,
  ListSubheader,
  useTheme
} from '@mui/material';

const GRADES_API_URL = 'http://localhost:8080/api/grades';
const TUTORS_BY_GRADE_API_URL_BASE = 'http://localhost:8080/api/grade';

function TutorsMails() {
  const [allGrades, setAllGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [tutors, setTutors] = useState([]);
  const [gradeName, setGradeName] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTutorEmails, setSelectedTutorEmails] = useState(new Set());

  const [loadingGrades, setLoadingGrades] = useState(true);
  const [errorGrades, setErrorGrades] = useState(null);
  const [loadingTutors, setLoadingTutors] = useState(false);
  const [errorTutors, setErrorTutors] = useState(null);

  const [expandedTutors, setExpandedTutors] = useState(new Set());
  const theme = useTheme();

  useEffect(() => {
    console.log("Tutores seleccionados:", selectedTutorEmails);
  }, [selectedTutorEmails]);

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
      setTutors([]);
      setGradeName('');
      setSelectedTutorEmails(new Set());
      setExpandedTutors(new Set());
      return;
    }

    const fetchTutorsForGrade = async () => {
      setLoadingTutors(true);
      setErrorTutors(null);
      setSearchTerm('');
      setSelectedTutorEmails(new Set());
      setExpandedTutors(new Set());

      try {
        const response = await fetch(`${TUTORS_BY_GRADE_API_URL_BASE}/${selectedGradeId}/tutor/emails`);
        if (!response.ok) {
          throw new Error(`Error de red al cargar tutores: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setTutors(data.tutors || []);
        setGradeName(data.gradeName || `Grado ID ${selectedGradeId}`);
      } catch (e) {
        setErrorTutors(e.message || 'Error al cargar los tutores del grado.');
        console.error("Failed to fetch tutors for grade:", e);
        setTutors([]);
        setGradeName('');
      } finally {
        setLoadingTutors(false);
      }
    };
    fetchTutorsForGrade();
  }, [selectedGradeId]);

  const handleGradeChange = (event) => {
    setSelectedGradeId(event.target.value);
  };

  const filteredTutors = useMemo(() => {
    if (!searchTerm.trim()) {
      return tutors;
    }
    return tutors.filter(tutor =>
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tutor.email && tutor.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [tutors, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleSelectTutor = useCallback((tutorEmail) => {
    setSelectedTutorEmails(prevSelectedEmails => {
      const newSelectedEmails = new Set(prevSelectedEmails);
      if (newSelectedEmails.has(tutorEmail)) {
        newSelectedEmails.delete(tutorEmail);
      } else {
        newSelectedEmails.add(tutorEmail);
      }
      console.log("Selected Emails:", newSelectedEmails);
      return newSelectedEmails;
    });
  }, []);

  const handleToggleExpandTutor = (tutorId) => {
    setExpandedTutors(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(tutorId)) {
        newExpanded.delete(tutorId);
      } else {
        newExpanded.add(tutorId);
      }
      return newExpanded;
    });
  };

  const handleSelectAllChange = useCallback((event) => {
    const isChecked = event.target.checked;
    setSelectedTutorEmails(prevSelectedEmails => {
      const newSelectedEmails = new Set(prevSelectedEmails);
      if (isChecked) {
        filteredTutors.forEach(tutor => newSelectedEmails.add(tutor.email));
      } else {
        filteredTutors.forEach(tutor => newSelectedEmails.delete(tutor.email));
      }
      return newSelectedEmails;
    });
  }, [filteredTutors]);

  const numSelectedInFiltered = useMemo(() => {
    return filteredTutors.filter(tutor => selectedTutorEmails.has(tutor.email)).length;
  }, [filteredTutors, selectedTutorEmails]);

  const allFilteredSelected = filteredTutors.length > 0 && numSelectedInFiltered === filteredTutors.length;
  const someFilteredSelected = filteredTutors.length > 0 && numSelectedInFiltered > 0 && numSelectedInFiltered < filteredTutors.length;

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
        Enviar Correos a Tutores por Grado
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

      {selectedGradeId && loadingTutors && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80px">
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 1.5 }}>Cargando tutores de {gradeName || 'este grado'}...</Typography>
        </Box>
      )}

      {selectedGradeId && !loadingTutors && errorTutors && (
        <Typography color="error" sx={{ p: 1.5 }}>
          Error al cargar Tutores para {gradeName || 'el grado seleccionado'}: {errorTutors}
        </Typography>
      )}

      {selectedGradeId && !loadingTutors && !errorTutors && (
        <>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 0.5 }}>
            Tutores de: {gradeName}
          </Typography>
          <TextField
            fullWidth
            label="Buscar tutor por nombre o email"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={tutors.length === 0}
          />
          {tutors.length > 0 && (
            <FormControlLabel
              sx={{ mb: -1 }}
              control={
                <Checkbox
                  size="small"
                  checked={allFilteredSelected}
                  indeterminate={someFilteredSelected}
                  onChange={handleSelectAllChange}
                  disabled={filteredTutors.length === 0}
                />
              }
              labelTypographyProps={{ fontSize: '0.875rem' }}
              label={filteredTutors.length > 0 ? `Seleccionar ${filteredTutors.length} tutor(es) visible(s)` : "No hay tutores que coincidan"}
            />
          )}
          <Box sx={{ maxHeight: 250, overflow: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
            <List dense disablePadding>
              {filteredTutors.length === 0 && !loadingTutors && (
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemText 
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                    primary={tutors.length === 0 ? `No hay tutores en ${gradeName}.` : "No se encontraron tutores que coincidan."} 
                  />
                </ListItem>
              )}
              {filteredTutors.map((tutor) => (
                <React.Fragment key={tutor.tutor_id}>
                  <ListItem
                    button
                    sx={{ py: 0.25 }}
                  >
                    <Checkbox
                      edge="start"
                      checked={selectedTutorEmails.has(tutor.email)}
                      onChange={() => handleToggleSelectTutor(tutor.email)}
                      tabIndex={-1}
                      disableRipple
                      size="small"
                    />
                    <ListItemText
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                      secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      primary={tutor.name}
                      secondary={tutor.email}
                      onClick={() => handleToggleExpandTutor(tutor.tutor_id)}
                      sx={{ cursor: 'pointer' }}
                    />
                  </ListItem>
                  <Collapse in={expandedTutors.has(tutor.tutor_id)} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding dense sx={{ pl: 3, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                      {tutor.students && tutor.students.length > 0 ? (
                        <>
                          <ListSubheader sx={{ bgcolor: 'transparent', lineHeight: '28px', fontSize: '0.75rem', pt: 0.5, pb: 0.25 }}>
                            Estudiantes Asignados:
                          </ListSubheader>
                          {tutor.students.map((student, index) => (
                            <ListItem key={`${tutor.tutor_id}-student-${index}`} sx={{ py: 0.125 }}>
                              <ListItemText
                                primary={student.name}
                                secondary={student.email}
                                primaryTypographyProps={{ fontSize: '0.8rem' }}
                                secondaryTypographyProps={{ fontSize: '0.7rem' }}
                              />
                            </ListItem>
                          ))}
                        </>
                      ) : (
                        <ListItem sx={{ py: 0.25 }}>
                          <ListItemText primary="No tiene estudiantes asignados en este grado." primaryTypographyProps={{ style: { fontStyle: 'italic', fontSize: '0.75rem' } }}/>
                        </ListItem>
                      )}
                    </List>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          </Box>

          {selectedTutorEmails.size > 0 && (
            <Typography variant="caption" sx={{ mt: 0.5 }}>
              Total seleccionado: {selectedTutorEmails.size} tutor(es).
            </Typography>
          )}
      
        </>
      )}
    </Paper>
  );
}

export default TutorsMails;