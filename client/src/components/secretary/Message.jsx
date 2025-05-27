import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

function Message() {
  // const theme = useTheme(); // Not strictly needed for now
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const { selectedEmails = [], recipientType = 'Desconocido' } = location.state || {};

  const [openModal, setOpenModal] = useState(false);
  const [messageType, setMessageType] = useState(''); // Default to empty string
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [confirmAttendance, setConfirmAttendance] = useState(false);
  const [priority, setPriority] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

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

  const handleSend = () => {
    console.log('Enviar mensaje:', { recipientType, selectedEmails, messageType, subject, messageBody, confirmAttendance, priority, selectedFile, selectedDate, selectedTime });
  };
  
  const handleSave = async () => {
    console.log('Guardar mensaje:', { recipientType, selectedEmails, messageType, subject, messageBody, confirmAttendance,  priority, selectedFile, selectedDate, selectedTime });
    const hasStudents = recipientType.toLowerCase().includes('Estudiantes');
    const hasTutors = recipientType.toLowerCase().includes('Tutores');
    const hasTeachers = recipientType.toLowerCase().includes('Profesores');
    const payload = {
    category_id: messageType === 'citacion' ? 1 : messageType === 'aviso' ? 2 : 3,
    secretary_id: 1,
    teacher_id: null,
    subject,
    body: messageBody,
    status: 'Guardado',
    priority: priority || 1,
    };

    try {
      let url = 'http://localhost:8080/api/communication';
      let bodyToSend = payload;

      if (hasStudents) {
        url = 'http://localhost:8080/api/students-communications';
        bodyToSend = {
          ...payload,
          students: selectedEmails,
        };
      } else if (hasTutors) {
        url = 'http://localhost:8080/api/tutors-communications';
        bodyToSend = {
          ...payload,
          tutors: selectedEmails,
        };
      } else if (hasTeachers) {
        url = 'http://localhost:8080/api/teachers-communications';
        bodyToSend = {
          ...payload,
          teachers: selectedEmails,
        };
      }
      const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyToSend),
      });

      if (!response.ok) throw new Error('Error al guardar el mensaje');
      alert('Mensaje guardado correctamente');
      navigate(-1);
    } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    alert('Error al guardar el mensaje: ' + error.message);
    }
  }

  return (
    <Paper sx={{ p: 3, m: 2, borderRadius: '8px' }}>
      {/* Header Section */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Componer Mensaje
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3, borderRadius: '8px', border: '1px solid #eee' }} elevation={0}>
        <Table size="small" aria-label="message details table">
          <TableHead>
            <TableRow sx={{ '& th': { backgroundColor: '#228C3E', color: 'white', borderBottom: 'none' } }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Detalles</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Destinatarios</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Lista</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nro de Destinatarios</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{

              backgroundColor: '#1A6487', // Base row color
              borderBottom: 'none',
              '& .MuiTableCell-root': {
                color: 'white',
                borderBottom: 'none',
                padding: '6px 16px',
              },


            }}>
              <TableCell component="th" scope="row">
                {/* Can be used for a message title or ID later */}
              </TableCell>
              <TableCell>{recipientType}</TableCell>
              <TableCell>
                <Button size="small" onClick={handleOpenModal} disabled={selectedEmails.length === 0} sx={{
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
                  Ver lista
                </Button>
              </TableCell>
              <TableCell>{selectedEmails.length}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

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
              Lista de Destinatarios Seleccionados
            </Typography>
            <IconButton onClick={handleCloseModal} size="small">
              X
            </IconButton>
          </Box>
          <Box id="selected-emails-modal-description" sx={{ maxHeight: 350, overflowY: 'auto', pr: 1 /* Add padding to right for scrollbar */ }}>
            {selectedEmails.length > 0 ? (
              selectedEmails.map((email, index) => (
                <Paper key={index} elevation={1} sx={{ mb: 1, p: 1.5, borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                  <Typography sx={{ fontSize: '1rem', color: '#333' }}>{email}</Typography>
                </Paper>
              ))
            ) : (
              <Typography sx={{ textAlign: 'center', color: '#555' }}>No hay destinatarios seleccionados.</Typography>
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
            <MenuItem value="" disabled>
              Selecciona un tipo
            </MenuItem>
            <MenuItem value="citacion">Citación</MenuItem>
            <MenuItem value="aviso">Aviso</MenuItem>
            <MenuItem value="mensaje">Mensaje</MenuItem>
          </Select>
        </FormControl>
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
      {messageType !== 'aviso' && (
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
            <Button variant="contained" color="primary" onClick={handleSave} sx={{
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
              onClick={handleSend}
              sx={{
                backgroundColor: '#2C965A',
                color: 'white',
                '&:hover': { backgroundColor: '#278552' }
              }}
              fullWidth
            >
              Enviar
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

export default Message;
