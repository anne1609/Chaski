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

const SUBJECTS_API_URL = 'http://localhost:8080/api/subjects';
const TEACHERS_BY_SUBJECT_API_URL_BASE = 'http://localhost:8080/api/subject';

function SubjectMails() {
    const [allSubjects, setAllSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [subjectDetails, setSubjectDetails] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTeacherEmails, setSelectedTeacherEmails] = useState(new Set());

    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [errorSubjects, setErrorSubjects] = useState(null);
    const [loadingTeachers, setLoadingTeachers] = useState(false);
    const [errorTeachers, setErrorTeachers] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchSubjects = async () => {
            setLoadingSubjects(true);
            setErrorSubjects(null);
            try {
                const response = await fetch(SUBJECTS_API_URL);
                if (!response.ok) {
                    throw new Error(`Error de red al cargar materias: ${response.status}`);
                }
                const data = await response.json();
                setAllSubjects(data || []);
            } catch (e) {
                setErrorSubjects(e.message || 'Error al cargar las materias.');
                console.error("Failed to fetch subjects:", e);
            } finally {
                setLoadingSubjects(false);
            }
        };
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (!selectedSubjectId) {
            setTeachers([]);
            setSubjectDetails(null);
            setSelectedTeacherEmails(new Set());
            return;
        }

        const fetchTeachersForSubject = async () => {
            setLoadingTeachers(true);
            setErrorTeachers(null);
            setSearchTerm('');
            setSelectedTeacherEmails(new Set());

            try {
                const response = await fetch(`${TEACHERS_BY_SUBJECT_API_URL_BASE}/${selectedSubjectId}/teachers/emails`);
                if (!response.ok) {
                    throw new Error(`Error de red al cargar profesores: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                setTeachers(data.teachers || []);
                setSubjectDetails(data.subject || null);
            } catch (e) {
                setErrorTeachers(e.message || 'Error al cargar los profesores de la materia.');
                console.error("Failed to fetch teachers for subject:", e);
                setTeachers([]);
                setSubjectDetails(null);
            } finally {
                setLoadingTeachers(false);
            }
        };
        fetchTeachersForSubject();
    }, [selectedSubjectId]);

    const handleSubjectChange = (event) => {
        setSelectedSubjectId(event.target.value);
    };

    const filteredTeachers = useMemo(() => {
        if (!searchTerm.trim()) {
            return teachers;
        }
        return teachers.filter(teacher =>
            teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [teachers, searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleToggleSelectTeacher = useCallback((teacherEmail) => {
        setSelectedTeacherEmails(prevSelectedEmails => {
            const newSelectedEmails = new Set(prevSelectedEmails);
            if (newSelectedEmails.has(teacherEmail)) {
                newSelectedEmails.delete(teacherEmail);
            } else {
                newSelectedEmails.add(teacherEmail);
            }
            return newSelectedEmails;
        });
    }, []);

    useEffect(() => {
        console.log("Profesores seleccionados:", selectedTeacherEmails);
    }, [selectedTeacherEmails]);

    const handleSelectAllChange = useCallback((event) => {
        const isChecked = event.target.checked;
        setSelectedTeacherEmails(prevSelectedEmails => {
            const newSelectedEmails = new Set(prevSelectedEmails);
            if (isChecked) {
                filteredTeachers.forEach(teacher => newSelectedEmails.add(teacher.email));
            } else {
                filteredTeachers.forEach(teacher => newSelectedEmails.delete(teacher.email));
            }
            return newSelectedEmails;
        });
    }, [filteredTeachers]);

    const numSelectedInFiltered = useMemo(() => {
        return filteredTeachers.filter(teacher => selectedTeacherEmails.has(teacher.email)).length;
    }, [filteredTeachers, selectedTeacherEmails]);

    const allFilteredSelected = filteredTeachers.length > 0 && numSelectedInFiltered === filteredTeachers.length;
    const someFilteredSelected = filteredTeachers.length > 0 && numSelectedInFiltered > 0 && numSelectedInFiltered < filteredTeachers.length;

    if (loadingSubjects) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Cargando materias...</Typography>
            </Box>
        );
    }

    if (errorSubjects) {
        return <Typography color="error" sx={{ p: 2 }}>Error al cargar materias: {errorSubjects}</Typography>;
    }

    return (
        <Paper elevation={1} sx={{ p: theme.spacing(1.5), display: 'flex', flexDirection: 'column', gap: theme.spacing(1.5) }}>
            <Typography variant="subtitle1" gutterBottom>
                Enviar Correos por Materia
            </Typography>

            <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="subject-select-label">Seleccionar Materia</InputLabel>
                <Select
                    labelId="subject-select-label"
                    id="subject-select"
                    value={selectedSubjectId}
                    onChange={handleSubjectChange}
                    label="Seleccionar Materia"
                >
                    <MenuItem value="">
                        <em>Ninguna</em>
                    </MenuItem>
                    {allSubjects.map((subject) => (
                        <MenuItem key={subject.id} value={subject.id}>
                            {subject.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {selectedSubjectId && subjectDetails && (
                <Box sx={{ mt: 0.5, mb: 0.5, p: theme.spacing(1), border: '1px solid #eee', borderRadius: 1, background: '#f9f9f9' }}>
                    <Typography variant="body2" gutterBottom>
                        Materia: {subjectDetails.name}
                    </Typography>
                    {subjectDetails.description && (
                        <Typography variant="caption" color="textSetcondary">
                            Descripción: {subjectDetails.description}
                        </Typography>
                    )}
                </Box>
            )}

            {selectedSubjectId && loadingTeachers && (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80px">
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 1.5 }}>Cargando profesores de {subjectDetails?.name || 'esta materia'}...</Typography>
                </Box>
            )}

            {selectedSubjectId && !loadingTeachers && errorTeachers && (
                <Typography color="error" sx={{ p: 1.5 }}>
                    Error al cargar Profesores para {subjectDetails?.name || 'la materia seleccionada'}: {errorTeachers}
                </Typography>
            )}

            {selectedSubjectId && !loadingTeachers && !errorTeachers && (
                <>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: subjectDetails ? 0 : 0.5 }}>
                        Profesores de: {subjectDetails?.name || "Materia Seleccionada"}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Buscar profesor por nombre o email"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        disabled={teachers.length === 0}
                    />
                    {teachers.length > 0 && (
                        <FormControlLabel
                            sx={{ mb: -1 }}
                            control={
                                <Checkbox
                                    size="small"
                                    checked={allFilteredSelected}
                                    indeterminate={someFilteredSelected}
                                    onChange={handleSelectAllChange}
                                    disabled={filteredTeachers.length === 0}
                                />
                            }
                            label={filteredTeachers.length > 0 ? `Seleccionar ${filteredTeachers.length} profesor(es) visible(s)` : "No hay profesores que coincidan con la búsqueda"}
                        />
                    )}
                    <Box sx={{ maxHeight: 250, overflow: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
                        <List dense disablePadding>
                            {filteredTeachers.length === 0 && !loadingTeachers && (
                                <ListItem sx={{ py: 0.5 }}>
                                    <ListItemText
                                        primaryTypographyProps={{ fontSize: '0.875rem' }}
                                        primary={teachers.length === 0 ? `No hay profesores asignados a ${subjectDetails?.name || 'esta materia'}.` : "No se encontraron profesores que coincidan con la búsqueda."}
                                    />
                                </ListItem>
                            )}
                            {filteredTeachers.map((teacher) => (
                                <ListItem
                                    key={teacher.email}
                                    button
                                    onClick={() => handleToggleSelectTeacher(teacher.email)}
                                    sx={{ py: 0.25 }}
                                >
                                    <Checkbox
                                        edge="start"
                                        checked={selectedTeacherEmails.has(teacher.email)}
                                        tabIndex={-1}
                                        disableRipple
                                        size="small"
                                    />
                                    <ListItemText
                                        primaryTypographyProps={{ fontSize: '0.875rem' }}
                                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                                        primary={teacher.name}
                                        secondary={`Email: ${teacher.email}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    {selectedTeacherEmails.size > 0 && (
                        <Typography variant="caption" sx={{ mt: 0.5 }}>
                            Total seleccionado: {selectedTeacherEmails.size} profesor(es).
                        </Typography>
                    )}
                </>
            )}
        </Paper>
    );
}

export default SubjectMails;