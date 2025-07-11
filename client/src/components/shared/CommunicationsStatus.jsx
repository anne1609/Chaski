import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Tab } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import AttendanceStatusDialog from './AttendanceStatusDialog';
import { Snackbar, Alert } from '@mui/material';
function CommunicationsStatus({ role }) {
  const { user } = useAuth();
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendanceDialog, setAttendanceDialog] = useState({ open: false, status: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedCommId, setSelectedCommId] = useState(null);
  const fetchAttendance = async (communicationId) => {
  try {
    const [studentsRes, tutorsRes] = await Promise.all([
      fetch(`http://localhost:8080/api/students-communications/${communicationId}`),
      fetch(`http://localhost:8080/api/tutors-communications/${communicationId}`)
    ]);
    const students = studentsRes.ok ? await studentsRes.json() : [];
    const tutors = tutorsRes.ok ? await tutorsRes.json() : [];
    setAttendanceData([...students, ...tutors]);
    setSelectedCommId(communicationId);
  } catch (err) {
    setAttendanceData([]);
    setSelectedCommId(communicationId);
  }
};
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
          setSuccessMessage('Mensaje reenviado con éxito');
          setTimeout(() => setSuccessMessage(''), 3000);
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
      <Snackbar
    open={!!successMessage}
    autoHideDuration={3000}
    onClose={() => setSuccessMessage('')}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert onClose={() => setSuccessMessage('')} severity="info" sx={{ width: '100%' }}>
      {successMessage}
    </Alert>
  </Snackbar>
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
      <React.Fragment key={communication.id}>
        <TableRow>
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
            {/* ...todos tus botones aquí... */}
            {communication.status !== 'Enviado' && communication.status !== 'Archivado' && (
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to={`/edit-message/${communication.id}`}
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
            {role === 'teacher' && communication.category.name === 'citacion' ? (
              <Button
                variant="contained"
                color="info"
                component={Link}
                to={`/attendance/${communication.id}`}
                sx={{ mr: 1 }}
                
              >
                Ver asistencia
              </Button>
            ) : null}
            {role !== 'teacher' ? (
              <Button
                variant="contained"
                color="info"
                component={Link}
                to={`/secretary/attendance/${communication.id}`}
                sx={{ mr: 1 }}
              >
                Ver asistencia
              </Button>
            ) : null}
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
        {role === 'teacher' && selectedCommId === communication.id && attendanceData.length > 0 && (
          <TableRow>
            <TableCell colSpan={6}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceData.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        {item.student?.names || item.tutor?.names || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {item.student_id ? 'Estudiante' : 'Tutor'}
                      </TableCell>
                      <TableCell>
                        {item.attendance_status || 'Pendiente'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    ))}
</TableBody>
          </Table>
        </TableContainer>
      )}
      <AttendanceStatusDialog
        open={attendanceDialog.open}
        status={attendanceDialog.status}
        onClose={() => setAttendanceDialog({ open: false, status: '' })}
      />
    </Box>
  );
}

export default CommunicationsStatus;