import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Checkbox,
    Typography,
    CircularProgress,
    Paper,
    useTheme,
    Select,
    MenuItem,
    FormControl,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';

const GRADES_API_URL = 'http://localhost:8080/api/grades';
const ALL_TUTORS_API_URL = 'http://localhost:8080/api/tutors/emails';

function GradeMails() {
  const [allGrades, setAllGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [allTutorsData, setAllTutorsData] = useState([]);
  const [displayedTutors, setDisplayedTutors] = useState([]);
  const [currentGradeName, setCurrentGradeName] = useState('Todos los Grados');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTutorEmails, setSelectedTutorEmails] = useState(new Set());
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [errorGrades, setErrorGrades] = useState(null);
  const [loadingTutors, setLoadingTutors] = useState(true);
  const [errorTutors, setErrorTutors] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      setLoadingGrades(true);
      try {
        const response = await fetch(GRADES_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllGrades(data.grades || []);
      } catch (e) {
        setErrorGrades(e.message || 'Error al cargar los grados.');
        console.error("Failed to fetch grades:", e);
      }
      setLoadingGrades(false);
    };
    fetchGrades();
  }, []);

  useEffect(() => {
    const fetchAllTutors = async () => {
      setLoadingTutors(true);
      setErrorTutors(null);
      try {
        const response = await fetch(ALL_TUTORS_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllTutorsData(data.tutors || []);
      } catch (e) {
        setErrorTutors(e.message || 'Error al cargar tutores.');
        console.error("Failed to fetch all tutors:", e);
      }
      setLoadingTutors(false);
    };
    fetchAllTutors();
  }, []);

  useEffect(() => {
    // Aplicar filtros a los tutores
    let tutorsToDisplay = allTutorsData.map(tutor => ({
      ...tutor,
      studentsToDisplayInTable: tutor.students || [] 
    }));

    // Filtrar por grado si está seleccionado
    if (selectedGradeId) {
      tutorsToDisplay = tutorsToDisplay.map(tutor => {
        const studentsInGrade = (tutor.students || []).filter(student => 
          student.grade_id && student.grade_id.toString() === selectedGradeId.toString()
        );
        return {
          ...tutor,
          studentsToDisplayInTable: studentsInGrade
        };
      }).filter(tutor => tutor.studentsToDisplayInTable.length > 0);
    }

    setDisplayedTutors(tutorsToDisplay);
    
    // Actualizar nombre del grado
    const gradeObj = allGrades.find(g => g.id.toString() === selectedGradeId.toString());
    const gradeNameForDisplay = selectedGradeId && gradeObj ? gradeObj.name : 'Todos los Grados';
    setCurrentGradeName(gradeNameForDisplay);
    
    // Limpiar selecciones cuando cambia el filtro
    setSelectedTutorEmails(new Set());
  }, [selectedGradeId, allTutorsData, allGrades]);

  const handleGradeChange = (event) => {
    setSelectedGradeId(event.target.value);
    setSelectedTutorEmails(new Set()); 
  };

  const searchedTutors = useMemo(() => {
    if (!searchTerm.trim()) {
      return displayedTutors;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return displayedTutors.filter(tutor =>
      tutor.name.toLowerCase().includes(lowerSearchTerm) ||
      (tutor.email && tutor.email.toLowerCase().includes(lowerSearchTerm)) ||
      (tutor.studentsToDisplayInTable && tutor.studentsToDisplayInTable.some(student => student.name.toLowerCase().includes(lowerSearchTerm)))
    );
  }, [displayedTutors, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleSelectTutor = useCallback((tutorEmail) => {
    setSelectedTutorEmails(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(tutorEmail)) {
        newSelected.delete(tutorEmail);
      } else {
        newSelected.add(tutorEmail);
      }
      return newSelected;
    });
  }, []);

  const numSelectedInSearched = useMemo(() => {
    return searchedTutors.filter(tutor => selectedTutorEmails.has(tutor.email)).length;
  }, [searchedTutors, selectedTutorEmails]);

  const allSearchedSelected = searchedTutors.length > 0 && numSelectedInSearched === searchedTutors.length;

  const handleSelectAllClick = useCallback(() => {
    if (allSearchedSelected) {
      setSelectedTutorEmails(new Set());
    } else {
      setSelectedTutorEmails(new Set(searchedTutors.map(t => t.email)));
    }
  }, [searchedTutors, allSearchedSelected]);
  const selectedTutors = allTutorsData.filter(tutor => selectedTutorEmails.has(tutor.email));
  const selectedTutorsIds = selectedTutors.map(tutor => tutor.id);
  const handleComposeMessage = () => {
    navigate('/secretary/compose-message', {
      state: {
        selectedEmails: Array.from(selectedTutorEmails),
        selectedIds: selectedTutorsIds,
        recipientType: 'Tutores',
      }
    });
  };

  if (loadingGrades || loadingTutors) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress /> <Typography sx={{ ml: 2 }}>Cargando datos...</Typography>
      </Box>
    );
  }

  if (errorGrades) return <Typography color="error" sx={{ p: 2 }}>Error al cargar grados: {errorGrades}</Typography>;
  if (errorTutors) return <Typography color="error" sx={{ p: 2 }}>Error al cargar tutores: {errorTutors}</Typography>;

  return (
    <Paper elevation={1} sx={{ width: '100%', p: theme.spacing(2), display: 'flex', flexDirection: 'column', gap: theme.spacing(2), backgroundColor: theme.palette.background.paper }}>
     
      <Box sx={{ display: 'flex', alignItems: 'stretch', width: '100%', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: theme.spacing(2), md: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'stretch', width: { xs: '100%', md: 'auto' }, flexGrow: { md: 1 }, flexDirection: { xs: 'column', md: 'row' }, gap: { xs: theme.spacing(2), md: 0 } }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleSelectAllClick}
            disabled={searchedTutors.length === 0}
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
            {allSearchedSelected ? "Deseleccionar Todos" : "Seleccionar Todos"}
          </Button>
          <TextField
            fullWidth
            placeholder="Buscar Tutores (Nombre, Email o Estudiante)"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={allTutorsData.length === 0}
            InputProps={{
              sx: {
                borderTopLeftRadius: { xs: theme.shape.borderRadius, md: 0 },
                borderBottomLeftRadius: { xs: theme.shape.borderRadius, md: 0 },
                borderTopRightRadius: theme.shape.borderRadius, 
                borderBottomRightRadius: theme.shape.borderRadius, 
                backgroundColor: '#0A3359',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '& input::placeholder': { 
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1, 
                },
              }
            }}
          />
        </Box>

        <Box sx={{ width: { xs: '100%', md: '30%' }, minWidth: { md: '200px' }, flexShrink: { md: 0 } }}>
          <FormControl fullWidth size="small" variant="outlined">
            <Select
              labelId="grade-select-label"
              value={selectedGradeId}
              onChange={handleGradeChange}
              displayEmpty
              sx={{
                backgroundColor: '#1A6487',
                color: 'white',
                borderTopLeftRadius: { xs: theme.shape.borderRadius, md: 0 }, 
                borderBottomLeftRadius: { xs: theme.shape.borderRadius, md: 0 },
                borderTopRightRadius: theme.shape.borderRadius,
                borderBottomRightRadius: theme.shape.borderRadius,
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
                '& .MuiSelect-select.MuiSelect-select': { 
                    color: 'white',
                    '& em': { 
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontStyle: 'normal', 
                    }
                }
              }}
            >
              <MenuItem value="" sx={{ color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }}> 
                <em>Todos los Grados</em>
              </MenuItem>
              {allGrades.map((grade) => (
                <MenuItem key={grade.id} value={grade.id} sx={{ color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }}>
                  {grade.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

           
      <TableContainer component={Paper} sx={{ maxHeight: 450, border: '1px solid #ddd', borderRadius: '10px' }}>
        <Table stickyHeader size="small" aria-label="tutors table">
          <TableHead>
            <TableRow sx={{ '& th': { backgroundColor: '#228C3E', color: 'white' , borderBottom: 'none'} }}>
              <TableCell padding="checkbox" sx={{ fontWeight: 'bold', borderTopLeftRadius: '10px', width: '1%' }}>{/* Checkbox for select all is now the button above */}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Estudiantes</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tutor</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderTopRightRadius: '10px' }}>Grado(s)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchedTutors.map((tutor) => (
                <TableRow 
                  key={tutor.id} 
                  selected={selectedTutorEmails.has(tutor.email)}
                  onClick={() => handleToggleSelectTutor(tutor.email)}
                  sx={{
                      cursor: 'pointer',
                      backgroundColor: '#1A6487',
                      borderBottom: 'none',
                      '& .MuiTableCell-root': {
                        color: 'white',
                        borderBottom: 'none',
                        padding: '6px 16px',
                      },
                      '&:hover': {
                        backgroundColor: '#3c90b4',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#124A63',
                        '&:hover': {
                          backgroundColor: '#104055',
                        },
                      },
                    }}
                >
                  <TableCell 
                    padding="checkbox"
                    sx={{ borderBottom: 'none !important' }}
                  >
                    <Checkbox 
                      checked={selectedTutorEmails.has(tutor.email)} 
                      onChange={(event) => {
                        event.stopPropagation(); 
                        handleToggleSelectTutor(tutor.email);
                      }}
                      onClick={(event) => event.stopPropagation()}
                      sx={{ 
                        color: 'white',
                        '&.Mui-checked': {
                          color: 'white',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {(tutor.studentsToDisplayInTable && tutor.studentsToDisplayInTable.length > 0)
                      ? tutor.studentsToDisplayInTable.map(s => s.name).join(', ')
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" component="div">{tutor.name}</Typography>
                    <Typography variant="caption" display="block">{tutor.email}</Typography>
                  </TableCell>
                  <TableCell>
                    {selectedGradeId
                      ? currentGradeName
                      : (tutor.studentsToDisplayInTable && tutor.studentsToDisplayInTable.length > 0)
                        ? [...new Set(tutor.studentsToDisplayInTable.map(s => s.gradeName))].join(', ')
                        : 'N/A'}
                  </TableCell>
                </TableRow>
            ))}
            {searchedTutors.length === 0 && (
              <TableRow sx={{ '& td': { backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary } }}>
                <TableCell colSpan={4} align="center">
                  <Typography sx={{ fontStyle: 'italic', p: 2 }}>
                    {allTutorsData.length === 0 && !loadingTutors ? 'No hay tutores registrados en el sistema.' :
                     displayedTutors.length === 0 && selectedGradeId ? `No se encontraron tutores para el grado ${currentGradeName}.` :
                     searchTerm ? `No se encontraron tutores que coincidan con "${searchTerm}".` :
                     'No hay tutores para mostrar según el filtro actual.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedTutorEmails.size > 0 && (
        <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'left' }}>
          Total seleccionado: {selectedTutorEmails.size} tutor(es).
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
         /*  disabled={selectedTutorEmails.size === 0} */ // Disable if no emails selected
        >
          Componer mensaje
        </Button>
      </Box>
    </Paper>
  );
}

export default GradeMails;