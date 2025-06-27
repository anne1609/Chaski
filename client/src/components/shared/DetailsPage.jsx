import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Box } from '@mui/material';

const DetailsPage = () => {
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
    <Box sx={{ maxWidth: 850, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3, border: 'none', boxShadow: 'none', background: 'transparent' }} elevation={0}>
        <Typography variant="h5"  sx={{ mb: 3}}>
          Detalles del correo
        </Typography>
        <Box sx={{ mb: 2 }}>
          <b>De:</b> {communication.secretaries?.email || 'N/A'}
        </Box>
        <Box sx={{ mb: 2 }}>
          <b>Para:</b> {communication.teachers
            ? `${communication.teachers.names} ${communication.teachers.last_names} (${communication.teachers.email})`
            : 'N/A'}
        </Box>
        <Box sx={{ mb: 2 }}>
        <b>Fecha:</b>{' '}
        {communication.meeting_datetime
            ? new Date(communication.meeting_datetime).toLocaleDateString()
            : 'N/A'}
        <span style={{ marginLeft: 24 }}>
            <b>Hora:</b>{' '}
            {communication.meeting_datetime
            ? new Date(communication.meeting_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'N/A'}
        </span>
        </Box>
        <Box sx={{ mb: 2, background: '#1A6487', color: '#fff', borderRadius: 2, p: 2 }}>
          <b>Asunto:</b> {communication.subject}
        </Box>
        <Box
          sx={{
            mb: 2,
            background: '#1A6487',
            color: '#fff',
            borderRadius: 2,
            p: 2,
            minHeight: 180,
            display: 'flex',
            alignItems: 'flex-start',
            whiteSpace: 'pre-line',
          }}
        >
          <b style={{ marginRight: 8 }}>Mensaje:</b>
          <span>{communication.body}</span>
        </Box>
        <Box sx={{ mb: 2 }}>
          <b>Archivo adjunto:</b> {communication.attachment
            ? <a href={communication.attachment} target="_blank" rel="noopener noreferrer" style={{ color: '#1A6487', textDecoration: 'underline' }}>Ver archivo</a>
            : 'Ninguno'}
        </Box>
      </Paper>
    </Box>
  );
};

export default DetailsPage;