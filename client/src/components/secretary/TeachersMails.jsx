import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Added useNavigate
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
  Paper,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button, // Added Button
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const TEACHERS_API_URL = 'http://localhost:8080/api/teachers/emails';
const GRADES_API_URL = 'http://localhost:8080/api/grades';

function TeachersMails() {
  const [allTeachers, setAllTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate(); // Initialized useNavigate
  const [grades, setGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [loadingGrades, setLoadingGrades] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoadingGrades(true);
      try {
        const response = await fetch(GRADES_API_URL);
        if (!response.ok) {
          throw new Error(`Error de red al cargar grados: ${response.status}`);
        }
        const data = await response.json();
        setGrades(data.grades || []);
      } catch (e) {
        console.error("Failed to fetch grades:", e);
      } finally {
        setLoadingGrades(false);
      }
    };
    fetchGrades();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      setError(null);
      let url = TEACHERS_API_URL;
      if (selectedGradeId) {
        url += `?gradeId=${selectedGradeId}`;
      }
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error de red: ${response.status}`);
        }
        const data = await response.json();
        // Ensure subjects is always an array
        const teachersWithGuaranteedSubjects = (data.teachers || []).map(t => ({...t, subjects: t.subjects || [] }));
        setAllTeachers(teachersWithGuaranteedSubjects);
      } catch (e) {
        setError(e.message || 'Error al cargar los datos de profesores.');
        console.error("Failed to fetch teachers:", e);
        setAllTeachers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [selectedGradeId]);

  const filteredTeachers = useMemo(() => {
    let teachersToFilter = allTeachers;
    // Search term filter - ONLY BY NAME
    if (searchTerm.trim()) {
      teachersToFilter = teachersToFilter.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return teachersToFilter;
  }, [allTeachers, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGradeChange = (event) => {
    setSelectedGradeId(event.target.value);
    setSelectedEmails(new Set());
  };

  const handleToggleSelectTeacher = useCallback((email) => {
    setSelectedEmails(prevSelectedEmails => {
      const newSelectedEmails = new Set(prevSelectedEmails);
      if (newSelectedEmails.has(email)) {
        newSelectedEmails.delete(email);
      } else {
        newSelectedEmails.add(email);
      }
      return newSelectedEmails;
    });
  }, []);

  const handleSelectAllChange = useCallback((event) => {
    const isChecked = event.target.checked;
    setSelectedEmails(prevSelectedEmails => {
      const newSelectedEmails = new Set();
      if (isChecked) {
        filteredTeachers.forEach(teacher => newSelectedEmails.add(teacher.email));
      }
      return newSelectedEmails;
    });
  }, [filteredTeachers]);

  const numSelectedInFiltered = useMemo(() => {
    return filteredTeachers.filter(teacher => selectedEmails.has(teacher.email)).length;
  }, [filteredTeachers, selectedEmails]);

  const allFilteredSelected = filteredTeachers.length > 0 && numSelectedInFiltered === filteredTeachers.length;
  const someFilteredSelected = filteredTeachers.length > 0 && numSelectedInFiltered > 0 && numSelectedInFiltered < filteredTeachers.length;
  const selectedTeachers = allTeachers.filter(teacher => selectedEmails.has(teacher.email));
  const selectedTeachersIds = selectedTeachers.map(teacher => teacher.id);
  const handleComposeMessage = () => {
    navigate('/secretary/compose-message', {
      state: {
        selectedEmails: Array.from(selectedEmails),
        selectedIds: selectedTeachersIds,
        recipientType: 'Profesores',
        remitentType: 'secretary',
      }
    });
  };

  if (loadingGrades) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }
  if (loading && !error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Error al cargar profesores: {error}
      </Typography>
    );
  }

  return (
    <Paper elevation={1} sx={{ width: '100%', p: theme.spacing(2), display: 'flex', flexDirection: 'column', gap: theme.spacing(2) }}>
      {/* Modified Flexbox layout for controls */}
      <Box sx={{ display: 'flex', alignItems: 'stretch', width: '100%', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: theme.spacing(2), md: 0 } }}>
        {/* Group for Button + Search TextField */}
        <Box sx={{ display: 'flex', alignItems: 'stretch', width: { xs: '100%', md: 'auto' }, flexGrow: { md: 1 }, flexDirection: { xs: 'column', md: 'row' }, gap: { xs: theme.spacing(2), md: 0 } }}>
          <Button
            variant="contained" // Changed from outlined to contained for better background color display
            size="small"
            onClick={() => handleSelectAllChange({ target: { checked: !allFilteredSelected } })}
            disabled={filteredTeachers.length === 0}
            sx={{
              paddingInline: 5,
              whiteSpace: 'nowrap',
              // Responsive border radius
              borderTopLeftRadius: theme.shape.borderRadius, // Standard top-left radius
              borderBottomLeftRadius: theme.shape.borderRadius, // Standard bottom-left radius
              borderTopRightRadius: { xs: theme.shape.borderRadius, md: 0 }, // Round on xs, 0 on md
              borderBottomRightRadius: { xs: theme.shape.borderRadius, md: 0 }, // Round on xs, 0 on md
              zIndex: 1, // To ensure it overlaps correctly with TextField border on md
              height: 'auto', // Allow button to size height based on content + padding
              width: { xs: '100%', md: 'auto' }, // Full width on xs, auto on md
              backgroundColor: '#1A6487', 
              color: 'white', 
              '&:hover': {
                backgroundColor: '#165270', 
              },
            }}
          >
            {allFilteredSelected ? "Deseleccionar Todos" : "Seleccionar Todos"}
          </Button>
          <TextField
            fullWidth // Ensures TextField takes full width of its container
           // label="Buscar por nombre de profesor"
           placeholder='Buscar por nombre'
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              sx: {
                // Responsive border radius
                borderTopLeftRadius: { xs: theme.shape.borderRadius, md: 0 }, // Round on xs, 0 on md
                borderBottomLeftRadius: { xs: theme.shape.borderRadius, md: 0 }, // Round on xs, 0 on md
                borderTopRightRadius: { xs: theme.shape.borderRadius, md: 0 }, // Round on xs, 0 on md
                borderBottomRightRadius: { xs: theme.shape.borderRadius, md: 0 }, // Round on xs, 0 on md
                backgroundColor: '#0A3359',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  borderRightWidth: { xs: 1, md: 0 }, // Show right border on xs, hide on md for connection
                  // Ensure other borders are standard on xs
                  borderLeftWidth: { xs: 1, md: 1 }, // Standard left border (TextField is not first on md if Button is there)
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
                color: 'rgba(255, 255, 255, 0.7)', // Lighter label color
                '&.Mui-focused': {
                  color: 'white', // Label color when focused
                }
              }
            }}
          />
        </Box>

        {/* Filter Box */}
        <Box sx={{ width: { xs: '100%', md: '30%' }, minWidth: { md: '180px' }, flexShrink: { md: 0 } }}>
          <FormControl fullWidth size="small" variant="outlined">
            {/* <InputLabel id="grade-select-label">Filtrar por Curso</InputLabel> */}
            <Select
              labelId="grade-select-label"
              value={selectedGradeId}
              //label="Filtrar por Curso"
              onChange={handleGradeChange}
              displayEmpty
              sx={{
                backgroundColor: '#1A6487',
                color: 'white',
                borderTopLeftRadius: { xs: theme.shape.borderRadius, md: 0 }, // Responsive
                borderBottomLeftRadius: { xs: theme.shape.borderRadius, md: 0 }, // Responsive
                // Default right radius will apply, or specify if needed:
                // borderTopRightRadius: theme.shape.borderRadius,
                // borderBottomRightRadius: theme.shape.borderRadius,
                '.MuiSelect-icon': {
                  color: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { // Border color when focused
                  borderColor: 'white',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': { // Border color on hover
                  borderColor: 'white',
                },
                '.MuiOutlinedInput-notchedOutline': { // Default border color
                  borderColor: 'rgba(255, 255, 255, 0.5)', // Lighter white for default border
                },
              }}
            >
              <MenuItem value="">
                <em>Todos los Cursos</em>
              </MenuItem>
              {grades.map((grade) => (
                <MenuItem key={grade.id} value={grade.id}>
                  {grade.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading && (
         <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
           <CircularProgress size={24}/> <Typography sx={{ml: 1}}>Cargando profesores...</Typography>
         </Box>
      )}
      {error && <Typography color="error" sx={{ p: 2 }}>Error al cargar profesores: {error}</Typography>}

      {/* Removed FormControlLabel for select all */}

      <TableContainer component={Paper} sx={{ maxHeight: 350, border: '1px solid #ddd', borderRadius: '10px' }}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow sx={{ '& th': { backgroundColor: '#228C3E', color: 'white' , borderBottom: 'none'} }}> {/* Changed background and text color */}
             <TableCell sx={{ fontWeight: 'bold', borderTopLeftRadius: '10px' }}></TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Profesor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Correo</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderTopRightRadius: '10px' }}>Materias</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                    <CircularProgress size={24}/> <Typography sx={{ml: 1}}>Cargando profesores...</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="error">Error al cargar profesores: {error}</Typography>
                </TableCell>
              </TableRow>
            ) : filteredTeachers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography sx={{ py: 2, fontSize: '0.875rem' }}>
                    {allTeachers.length === 0 && !selectedGradeId ? "No hay profesores para mostrar." : "No se encontraron profesores que coincidan con los filtros."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTeachers.map((teacher) => (
                <TableRow
                  onClick={() => handleToggleSelectTeacher(teacher.email)}
                  role="checkbox"
                  aria-checked={selectedEmails.has(teacher.email)}
                  tabIndex={-1}
                  key={teacher.id || teacher.email}
                  selected={selectedEmails.has(teacher.email)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: '#1A6487',
                    borderBottom: 'none', // Remove bottom border to avoid spacing
                    '& .MuiTableCell-root': {
                      color: 'white',
                      borderBottom: 'none', // Remove cell bottom border
                      padding: '6px 16px', // Adjust padding as needed, default is often 16px
                    },
                    '&:hover': {
                      backgroundColor: '#3c90b4', // Lighter shade for hover (e.g., a lighter blue)
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#124A63',
                      '&:hover': {
                        backgroundColor: '#104055',
                      },
                    },
                  }}
                >
                  <TableCell padding="checkbox"
                    sx={{ // Specific sx for checkbox cell to ensure its border is also handled
                      borderBottom: 'none !important',
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={selectedEmails.has(teacher.email)}
                      inputProps={{ 'aria-labelledby': `teacher-checkbox-${teacher.id || teacher.email}` }}
                      sx={{ // Style checkbox for dark background
                        color: 'white',
                        '&.Mui-checked': {
                          color: 'white',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell component="th" id={`teacher-checkbox-${teacher.id || teacher.email}`} scope="row">
                    {teacher.name}
                  </TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    {(teacher.subjects && teacher.subjects.length > 0) ? teacher.subjects.join(', ') : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredTeachers.length > 0 && selectedEmails.size > 0 && (
        <Typography variant="caption" sx={{ mt: 0.5, color: theme.palette.text.secondary }}>
          Total seleccionado: {selectedEmails.size} profesor(es).
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
         /*  disabled={selectedEmails.size === 0}  */// Disable if no emails selected
        >
          Componer mensaje
        </Button>
      </Box>
    </Paper>
  );
}

export default TeachersMails;