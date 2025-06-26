import React, { useState, useEffect } from 'react';
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

  const { selectedEmails = [], selectedIds = [], recipientType = 'Desconocido' , remitentType='teacher',selectedIdsTutors=[],selectedIdsStudents=[],selectedEmailsTutors=[],selectedEmailsStudents=[] } = location.state || {};


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

  // Efecto para establecer el tipo de mensaje por defecto basado en destinatarios o ruta
  useEffect(() => {
    // Si se accede desde la ruta /teacher/notice, establecer automáticamente como "aviso"
    if (location.pathname === '/teacher/notice') {
      setMessageType('aviso');
    } else if (selectedEmails.length === 0) {
      // Si no hay destinatarios, establecer como "aviso" por defecto
      setMessageType('aviso');
    } else {
      // Si hay destinatarios, establecer como "mensaje" por defecto
      setMessageType('mensaje');
    }
  }, [selectedEmails.length, location.pathname]); // Se ejecuta cuando cambia el número de destinatarios o la ruta

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
    if (messageType !== 'aviso' && selectedEmails.length === 0) {
      console.log('Error: No hay destinatarios para mensaje/citación');
      alert('Debe seleccionar al menos un destinatario para enviar mensajes y citaciones');
      return false;
    }
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

  // Función para preparar los datos del formulario
  const prepareFormData = async () => {
    const formData = new FormData();

    // Agregar cada campo individualmente para mejor compatibilidad
    formData.append('selectedEmails', JSON.stringify(selectedEmails));
    formData.append('selectedIds', JSON.stringify(selectedIds));
    formData.append('messageType', messageType);
    formData.append('subject', subject);
    formData.append('messageBody', messageBody);
    formData.append('selectedDate', selectedDate);
    formData.append('selectedTime', selectedTime);
    formData.append('confirmAttendance', confirmAttendance);

    // Agregar attachment si existe
    if (selectedFile) {
      formData.append('attachment', selectedFile);
      try {
        const response = await fetch('http://localhost:8080/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          formData.append('attachmentUrl', data.url);
          setAttachmentUrl(data.url);
          console.log('attachment subido:', data.url);
        } else {
          throw new Error('Error al subir el archivo');
        }
      } catch (error) {
        console.error('Error al subir el attachment:', error);
      }
    }
    return formData;
  };

  // Función para generar e imprimir PDF (para avisos)
  const handlePrint = () => {
    if (!validateForm()) return;

    // Verificar si el archivo adjunto es una imagen
    const isImage = selectedFile && selectedFile.type.startsWith('image/');
    let imageContent = '';

    if (isImage) {
      // Crear URL temporal para la imagen
      const imageURL = URL.createObjectURL(selectedFile);
      imageContent = `
        <div class="image-container">
          <img src="${imageURL}" alt="Imagen adjunta" style="max-width: 100%; height: auto; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
        </div>
      `;
    }

    // Crear contenido HTML para imprimir
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Aviso - Chaski App</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #0A3359;
            color: white;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
            border-radius: 8px;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .subject-title {
            font-size: 24px;
            font-weight: bold;
            color: #0A3359;
            margin-bottom: 20px;
            text-align: center;
            border-bottom: 2px solid #0A3359;
            padding-bottom: 10px;
          }
          .message-content {
            font-size: 16px;
            line-height: 1.8;
            margin: 20px 0;
            padding: 15px;
            background-color: white;
            border-radius: 5px;
            border-left: 4px solid #0A3359;
          }
          .image-container {
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📢 AVISO</h1>
        </div>
        <div class="content">
          <div class="subject-title">${subject}</div>
          <div class="message-content">
            ${messageBody.replace(/\n/g, '<br>')}
          </div>
          ${imageContent}
        </div>
        <div class="footer">
          <p><strong>Fecha y hora de generación:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    // Crear ventana para imprimir
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Si hay imagen, esperar a que se cargue antes de imprimir
    if (isImage) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        }, 1000); // Dar tiempo para que la imagen se cargue
      };
    } else {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }

    // No mostrar alert aquí, se manejará en handleSend
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
const saveCitation = async (formData) => {
  let res = [];
  if(remitentType === 'secretary') {
    for (const item of selectedIds) {
      const payload = {
        category_id: messageType === 'citacion' ? 1 : messageType === 'aviso' ? 2 : 3,
        secretary_id: 1,
        teacher_id: item,
        subject,
        body: messageBody,
        status: 'Enviado',
        priority: priority || 1,
        meeting_datetime: messageType === 'citacion' ? `${selectedDate}T${selectedTime}` : null,
        attendance_status: messageType === 'citacion' ? (confirmAttendance ? 'Pendiente' : null) : null,
        attachment: formData.get('attachmentUrl') ?? null,
      };
      console.log("Borrame saveCitation: ln 333: ", payload);

      try {
        const response = await fetch('http://localhost:8080/api/communication', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Error al guardar el mensaje');
        const data = await response.json(); // 👈 Aquí extraes el contenido JSON
        console.log("ID de la comunicación:", data.id);
        res.push(data.id); // 👈 Aquí guardas el ID de la comunicación

      } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        alert(`❌ Error al guardar el mensaje: ${error.message}`);
      }
    }
    if(selectedIds.length > 0) {
      formData.set('comunitacionsIds', JSON.stringify(res));
      formData.set('sendTo', JSON.stringify('profesor'));
      await sendEmailInBackground(formData);
    }
  }else{
    for (const item of selectedIdsTutors) {
      const payload = {
        category_id: messageType === 'citacion' ? 1 : messageType === 'aviso' ? 2 : 3,
        secretary_id: null,
        teacher_id: 6,
        subject,
        body: messageBody,
        status: 'Enviado',
        priority: priority || 1,
        meeting_datetime: null,
        attendance_status: null,
        attachment: formData.get('attachmentUrl') ?? null,
      };
      console.log("Borrame saveCitation: ln 333: ", payload);

      try {
        const response = await fetch('http://localhost:8080/api/communication', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Error al guardar el mensaje');
        const data = await response.json(); // 👈 Aquí extraes el contenido JSON
        console.log("ID de la comunicación:", data.id);
        //res.push(data.id); // 👈 Aquí guardas el ID de la comunicación
        const tutorCommRes = await fetch('http://localhost:8080/api/tutors-communications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                tutor_id: item,
                communication_id: data.id,
                meeting_datetime: messageType === 'citacion' ? `${selectedDate}T${selectedTime}` : null,
              }),
            });
            if (!tutorCommRes.ok) throw new Error('Error al guardar la comunicación del estudiante');
            const datatutor = await tutorCommRes.json();
        console.log("ID de la comunicación del tutor:", datatutor.communication_id, datatutor);
            res.push(datatutor.communication_id);
      } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        alert(`❌ Error al guardar el mensaje: ${error.message}`);
      }
    }
    console.log("Borrame:generateEmailContent ln 7 ", res);
    if(selectedIdsTutors.length > 0) {
      formData.set('selectedEmails', JSON.stringify(selectedEmailsTutors));
      formData.set('selectedIds', JSON.stringify(selectedIdsTutors));
      formData.set('comunitacionsIds', JSON.stringify(res));
      formData.set('sendTo', JSON.stringify('tutor'));
      await sendEmailInBackground(formData);
    }
    res = [];
    for (const item of selectedIdsStudents) {
      const payload = {
        category_id: messageType === 'citacion' ? 1 : messageType === 'aviso' ? 2 : 3,
        secretary_id: null,
        teacher_id: 6,
        subject,
        body: messageBody,
        status: 'Enviado',
        priority: priority || 1,
        meeting_datetime: null,
        attendance_status: null,
        attachment: formData.get('attachmentUrl') ?? null,
      };
      console.log("Borrame saveCitation: ln 333: ", payload);

      try {
        const response = await fetch('http://localhost:8080/api/communication', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Error al guardar el mensaje');
        const data = await response.json(); // 👈 Aquí extraes el contenido JSON
        console.log("ID de la comunicación:", data.id);
        //res.push(data.id); // 👈 Aquí guardas el ID de la comunicación
        const studentCommRes = await fetch('http://localhost:8080/api/students-communications', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                student_id: item,
                communication_id: data.id,
                meeting_datetime: messageType === 'citacion' ? `${selectedDate}T${selectedTime}` : null,
              }),
            });
            if (!studentCommRes.ok) throw new Error('Error al guardar la comunicación del estudiante');
            const datastudent = await studentCommRes.json();
        console.log("ID de la comunicación del tutor:", datastudent.communication_id, datastudent);
            res.push(datastudent.communication_id);
      } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        alert(`❌ Error al guardar el mensaje: ${error.message}`);
      }
    }
    console.log("Borrame:generateEmailContent ln 7 ", res);
    if(selectedIdsStudents.length > 0) {
      formData.set('selectedEmails', JSON.stringify(selectedEmailsStudents));
      formData.set('selectedIds', JSON.stringify(selectedIdsStudents));
      formData.set('comunitacionsIds', JSON.stringify(res));
      formData.set('sendTo', JSON.stringify('estudiante'));
      await sendEmailInBackground(formData);
    }
  }
  return res;
};

  // Handler para enviar el email o imprimir según el tipo
  const handleSend = async () => {
    console.log('handleSend llamado con:', {
      messageType,
      selectedEmails: selectedEmails.length,
      subject,
      messageBody
    });

    if (!validateForm()) {
      console.log('Validación falló, deteniendo envío');
      return;
    }

    // Si es tipo aviso, imprimir en lugar de enviar
    if (messageType === 'aviso') {
      handlePrint();
      // Mostrar mensaje de éxito para aviso y redirigir
      setTimeout(() => {
        alert('✅ Documento de aviso generado correctamente');
        navigate('/secretary');
      }, 500);
      return;
    }

    // Para citación y mensaje, enviar por email
    setIsSending(true);

    try {
      const formData = await prepareFormData();

      console.log('Iniciando envío de mensaje:', {
        recipientType,
        selectedEmails,
        selectedIds,
        messageType,
        subject,
        messageBody,
        confirmAttendance,
        selectedFile: selectedFile ? selectedFile.name : null,
        selectedDate,
        selectedTime,
        attachmentUrl,
      });
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }
      let comunitacionsIds = [];
      if(messageType === 'citacion') {
        comunitacionsIds = await saveCitation(formData);
      }else{
        await sendEmailInBackground(formData);
      }
      // Enviar emails


      // Mostrar mensaje de éxito único y redirigir
      alert(`✅ Correos enviados exitosamente!\n\nDestinatarios: ${selectedEmails.length}\nTipo: ${messageType}`);

      // Limpiar el formulario
      setMessageType('');
      setSubject('');
      setMessageBody('');
      setConfirmAttendance(false);
      setSelectedFile(null);
      setSelectedDate('');
      setSelectedTime('');

      // Redirigir a /secretary después de un breve delay
      setTimeout(() => {
        navigate('/secretary');
      }, 1000);

    } catch (error) {
      console.error('Error al enviar:', error);
      alert(`❌ Error al enviar correos: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleSave = async () => {
    console.log('Guardar mensaje:', { recipientType, selectedEmails, selectedIds, messageType, subject, messageBody, confirmAttendance,  priority, selectedFile, selectedDate, selectedTime });
    const hasStudents = recipientType.toLowerCase().includes('estudiantes');
    console.log('Has students:', hasStudents);
    const hasTutors = recipientType.toLowerCase().includes('tutores');
    console.log('Has tutors:', hasTutors);
    const hasTeachers = recipientType.toLowerCase().includes('profesores');
    console.log('Has teachers:', hasTeachers);
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
      const response = await fetch('http://localhost:8080/api/communication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Error al guardar el mensaje');
      const savedMessage = await response.json();
      const communicationId = savedMessage.id;
      console.log('Mensaje guardado:', savedMessage);
      if (hasStudents && selectedIds && selectedIds.length > 0 && communicationId) {
        for (const studentId of selectedIds) {
          console.log('Guardando comunicación del estudiante:', { studentId, communicationId });
          const studentCommRes = await fetch('http://localhost:8080/api/students-communications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              student_id: studentId,
              communication_id: communicationId,
            }),
          });
          if (!studentCommRes.ok) throw new Error('Error al guardar la comunicación del estudiante');
        }
      }
      if (hasTutors && selectedIds && selectedIds.length > 0 && communicationId) {
        for (const tutorId of selectedIds) {
          console.log('Guardando comunicación del tutor:', { tutorId, communicationId });
          const tutorCommRes = await fetch('http://localhost:8080/api/tutors-communications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tutor_id: tutorId,
            communication_id: communicationId,
          }),
        });
        if (!tutorCommRes.ok) throw new Error('Error al guardar la comunicación del tutor');
        }
      }
      if (hasTeachers && selectedIds && selectedIds.length > 0 && communicationId) {
        for (const teacherId of selectedIds) {
          console.log('Guardando comunicación del profesor:', { teacherId, communicationId });
          const teacherCommRes = await fetch('http://localhost:8080/api/teachers-communications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              teacher_id: teacherId,
              communication_id: communicationId,
            }),
          });
          if (!teacherCommRes.ok) throw new Error('Error al guardar la comunicación del profesor');
        }
      }
      alert('Mensaje guardado exitosamente');
      navigate("/secretary");
    }catch (error) {
      console.error('Error al guardar el mensaje:', error);
    }
  }

  return (
    <Paper sx={{ p: 3, m: 2, borderRadius: '8px' }}>
      {/* Header Section */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Componer Mensaje
      </Typography>

      {/* Tabla de destinatarios - Solo mostrar si no es tipo aviso */}
      {messageType !== 'aviso' && (
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
                  <Button size="small" onClick={handleOpenModal} disabled={messageType !== 'aviso' && selectedEmails.length === 0} sx={{
                    paddingInline: 5,
                    whiteSpace: 'nowrap',
                    zIndex: 1,
                    height: 'auto',
                    width: { xs: '100%', md: 'auto' },
                    backgroundColor: '#0A3359',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#0A3359',
                    },
                    borderRadius: '8px',
                  }}>
                    Ver lista
                  </Button>
                </TableCell>
                <TableCell>
                  {messageType === 'aviso'
                    ? 'N/A (No requerido)'
                    : selectedEmails.length
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
            <MenuItem value="mensaje"> Mensaje</MenuItem>
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

export default Message;
