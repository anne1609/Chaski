import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TEACHER_COURSES_API_URL = 'http://localhost:8080/api/teachers/my-courses';

function TeacherMails() {
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [allStudentsData, setAllStudentsData] = useState([]);
  const [allTutorsData, setAllTutorsData] = useState([]);
  const [displayedStudents, setDisplayedStudents] = useState([]);
  const [displayedTutors, setDisplayedTutors] = useState([]);
  const [currentCourseName, setCurrentCourseName] = useState('Todos los Cursos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentEmails, setSelectedStudentEmails] = useState(new Set());
  const [selectedTutorEmails, setSelectedTutorEmails] = useState(new Set());
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [errorCourses, setErrorCourses] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        setLoadingCourses(true);
        setErrorCourses(null);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }

        const response = await fetch(TEACHER_COURSES_API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setAllCourses(data.courses || []);
        
        // Extraer todos los estudiantes y tutores únicos
        const allStudents = [];
        const allTutors = [];
        
        data.courses?.forEach(course => {
          course.students?.forEach(student => {
            // Agregar estudiante si no existe ya
            if (!allStudents.find(s => s.id === student.id)) {
              allStudents.push({
                ...student,
                courseId: course.courseId,
                courseName: course.courseName
              });
            }
            
            // Agregar tutores del estudiante (permitir duplicados para diferentes estudiantes)
            student.tutors?.forEach(tutor => {
              allTutors.push({
                ...tutor,
                courseId: course.courseId,
                courseName: course.courseName,
                studentName: student.name,
                studentId: student.id
              });
            });
          });
        });

        setAllStudentsData(allStudents);
        setAllTutorsData(allTutors);
        
      } catch (error) {
        console.error('Error fetching teacher courses:', error);
        setErrorCourses(error.message);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchTeacherCourses();
  }, []);

  useEffect(() => {
    // Aplicar filtros por curso
    let studentsToDisplay = allStudentsData;
    let tutorsToDisplay = allTutorsData;

    if (selectedCourseId) {
      studentsToDisplay = allStudentsData.filter(student => student.courseId === selectedCourseId);
      tutorsToDisplay = allTutorsData.filter(tutor => tutor.courseId === selectedCourseId);
    }

    setDisplayedStudents(studentsToDisplay);
    setDisplayedTutors(tutorsToDisplay);
    
    // Actualizar nombre del curso
    const courseObj = allCourses.find(c => c.courseId === selectedCourseId);
    const courseNameForDisplay = selectedCourseId && courseObj ? courseObj.courseName : 'Todos los Cursos';
    setCurrentCourseName(courseNameForDisplay);
    
    // Limpiar selecciones cuando cambia el filtro
    setSelectedStudentEmails(new Set());
    setSelectedTutorEmails(new Set());
  }, [selectedCourseId, allStudentsData, allTutorsData, allCourses]);

  const handleCourseChange = (event) => {
    setSelectedCourseId(event.target.value);
    setSelectedStudentEmails(new Set());
    setSelectedTutorEmails(new Set());
  };

  // Combinar estudiantes y tutores - cada estudiante en su propia fila
  const combinedRows = useMemo(() => {
    const rows = [];

    // Crear una fila por cada estudiante
    displayedStudents.forEach(student => {
      // Buscar tutores asociados a este estudiante
      const studentTutorsWithDuplicates = displayedTutors.filter(tutor => 
        tutor.studentName === student.name || tutor.studentId === student.id
      );

      // Filtrar tutores únicos por ID para este estudiante específico
      const studentTutors = studentTutorsWithDuplicates.reduce((acc, tutor) => {
        if (!acc.find(t => t.id === tutor.id)) {
          acc.push(tutor);
        }
        return acc;
      }, []);

      if (studentTutors.length > 0) {
        // Si tiene tutores, crear una fila por cada tutor único
        studentTutors.forEach((tutor, index) => {
          rows.push({
            id: `student-${student.id}-tutor-${tutor.id}-${index}`,
            student: student,
            tutor: tutor,
            courseName: student.courseName || tutor.courseName
          });
        });
      } else {
        // Si no tiene tutores, crear una fila solo con el estudiante
        rows.push({
          id: `student-${student.id}`,
          student: student,
          tutor: null,
          courseName: student.courseName
        });
      }
    });

    return rows;
  }, [displayedStudents, displayedTutors]);

  const searchedRows = useMemo(() => {
    if (!searchTerm.trim()) {
      return combinedRows;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return combinedRows.filter(row => {
      const studentMatch = row.student && (
        row.student.name.toLowerCase().includes(lowerSearchTerm) ||
        (row.student.email && row.student.email.toLowerCase().includes(lowerSearchTerm))
      );
      const tutorMatch = row.tutor && (
        row.tutor.name.toLowerCase().includes(lowerSearchTerm) ||
        (row.tutor.email && row.tutor.email.toLowerCase().includes(lowerSearchTerm)) ||
        (row.tutor.studentName && row.tutor.studentName.toLowerCase().includes(lowerSearchTerm))
      );
      return studentMatch || tutorMatch;
    });
  }, [combinedRows, searchTerm]);

  const searchedStudents = useMemo(() => {
    const studentsWithDuplicates = searchedRows.filter(row => row.student).map(row => row.student);
    // Filtrar estudiantes únicos por email para la selección
    const uniqueStudents = studentsWithDuplicates.reduce((acc, student) => {
      if (!acc.find(s => s.email === student.email)) {
        acc.push(student);
      }
      return acc;
    }, []);
    return uniqueStudents;
  }, [searchedRows]);

  const searchedTutors = useMemo(() => {
    const tutorsWithDuplicates = searchedRows.filter(row => row.tutor).map(row => row.tutor);
    // Filtrar tutores únicos por email para la selección
    const uniqueTutors = tutorsWithDuplicates.reduce((acc, tutor) => {
      if (!acc.find(t => t.email === tutor.email)) {
        acc.push(tutor);
      }
      return acc;
    }, []);
    return uniqueTutors;
  }, [searchedRows]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleSelectStudent = useCallback((studentEmail) => {
    setSelectedStudentEmails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentEmail)) {
        newSet.delete(studentEmail);
      } else {
        newSet.add(studentEmail);
      }
      return newSet;
    });
  }, []);

  const handleToggleSelectTutor = useCallback((tutorEmail) => {
    setSelectedTutorEmails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tutorEmail)) {
        newSet.delete(tutorEmail);
      } else {
        newSet.add(tutorEmail);
      }
      return newSet;
    });
  }, []);

  const numSelectedStudentsInSearched = useMemo(() => {
    return searchedStudents.filter(student => selectedStudentEmails.has(student.email)).length;
  }, [searchedStudents, selectedStudentEmails]);

  const numSelectedTutorsInSearched = useMemo(() => {
    return searchedTutors.filter(tutor => selectedTutorEmails.has(tutor.email)).length;
  }, [searchedTutors, selectedTutorEmails]);

  const allSearchedStudentsSelected = searchedStudents.length > 0 && numSelectedStudentsInSearched === searchedStudents.length;
  const allSearchedTutorsSelected = searchedTutors.length > 0 && numSelectedTutorsInSearched === searchedTutors.length;

  const handleSelectAllStudentsClick = useCallback(() => {
    if (allSearchedStudentsSelected) {
      setSelectedStudentEmails(prev => {
        const newSet = new Set(prev);
        searchedStudents.forEach(student => newSet.delete(student.email));
        return newSet;
      });
    } else {
      setSelectedStudentEmails(prev => {
        const newSet = new Set(prev);
        searchedStudents.forEach(student => newSet.add(student.email));
        return newSet;
      });
    }
  }, [searchedStudents, allSearchedStudentsSelected]);

  const handleSelectAllTutorsClick = useCallback(() => {
    if (allSearchedTutorsSelected) {
      setSelectedTutorEmails(prev => {
        const newSet = new Set(prev);
        searchedTutors.forEach(tutor => newSet.delete(tutor.email));
        return newSet;
      });
    } else {
      setSelectedTutorEmails(prev => {
        const newSet = new Set(prev);
        searchedTutors.forEach(tutor => newSet.add(tutor.email));
        return newSet;
      });
    }
  }, [searchedTutors, allSearchedTutorsSelected]);

  const handleComposeMessage = () => {
    const allSelectedEmails = [...selectedStudentEmails, ...selectedTutorEmails];
    const selectedStudents = allStudentsData.filter(student => selectedStudentEmails.has(student.email));
    
    // Filtrar tutores únicos por ID para evitar duplicados en el envío
    const selectedTutorsWithDuplicates = allTutorsData.filter(tutor => selectedTutorEmails.has(tutor.email));
    const uniqueTutors = selectedTutorsWithDuplicates.reduce((acc, tutor) => {
      if (!acc.find(t => t.id === tutor.id)) {
        acc.push(tutor);
      }
      return acc;
    }, []);
    
    const selectedIds = [...selectedStudents.map(s => s.id), ...uniqueTutors.map(t => t.id)];
    
    navigate('/teacher/compose-message', {
      state: {
        selectedEmails: allSelectedEmails,
        selectedIds: selectedIds,
        recipientType: 'Estudiantes y Tutores',
        selectedIdsTutors:  uniqueTutors.map(t => t.id),
        remitentType: 'teacher',
        selectedIdsStudents: selectedStudents.map(s => s.id),
        selectedEmailsTutors: uniqueTutors.map(t => t.email),
        selectedEmailsStudents: selectedStudents.map(s => s.email),
      }
    });
  };

  if (loadingCourses) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress /> <Typography sx={{ ml: 2 }}>Cargando cursos...</Typography>
      </Box>
    );
  }

  if (errorCourses) {
    return <Typography color="error" sx={{ p: 2 }}>Error al cargar cursos: {errorCourses}</Typography>;
  }

  return (
    <Paper elevation={1} sx={{ width: '100%', p: theme.spacing(2), display: 'flex', flexDirection: 'column', gap: theme.spacing(2), backgroundColor: theme.palette.background.paper }}>
      
      <Box sx={{ display: 'flex', alignItems: 'stretch', width: '100%', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: theme.spacing(2), md: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'stretch', width: { xs: '100%', md: 'auto' }, flexGrow: { md: 1 }, flexDirection: { xs: 'column', md: 'row' }, gap: { xs: theme.spacing(2), md: 0 } }}>
          <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleSelectAllStudentsClick}
              disabled={searchedStudents.length === 0}
              sx={{
                paddingInline: 3,
                whiteSpace: 'nowrap',
                borderTopLeftRadius: theme.shape.borderRadius,
                borderBottomLeftRadius: theme.shape.borderRadius,
                borderTopRightRadius: { xs: theme.shape.borderRadius, sm: 0 },
                borderBottomRightRadius: { xs: theme.shape.borderRadius, sm: 0 },
                zIndex: 1,
                height: 'auto',
                width: { xs: '100%', sm: 'auto' },
                backgroundColor: '#1A6487',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#165270',
                },
              }}
            >
              {allSearchedStudentsSelected ? "Deseleccionar Estudiantes" : "Seleccionar Estudiantes"}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleSelectAllTutorsClick}
              disabled={searchedTutors.length === 0}
              sx={{
                paddingInline: 3,
                whiteSpace: 'nowrap',
                borderRadius: { xs: theme.shape.borderRadius, sm: 0 },
                zIndex: 1,
                height: 'auto',
                width: { xs: '100%', sm: 'auto' },
                  backgroundColor: '#1A6487',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#165270',
                },
              }}
            >
              {allSearchedTutorsSelected ? "Deseleccionar Tutores" : "Seleccionar Tutores"}
            </Button>
          </Box>
          <TextField
            fullWidth
            placeholder="Buscar (Nombre, Email o Estudiante)"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={allStudentsData.length === 0 && allTutorsData.length === 0}
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
              labelId="course-select-label"
              value={selectedCourseId}
              onChange={handleCourseChange}
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
                <em>Todos los Cursos</em>
              </MenuItem>
              {allCourses.map((course) => (
                <MenuItem key={course.courseId} value={course.courseId} sx={{ color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }}>
                  {course.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ maxHeight: 450, border: '1px solid #ddd', borderRadius: '10px' }}>
        <Table stickyHeader size="small" aria-label="students and tutors table">
          <TableHead>
            <TableRow sx={{ '& th': { backgroundColor: '#228C3E', color: 'white', borderBottom: 'none' } }}>
              <TableCell padding="checkbox" sx={{ fontWeight: 'bold', borderTopLeftRadius: '10px', width: '1%' }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>Est.</Typography>
              </TableCell>
              <TableCell padding="checkbox" sx={{ fontWeight: 'bold', width: '1%' }}>
                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>Tut.</Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Estudiante</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email Est.</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tutor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email Tut.</TableCell>
              <TableCell sx={{ fontWeight: 'bold', borderTopRightRadius: '10px' }}>Curso</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Filas combinadas de estudiantes y tutores */}
            {searchedRows.map((row) => {
              const isStudentSelected = row.student ? selectedStudentEmails.has(row.student.email) : false;
              const isTutorSelected = row.tutor ? selectedTutorEmails.has(row.tutor.email) : false;
              const isAnySelected = isStudentSelected || isTutorSelected;
              
              // Determinar color de fondo - usar color azul para estudiantes por defecto
              let backgroundColor = '#1A6487'; // Color azul para estudiantes
              let hoverColor = '#3c90b4';
              let selectedColor = '#124A63';

              return (
                <TableRow 
                  key={row.id}
                  selected={isAnySelected}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: backgroundColor,
                    borderBottom: 'none',
                    '& .MuiTableCell-root': {
                      color: 'white',
                      borderBottom: 'none',
                      padding: '6px 16px',
                    },
                    '&:hover': {
                      backgroundColor: hoverColor,
                    },
                    '&.Mui-selected': {
                      backgroundColor: selectedColor,
                      '&:hover': {
                        backgroundColor: selectedColor,
                      },
                    },
                  }}
                >
                  {/* Checkbox para estudiante */}
                  <TableCell padding="checkbox" sx={{ borderBottom: 'none !important' }}>
                    <Checkbox 
                      checked={selectedStudentEmails.has(row.student.email)} 
                      onChange={(event) => {
                        event.stopPropagation();
                        handleToggleSelectStudent(row.student.email);
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
                  
                  {/* Checkbox para tutor */}
                  <TableCell padding="checkbox" sx={{ borderBottom: 'none !important' }}>
                    {row.tutor ? (
                      <Checkbox 
                        checked={selectedTutorEmails.has(row.tutor.email)} 
                        onChange={(event) => {
                          event.stopPropagation();
                          handleToggleSelectTutor(row.tutor.email);
                        }}
                        onClick={(event) => event.stopPropagation()}
                        sx={{ 
                          color: 'white',
                          '&.Mui-checked': {
                            color: 'white',
                          },
                        }}
                      />
                    ) : null}
                  </TableCell>
                  
                  {/* Nombre del Estudiante */}
                  <TableCell>
                    <Typography variant="body2" component="div">
                      {row.student.name}
                    </Typography>
                  </TableCell>
                  
                  {/* Email del Estudiante */}
                  <TableCell>
                    <Typography variant="caption" display="block">
                      {row.student.email}
                    </Typography>
                  </TableCell>
                  
                  {/* Nombre del Tutor */}
                  <TableCell>
                    {row.tutor ? (
                      <Typography variant="body2" component="div">
                        {row.tutor.name}
                      </Typography>
                    ) : (
                      <Typography variant="body2" sx={{ opacity: 0.5 }}>
                        -
                      </Typography>
                    )}
                  </TableCell>
                  
                  {/* Email del Tutor */}
                  <TableCell>
                    {row.tutor ? (
                    
                        <Typography variant="caption" display="block">
                          {row.tutor.email}
                        </Typography>
                        
                    ) : (
                      <Typography variant="caption" sx={{ opacity: 0.5 }}>
                        -
                      </Typography>
                    )}
                  </TableCell>
                  
                  {/* Curso */}
                  <TableCell>
                    <Typography variant="caption">
                      {selectedCourseId ? currentCourseName : row.courseName}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {searchedRows.length === 0 && (
              <TableRow sx={{ '& td': { backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary } }}>
                <TableCell colSpan={7} align="center">
                  <Typography sx={{ fontStyle: 'italic', p: 2 }}>
                    {(allStudentsData.length === 0 && allTutorsData.length === 0) && !loadingCourses ? 'No hay estudiantes ni tutores registrados en sus cursos.' :
                     displayedStudents.length === 0 && selectedCourseId ? `No se encontraron estudiantes para el curso ${currentCourseName}.` :
                     searchTerm ? `No se encontraron resultados que coincidan con "${searchTerm}".` :
                     'No hay datos para mostrar según el filtro actual.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {(selectedStudentEmails.size > 0 || selectedTutorEmails.size > 0) && (
        <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'left' }}>
          Total seleccionado: {selectedStudentEmails.size} estudiante(s) y {selectedTutorEmails.size} tutor(es).
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, position: 'relative', width: '100%' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/teacher')}
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
          onClick={handleComposeMessage}
          disabled={selectedStudentEmails.size === 0 && selectedTutorEmails.size === 0}
        >
          Componer mensaje
        </Button>
      </Box>
    </Paper>
  );
}

export default TeacherMails;
