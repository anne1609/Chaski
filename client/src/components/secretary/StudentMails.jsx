import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import {
  Box,
  TextField,
  Checkbox,
  Typography,
  CircularProgress,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button, // Added Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; 

const GRADES_API_URL = 'http://localhost:8080/api/grades';
const STUDENTS_API_URL = 'http://localhost:8080/api/students';

function StudentMails() {
  const theme = useTheme();
  const navigate = useNavigate(); // Initialized useNavigate
  const [allGrades, setAllGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [allStudentsData, setAllStudentsData] = useState([]);
  const [displayedStudents, setDisplayedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentEmails, setSelectedStudentEmails] = useState(new Set());
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [errorGrades, setErrorGrades] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorStudents, setErrorStudents] = useState(null);

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
    const fetchAllStudents = async () => {
      setLoadingStudents(true);
      setErrorStudents(null);
      try {
        const response = await fetch(STUDENTS_API_URL);
        if (!response.ok) {
          throw new Error(`Error de red al cargar estudiantes: ${response.status}`);
        }
        const data = await response.json();
        setAllStudentsData(Array.isArray(data) ? data : []);
      } catch (e) {
        setErrorStudents(e.message || 'Error al cargar los estudiantes.');
        console.error("Failed to fetch students:", e);
        setAllStudentsData([]);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchAllStudents();
  }, []);

  useEffect(() => {
    let filtered = allStudentsData;

    if (selectedGradeId) {
      filtered = filtered.filter(student => student.grade_id === selectedGradeId);
    }

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        (student.fullName && student.fullName.toLowerCase().includes(lowerSearchTerm))
        // (student.email && student.email.toLowerCase().includes(lowerSearchTerm)) // Removed email search
      );
    }
    setDisplayedStudents(filtered);
  }, [allStudentsData, selectedGradeId, searchTerm]);

  const handleGradeChange = (event) => {
    setSelectedGradeId(event.target.value);
    setSelectedStudentEmails(new Set());
  };

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
    if (event.target.checked) {
      const newSelectedEmails = new Set(displayedStudents.map(student => student.email));
      setSelectedStudentEmails(newSelectedEmails);
    } else {
      setSelectedStudentEmails(new Set());
    }
  }, [displayedStudents]);
  const selectedStudens = allStudentsData.filter(student => selectedStudentEmails.has(student.email));
  const selectedStudentsIds = selectedStudens.map(student => student.id);
  const handleComposeMessage = () => {
    navigate('/secretary/compose-message', {
      state: {
        selectedEmails: Array.from(selectedStudentEmails),
        selectedIds: selectedStudentsIds,
        recipientType: 'Estudiantes',
      }
    });
  };

  if (loadingGrades) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Cargando datos iniciales...</Typography>
      </Box>
    );
  }

  if (errorGrades) {
    return <Typography color="error" sx={{ p: 2 }}>Error al cargar grados: {errorGrades}</Typography>;
  }


  const areAllDisplayedStudentsSelected = displayedStudents.length > 0 && selectedStudentEmails.size === displayedStudents.length;

  return (
    <Paper elevation={1} sx={{ width: '100%', p: theme.spacing(2), display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
      {/* Removed Typography title - can be added back if needed outside this structure */}

      {/* Modified Flexbox layout for controls - similar to TeachersMails */}
      <Box sx={{ display: 'flex', alignItems: 'stretch', width: '100%', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: theme.spacing(2), md: 0 } }}>
        {/* Group for Button + Search TextField */}
        <Box sx={{ display: 'flex', alignItems: 'stretch', width: { xs: '100%', md: 'auto' }, flexGrow: { md: 1 }, flexDirection: { xs: 'column', md: 'row' }, gap: { xs: theme.spacing(2), md: 0 } }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleSelectAllChange({ target: { checked: !areAllDisplayedStudentsSelected } })}
            disabled={loadingStudents || displayedStudents.length === 0}
            sx={{
              paddingInline: 5,
              whiteSpace: 'nowrap',
              borderTopLeftRadius: theme.shape.borderRadius,
              borderBottomLeftRadius: theme.shape.borderRadius,
              borderTopRightRadius: { xs: theme.shape.borderRadius, md: 0 },
              borderBottomRightRadius: { xs: theme.shape.borderRadius, md: 0 },
              zIndex: 1,
              height: 'auto',
              width: { xs: '100%', md: 'auto' },
              backgroundColor: '#1A6487',
              color: 'white',
              '&:hover': {
                backgroundColor: '#165270',
              },
            }}
          >
            {areAllDisplayedStudentsSelected ? "Deseleccionar Todos" : "Seleccionar Todos"}
          </Button>
          <TextField
            fullWidth
            placeholder="Buscar por nombre"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={loadingStudents || allStudentsData.length === 0}
            InputProps={{
              sx: {
                borderTopLeftRadius: { xs: theme.shape.borderRadius, md: 0 },
                borderBottomLeftRadius: { xs: theme.shape.borderRadius, md: 0 },
                borderTopRightRadius: { xs: theme.shape.borderRadius, md: 0 }, // Adjusted for consistency
                borderBottomRightRadius: { xs: theme.shape.borderRadius, md: 0 }, // Adjusted for consistency
                backgroundColor: '#0A3359',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  borderRightWidth: { xs: 1, md: 0 },
                  borderLeftWidth: { xs: 1, md: 1 },
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
              }
            }}
            InputLabelProps={{
              sx: {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: 'white',
                }
              }
            }}
          />
        </Box>

        {/* Filter Box */}
        <Box sx={{ width: { xs: '100%', md: '30%' }, minWidth: { md: '180px' }, flexShrink: { md: 0 } }}>
          <FormControl fullWidth size="small" variant="outlined">
            {/* <InputLabel id="grade-filter-label">Filtrar por Curso</InputLabel> // Optional if placeholder is enough */}
            <Select
              labelId="grade-filter-label"
              value={selectedGradeId}
              // label="Filtrar por Curso" // Remove label if using displayEmpty or placeholder logic
              onChange={handleGradeChange}
              displayEmpty
              disabled={loadingStudents || allGrades.length === 0}
              sx={{
                backgroundColor: '#1A6487',
                color: 'white',
                borderTopLeftRadius: { xs: theme.shape.borderRadius, md: 0 },
                borderBottomLeftRadius: { xs: theme.shape.borderRadius, md: 0 },
                borderTopRightRadius: theme.shape.borderRadius, // Keep rounded on the right
                borderBottomRightRadius: theme.shape.borderRadius, // Keep rounded on the right
                '.MuiSelect-icon': {
                  color: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
              }}
            >
              <MenuItem value="">
                <em>Todos los Cursos</em>
              </MenuItem>
              {allGrades.map((grade) => (
                <MenuItem key={grade.id} value={grade.id} sx={{ color: theme.palette.text.primary }}> {/* Ensure dropdown items have standard text color */}
                  {grade.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loadingStudents && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
          <CircularProgress size={24} /> <Typography sx={{ ml: 1 }}>Cargando estudiantes...</Typography>
        </Box>
      )}
      {errorStudents && !loadingStudents && (
        <Typography color="error" sx={{ p: 2 }}>Error al cargar estudiantes: {errorStudents}</Typography>
      )}

      {!loadingStudents && !errorStudents && (
        <TableContainer component={Paper} sx={{ maxHeight: 350, border: '1px solid #ddd', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
          <Table stickyHeader size="small" aria-label="tabla de estudiantes">
            <TableHead>
              <TableRow sx={{ '& th': { backgroundColor: '#228C3E', color: 'white', borderBottom: 'none' } }}>
                <TableCell sx={{ fontWeight: 'bold', borderTopLeftRadius: '10px' }}></TableCell> {/* Checkbox cell, no text */}
                <TableCell sx={{ fontWeight: 'bold' }}>Estudiante</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Correo</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderTopRightRadius: '10px' }}>Curso</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography sx={{ py: 2, fontSize: '0.875rem', color: theme.palette.text.secondary /* Match teacher message color if needed */ }}>
                      {allStudentsData.length === 0 && !selectedGradeId && !searchTerm ? "No hay estudiantes para mostrar." : "No se encontraron estudiantes que coincidan con los filtros."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                displayedStudents.map((student) => {
                  const isSelected = selectedStudentEmails.has(student.email);
                  return (
                    <TableRow
                      key={student.id}
                      onClick={() => handleToggleSelectStudent(student.email)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      selected={isSelected}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: '#1A6487', // Base row color
                        borderBottom: 'none',
                        '& .MuiTableCell-root': {
                          color: 'white',
                          borderBottom: 'none',
                          padding: '6px 16px',
                        },
                        '&:hover': {
                          backgroundColor: '#3c90b4', // Lighter hover
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#124A63', // Darker selected
                          '&:hover': {
                            backgroundColor: '#104055', // Darker selected hover
                          },
                        },
                      }}
                    >
                      <TableCell padding="checkbox" sx={{ borderBottom: 'none !important' }}>
                        <Checkbox
                          size="small"
                          checked={isSelected}
                          inputProps={{ 'aria-labelledby': `student-checkbox-${student.id}` }}
                          sx={{
                            color: 'white',
                            '&.Mui-checked': {
                              color: 'white',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={`student-checkbox-${student.id}`} scope="row">
                        {student.fullName}
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.gradeName ? student.gradeName : 'N/A'}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {displayedStudents.length > 0 && selectedStudentEmails.size > 0 && (
        <Typography variant="caption" sx={{ mt: 0.5, color: theme.palette.text.secondary /* Or 'white' if preferred on dark bg */ }}>
          Total seleccionado: {selectedStudentEmails.size} estudiante(s).
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, position: 'relative', width: '100%' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/secretary')}
          sx={{
            position: 'absolute',
            left: 0,
            backgroundColor: 'black',
            color: 'white',
            '&:hover': { backgroundColor: 'grey.700' }
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#2C965A',
            color: 'white',
            '&:hover': { backgroundColor: '#278552' }
          }}
          onClick={handleComposeMessage} // Updated onClick handler
          /* disabled={selectedStudentEmails.size === 0} */ // Disable if no emails selected
        >
          Componer mensaje
        </Button>
      </Box>
    </Paper>
  );
}

export default StudentMails;