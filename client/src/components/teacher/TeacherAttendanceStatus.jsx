import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const TeacherAttendanceStatus = () => {
  const { communicationId } = useParams();
  const [communication, setCommunication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/communication/${communicationId}`)
      .then(res => res.json())
      .then(data => {
        setCommunication(data);
        setLoading(false);
      });
  }, [communicationId]);

  if (loading) return <div>Cargando...</div>;
  if (!communication) return <div>No se encontró la comunicación.</div>;

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Asistencia del Profesor
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del Profesor</TableCell>
              <TableCell>Estado de Asistencia</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                {communication.teachers
                  ? `${communication.teachers.names} ${communication.teachers.last_names}`
                  : 'Sin profesor asignado'}
              </TableCell>
              <TableCell>
                {communication.attendance_status || 'Sin estado'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TeacherAttendanceStatus;