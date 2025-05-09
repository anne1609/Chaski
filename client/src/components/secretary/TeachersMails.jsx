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
  useTheme
} from '@mui/material';

const API_URL = 'http://localhost:8080/api/teachers/emails';

function TeachersMails() {
  const [allTeachers, setAllTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmails, setSelectedEmails] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Error de red: ${response.status}`);
        }
        const data = await response.json();
        setAllTeachers(data.teachers || []);
      } catch (e) {
        setError(e.message || 'Error al cargar los datos de profesores.');
        console.error("Failed to fetch teachers:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    if (!searchTerm.trim()) {
      return allTeachers;
    }
    return allTeachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [allTeachers, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
    return filteredTeachers.filter(teacher => selectedEmails.has(teacher.email)).length;
  }, [filteredTeachers, selectedEmails]);

  const allFilteredSelected = filteredTeachers.length > 0 && numSelectedInFiltered === filteredTeachers.length;
  const someFilteredSelected = filteredTeachers.length > 0 && numSelectedInFiltered > 0 && numSelectedInFiltered < filteredTeachers.length;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{ p: 2 }}>Error al cargar profesores: {error}</Typography>;
  }

  return (
    <Paper elevation={1} sx={{ p: theme.spacing(1.5), display: 'flex', flexDirection: 'column', gap: theme.spacing(1.5) }}>
      <Typography variant="subtitle1" gutterBottom>
        Seleccionar Profesores
      </Typography>
      <TextField
        fullWidth
        label="Buscar profesor"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {allTeachers.length > 0 && (
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
          label={filteredTeachers.length > 0 ? `Seleccionar ${filteredTeachers.length} visible(s)` : "No hay profesores que coincidan"}
        />
      )}
      <Box sx={{ maxHeight: 250, overflow: 'auto', border: '1px solid #ddd', borderRadius: 1 }}>
        <List dense disablePadding>
          {filteredTeachers.length === 0 && !loading && (
            <ListItem sx={{ py: 0.5 }}>
              <ListItemText primaryTypographyProps={{ fontSize: '0.875rem' }} primary={allTeachers.length === 0 ? "No hay profesores para mostrar." : "No se encontraron profesores que coincidan con la búsqueda."} />
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
                checked={selectedEmails.has(teacher.email)}
                tabIndex={-1}
                disableRipple
                size="small"
              />
              <ListItemText
                primaryTypographyProps={{ fontSize: '0.875rem' }}
                secondaryTypographyProps={{ fontSize: '0.75rem' }}
                primary={teacher.name}
                secondary={teacher.email}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {selectedEmails.size > 0 && (
        <Typography variant="caption" sx={{ mt: 0.5 }}>
          Total seleccionado: {selectedEmails.size} profesor(es).
        </Typography>
      )}
    </Paper>
  );
}

export default TeachersMails;