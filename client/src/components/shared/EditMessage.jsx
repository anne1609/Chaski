import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  useTheme,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
//import CloseIcon from '@mui/icons-material/Close';
// import { useTheme } from '@mui/material/styles'; // Not strictly needed for now

// Style for Modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600, // Keep width or adjust as needed
  bgcolor: 'background.paper',
  border: '1px solid #ccc',
  borderRadius: '12px', // Slightly more rounded
  boxShadow: 24,
  p: 4,
};

function EditMessage() {
  // const theme = useTheme(); // Not strictly needed for now
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  
    const { selectedEmails = [], selectedIds = [] , remitentType='teacher',selectedIdsTutors=[],selectedIdsStudents=[],selectedEmailsTutors=[],selectedEmailsStudents=[] } = location.state || {};
    const { id } = useParams(); 

  const [openModal, setOpenModal] = useState(false);
  const [messageType, setMessageType] = useState(''); // Default to empty string
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [confirmAttendance, setConfirmAttendance] = useState(false);
  const [priority, setPriority] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [recipientType, setRecipientType] = useState(''); 


    useEffect(() => {
      if (!id) return;
    
      const loadData = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/communication/${id}`);
          const data = await response.json();
          
          setMessageType(data.category_id === 1 ? 'citacion' : data.category_id === 2 ? 'aviso' : 'mensaje');
          setSubject(data.subject || '');
          setMessageBody(data.body || '');
          setPriority(data.priority || '');
          setSelectedDate(data.meeting_datetime ? data.meeting_datetime.split('T')[0] : '');
          setSelectedTime(data.meeting_datetime ? data.meeting_datetime.split('T')[1]?.slice(0,5) : '');
          setConfirmAttendance(data.attendance_status === 'Pendiente');
          
          // Cargar destinatarios DESPUÉS de obtener los datos de la comunicación
          await fetchRecipients(id, data.category_id);
          
        } catch (error) {
          console.error('Error al cargar datos:', error);
        }
      };
      
      loadData();
    }, [id]);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const fetchRecipients = async (communicationId, categoryId) => {
  setLoadingRecipients(true);
  
  try {
    let endpoints = [];
    let allRecipients = [];
    
    if (categoryId === 1 || categoryId === 3) { 
      endpoints = [
        { url: `http://localhost:8080/api/teachers-communicationscomunications/${communicationId}`, type: 'teachers' },
        { url: `http://localhost:8080/api/tutors-communications/${communicationId}`, type: 'tutors' },
        { url: `http://localhost:8080/api/students-communications/${communicationId}`, type: 'students' }
      ];
    } else if (categoryId === 2) { 
      endpoints = [
        { url: `http://localhost:8080/api/students-communications/${communicationId}`, type: 'students' }
      ];
    }

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        if (response.ok) {
          const data = await response.json();
          
          const recipientsWithType = data.map(recipient => ({
            ...recipient,
            recipientType: endpoint.type
          }));
          
          allRecipients = [...allRecipients, ...recipientsWithType];
        } else {
          console.log(`Endpoint ${endpoint.url} devolvió status:`, response.status);
        }
      } catch (error) {
        console.error(`Error al obtener ${endpoint.type}:`, error);
      }
    }

    console.log('✅ Todos los destinatarios obtenidos:', allRecipients);
    setRecipients(allRecipients);

  } catch (error) {
    console.error('Error al obtener destinatarios:', error);
  } finally {
    setLoadingRecipients(false);
  }
};

  // Función para validar el formulario
  const validateForm = () => {
    console.log('Validando formulario:', {
      messageType,
      selectedEmails: selectedEmails.length,
      subject: subject.trim(),
      messageBody: messageBody.trim(),
      selectedDate,
      selectedTime
    });

    // Para avisos no se requieren destinatarios
    
    if (!subject.trim()) {
      console.log('Error: Asunto vacío');
      alert('El asunto es obligatorio');
      return false;
    }
    if (!messageBody.trim()) {
      console.log('Error: Mensaje vacío');
      alert('El mensaje es obligatorio');
      return false;
    }
    if (!messageType) {
      console.log('Error: Tipo de mensaje no seleccionado');
      alert('Debe seleccionar un tipo de mensaje');
      return false;
    }
    if (messageType === 'citacion') {
      if (!selectedDate) {
        console.log('Error: Fecha vacía para citación');
        alert('La fecha es obligatoria para citaciones');
        return false;
      }
      if (!selectedTime) {
        console.log('Error: Hora vacía para citación');
        alert('La hora es obligatoria para citaciones');
        return false;
      }
    }
    console.log('Validación exitosa');
    return true;
  };

  // Función para enviar emails en segundo plano
  const sendEmailInBackground = async (formData) => {
    try {
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
    } catch (error) {
      console.error('Error al enviar correos en segundo plano:', error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
  if (!validateForm()) return;

  setIsSending(true);

  try {
    // 1. Actualizar el estado a "Enviado" en la base de datos
    const payload = {
      category_id: messageType === 'citacion' ? 1 : messageType === 'aviso' ? 2 : 3,
      secretary_id: 1,
      teacher_id: null,
      subject,
      body: messageBody,
      status: 'Enviado',
      priority: priority || 1,
      attachment: selectedFile ? selectedFile.name : null,
      meeting_datetime: messageType === 'citacion' ? `${selectedDate}T${selectedTime}` : null,
      attendance_status: messageType === 'citacion' ? (confirmAttendance ? 'Pendiente' : null) : null,
    };

    const updateResponse = await fetch(`http://localhost:8080/api/communication/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!updateResponse.ok) throw new Error('Error al actualizar el estado del mensaje');

    // 2. Obtener emails de los destinatarios actuales
    const currentEmails = recipients.map(recipient => {
      const recipientData = recipient[recipient.recipientType];
      return recipientData?.email;
    }).filter(email => email); // Filtrar emails válidos

    if (currentEmails.length === 0) {
      throw new Error('No se encontraron destinatarios para este mensaje');
    }

    // 3. Preparar y enviar los emails
    const formData = new FormData();
    formData.append('messageType', messageType);
    formData.append('subject', subject);
    formData.append('messageBody', messageBody);
    formData.append('selectedDate', selectedDate);
    formData.append('selectedTime', selectedTime);
    formData.append('confirmAttendance', confirmAttendance);
    formData.append('comunitacionsIds', JSON.stringify([id]));
    formData.append('sendTo', JSON.stringify('profesor')); // Ajustar según el tipo de destinatario
    formData.append('selectedEmails', JSON.stringify(currentEmails));

    // Enviar emails
    await sendEmailInBackground(formData);

    alert('✅ Mensaje enviado exitosamente y estado actualizado a "Enviado"');
    navigate("/secretary");

  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    alert(`❌ Error al enviar el mensaje: ${error.message}`);
  } finally {
    setIsSending(false);
  }
};

  const handleUpdate = async () => {
      if (!validateForm()) return;
      const payload = {
          category_id: messageType === 'citacion' ? 1 : messageType === 'aviso' ? 2 : 3,
          secretary_id: 1,
          teacher_id: null,
          subject,
          body: messageBody,
          status: 'Guardado',
          priority: priority || 1,
          attachment: selectedFile ? selectedFile.name : null,
          meeting_datetime: null,
          attendance_status: null,
      };

      try {
          const response = await fetch(`http://localhost:8080/api/communication/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          });
          if (!response.ok) throw new Error('Error al actualizar el mensaje');
          alert('Mensaje actualizado exitosamente');
          navigate("/secretary");
      } catch (error) {
          alert('Error al actualizar el mensaje: ' + error.message);
      }
  };

  return (
    <Paper sx={{ p: 3, m: 2, borderRadius: '8px' }}>
      {/* Header Section */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Componer Mensaje
      </Typography>

      {/* Modal for selected emails */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="selected-emails-modal-title"
        aria-describedby="selected-emails-modal-description"
      >
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
            <Typography id="selected-emails-modal-title" variant="h6" component="h2">
              Destinatarios del Mensaje
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              X
            </IconButton>
          </Box>
          <Box id="selected-emails-modal-description" sx={{ maxHeight: 350, overflowY: 'auto', pr: 1 }}>
            {loadingRecipients ? (
              <Typography sx={{ textAlign: 'center' }}>Cargando destinatarios...</Typography>
            ) : recipients.length > 0 ? (
              recipients.map((recipient, index) => {
                // Determinar qué campo usar según el tipo de destinatario
                const recipientData = recipient[recipient.recipientType];
                const recipientTypeLabel = {
                  teachers: 'Profesor',
                  students: 'Estudiante', 
                  tutors: 'Tutor'
                };
                
                return (
                  <Paper key={index} elevation={1} sx={{ mb: 1, p: 1.5, borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <Typography sx={{ fontSize: '1rem', color: '#333', fontWeight: 'bold' }}>
                      {recipientData?.names} {recipientData?.last_names}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: '#666' }}>
                      {recipientData?.email}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#2196f3', fontWeight: 'bold' }}>
                      Tipo: {recipientTypeLabel[recipient.recipientType]}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: recipient.confirmed ? '#2e7d32' : '#d32f2f' }}>
                      Estado: {recipient.confirmed ? 'Confirmado' : 'Pendiente'}
                    </Typography>
                  </Paper>
                );
              })
            ) : (
              <Typography sx={{ textAlign: 'center', color: '#555' }}>No hay destinatarios para este mensaje.</Typography>
            )}
          </Box>
        </Box>
      </Modal>

      {/* Form Section */}
      {/* Row 1: Select & File Input in a full-width independent container */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <FormControl sx={{ minWidth: 150, mr: 2 }} size="small"> {/* Adjusted minWidth, removed flex: 1 */}
          <Select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            displayEmpty
            sx={{
              backgroundColor: '#0A3359',
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
            <MenuItem value={subject} disabled>
              Selecciona un tipo
            </MenuItem>
            <MenuItem value="citacion">Citación</MenuItem>
            <MenuItem value="mensaje"> Mensaje</MenuItem>
          </Select>
        </FormControl>
        <Grid item>
  <Button 
    variant="outlined" 
    onClick={handleOpenModal}
    sx={{ 
      backgroundColor: '#0A3359', 
      color: 'white',
      '&:hover': { 
        backgroundColor: '#0A3359', 
        color: 'white' 
      }
    }}
    fullWidth
  >
    Ver Destinatarios ({recipients.length})
  </Button>
</Grid>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end' }}> {/* Added justifyContent: 'flex-end' */}
          <Button component="label" size="medium" sx={{
            paddingInline: 5,
            whiteSpace: 'nowrap',
            // Responsive border radius

            zIndex: 1, // To ensure it overlaps correctly with TextField border on md
            height: 'auto', // Allow button to size height based on content + padding
            width: { xs: '100%', md: 'auto' }, // Full width on xs, auto on md
            backgroundColor: '#0A3359',
            color: 'white',
            '&:hover': {
              backgroundColor: '#0A3359',
            },
            borderRadius: '8px', // Ensure consistent border radius
          }}>
            Adjuntar
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {selectedFile && (
            <Typography variant="caption" sx={{ ml: 1, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1, minWidth: 0 }} title={selectedFile.name}>
              {selectedFile.name}
            </Typography>
          )}
        </Box>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 2 }}>
        {/* Row for Date & Time Input - Conditional Rendering - MOVED AND MODIFIED */}
        {messageType === 'citacion' && (
          <Grid item xs={12}> {/* Ensures the conditional block takes full width */}
            <Grid container spacing={2}> {/* Inner container for Date and Time */}
              <Grid item xs={12}> {/* Changed from xs={6} sm={6} to xs={12} to make Date field full width */}
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                  <label htmlFor="time">Fecha:</label>
                  <TextField
                    type="date"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true, sx: { color: 'white' } }}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    sx={{
                      backgroundColor: '#1A6487',
                      borderRadius: '4px', // Optional: adds rounded corners
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={12}> {/* Changed from xs={6} sm={6} to xs={12} to make Time field full width and stack below Date */}
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                  <label htmlFor="time">Hora:</label>
                  <TextField
                    id="time"
                    type="time"
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true, sx: { color: 'white' } }}
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    sx={{
                      backgroundColor: '#1A6487',
                      borderRadius: '4px', // Optional: adds rounded corners
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </Grid>
        )}

      </Grid>
      {/* Row for Subject Input - NOW SECOND, in its own full-width box */}
      <Grid item xs={12} sx={{ mb: 2, display: 'flex', flexDirection: 'row', gap: 1, width: '100%', justifyContent: 'space-between' }}>
        <Box >
          <TextField
            //   label="Asunto"
            fullWidth
            placeholder='Asunto'
            size="small"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            InputProps={{
              sx: {
                // borderTopLeftRadius: { xs: theme.shape.borderRadius, md: 0 }, // Removed for consistency
                // borderBottomLeftRadius: { xs: theme.shape.borderRadius, md: 0 }, // Removed for consistency
                // borderTopRightRadius: { xs: theme.shape.borderRadius, md: 0 }, // Removed for consistency
                // borderBottomRightRadius: { xs: theme.shape.borderRadius, md: 0 }, // Removed for consistency
                borderRadius: '4px', // Apply consistent border radius
                backgroundColor: '#1A6487', // Changed from #0A3359                
                minWidth: '70vw', // Ensure full width
                color: 'white',                
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  // borderRightWidth: { xs: 1, md: 0 }, // Removed for consistency
                  // borderLeftWidth: { xs: 1, md: 1 }, // Removed for consistency
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
                '& input::placeholder': { // Style placeholder
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1, // Ensure placeholder is visible
                },
              }
            }}
            InputLabelProps={{ // This might not be needed if using placeholder
              sx: {
                color: 'rgba(255, 255, 255, 0.7)',
                '&.Mui-focused': {
                  color: 'white',
                }
              }
            }}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            placeholder='Prioridad'
            size="small"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            InputProps={{
              sx: {
                borderRadius: '4px',
                backgroundColor: '#1A6487',                
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
                '& input::placeholder': { // Style placeholder
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1, // Ensure placeholder is visible
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
      </Grid>
      {/* Row 4 (now 5): Message Textarea */}
      <Grid item xs={12}>
        <TextField
          //label="Mensaje"
          multiline
          rows={6}
          fullWidth
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          placeholder="Escriba su mensaje aquí..."
          InputLabelProps={{
            sx: {
              color: 'rgba(255, 255, 255, 0.7)', // Label color
              '&.Mui-focused': {
                color: 'white', // Label color when focused
              },
            },
          }}
          sx={{
            backgroundColor: '#1A6487',
            borderRadius: '4px',
            '& .MuiInputBase-input': {
              color: 'white', // Text color
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.5)', // Border color
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Border color on hover
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white', // Border color when focused
            },
            '& .MuiInputBase-input::placeholder': { // Style placeholder
              color: 'rgba(255, 255, 255, 0.7)',
              opacity: 1, // Ensure placeholder is visible
            },
          }}
        />
      </Grid>

      {/* Row 5: Confirm Attendance Checkbox */}
      {messageType === 'citacion' && (
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={confirmAttendance} onChange={(e) => setConfirmAttendance(e.target.checked)} />}
            label="Confirmar asistencia"
          />
        </Grid>
      )}

      {/* Row 6: Action Buttons - Restructured for vertical stacking and full width */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Grid container spacing={1} direction="row" alignItems="stretch">
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleUpdate} sx={{
              backgroundColor: '#0A3359',
              color: 'white',
              '&:hover': { backgroundColor: '#0A3359' }
            }}
              fullWidth >
              Guardar
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={isSending}
              sx={{
                backgroundColor: messageType === 'aviso' ? '#FF6B35' : '#2C965A',
                color: 'white',
                '&:hover': { 
                  backgroundColor: messageType === 'aviso' ? '#E55A2B' : '#278552' 
                },
                '&:disabled': {
                  backgroundColor: '#ccc',
                  color: '#666'
                }
              }}
              fullWidth
            >
              {isSending 
                ? 'Enviando...' 
                : messageType === 'aviso' 
                  ? 'Imprimir' 
                  : 'Enviar'
              }
            </Button>
          </Grid>
          <Grid item>
            <Button color="inherit" onClick={handleCancel} fullWidth sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}>
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default EditMessage;