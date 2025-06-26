import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Tab } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

function CommunicationsStatus({ role }) {
  const { user } = useAuth();
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunications = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/communication');
        if (!response.ok) {
          throw new Error('Error al cargar las comunicaciones');
        }
        let data = await response.json();
        // Filtrar por profesor si el role es teacher
        if (role === 'teacher' && user) {
          data = data.filter(c => c.teacher_id === user.id);
        }
        setCommunications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunications();
  }, [role, user]);

  const handleStatusChange = async (id, newStatus, communicationItem = {}) => {
    try {
      if (newStatus === 'Enviado') {
        //const responseTeacher = await fetch(`http://localhost:8080/api/teacher/${communicationItem.teacher_id}`);
        //const teacherData = await responseTeacher.json();
        const formData = new FormData();

        // Agregar cada campo individualmente
        formData.append('selectedEmails', JSON.stringify([communicationItem.teachers.email]));
        formData.append('selectedIds', JSON.stringify([communicationItem.teachers.id]));
        formData.append('messageType', communicationItem.category.name);
        formData.append('subject', communicationItem.subject);
        formData.append('messageBody', communicationItem.body);

        // Extraer fecha y hora de meeting_datetime
        const meetingDate = new Date(communicationItem.meeting_datetime);
        formData.append('selectedDate', meetingDate.toISOString().split('T')[0]); // YYYY-MM-DD
        formData.append('selectedTime', meetingDate.toTimeString().split(' ')[0].slice(0, 5)); // HH:MM

        formData.append('confirmAttendance', communicationItem.attendance_status);
        formData.set('comunitacionsIds', JSON.stringify([id]));
        formData.set('sendTo', JSON.stringify('profesor'));

        // Agregar archivo si existe
        if (communicationItem.attachment != null) {
          formData.append('attachments', [communicationItem.attachment]);
        }
        const response = await fetch('http://localhost:8080/api/send-email-queue', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          // Solo retornar el resultado, no mostrar alert aquí
          return result;
        } else {
          throw new Error(result.error || 'Error al enviar los correos');
        }
      }
      if (newStatus === 'Archivado') {
        const confirm = window.confirm('¿Estás seguro de que deseas archivar este mensaje?');
        if (!confirm) return;
      }

      const communicationToUpdate = communications.find((communication) => communication.id === id);
      if (!communicationToUpdate) {
        alert('Comunicación no encontrada.');
        return;
      }

      const updatedCommunication = {
        ...communicationToUpdate,
        status: newStatus,
      };

      const response = await fetch(`http://localhost:8080/api/communication/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCommunication),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la comunicación.');
      }

      setCommunications((prevCommunications) =>
        prevCommunications.map((communication) =>
          communication.id === id ? { ...communication, status: newStatus } : communication
        )
      );

      alert(`El mensaje con ID ${id} ha sido marcado como "${newStatus}".`);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ mt: 3 }}>
      {communications.length === 0 ? (
        <div>No hay comunicaciones disponibles.</div>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: '64vh' }}>
          <Table>
            <TableHead
              sx={{
                backgroundColor: 'tertiary.main',
                color: '#FFFFFF',
                '& th': {
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
              }}
            >
              <TableRow>
                <TableCell>Asunto</TableCell>
                <TableCell>prioridad</TableCell>
                <TableCell>Tipo de Mensaje</TableCell>
                <TableCell>Mensaje</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                backgroundColor: 'primary.main',
                '& td': {
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: 'normal',                   
                  border: '1px solid #ccc',                                   
                },
              }}
            >
              {communications
              .filter((communication) => communication.status === 'Guardado' || communication.status === 'Enviado')
              .map((communication) => (
                <TableRow key={communication.id}>
                  <TableCell>{communication.subject}</TableCell>
                  <TableCell>{communication.priority}</TableCell>
                  <TableCell>{communication.category.name}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: '250px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >{communication.body}</TableCell>
                  <TableCell>{communication.status}</TableCell>
                  <TableCell
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >                      
                    {communication.status !== 'Enviado' && communication.status !== 'Archivado' && (  
                     <Button
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to={`/secretary/edit/${communication.id}`}
                        sx={{ mr: 1 }}                    
                      >
                        Editar
                      </Button>
                    )}   
                    {communication.status !== 'Guardado' && communication.status !== 'Archivado' && (  
                     <Button
                        variant="contained"
                        color="secondary"
                        component={Link}
                        onClick={() => handleStatusChange(communication.id, 'Enviado', communication)}
                        sx={{ mr: 1 }}                    
                      >
                        Reenviar
                      </Button>
                    )} 
                    <Button
                      variant="contained"
                      color="info"
                      component={Link}
                      to={`/secretary/attendance/${communication.id}`}
                      sx={{ mr: 1 }}
                    >
              Ver asistencia
            </Button>  
                    <Button
                      variant="contained"
                      color="tertiary"
                      component={Link}
                      to={`/secretary/communication/${communication.id}`}
                      sx={{ mr: 1 }}                    
                    >
                      Detalles
                    </Button>                 
                    <Button
                      variant="contained"
                      color="negative"
                      onClick={() => handleStatusChange(communication.id, 'Archivado')}
                      sx={{ mr: 1 }}
                    >
                      Archivar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default CommunicationsStatus;