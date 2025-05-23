import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { sendEmail } from '../../utils/sendEmail'; // Importa la función para enviar correos


function EmailForm({ role }) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = async (event) => {
    const teacher_id = 1;
    const communication_id = 2;
    const confirmUrl = `http://localhost:8080/api/confirm-attendance?communication_id=${communication_id}&teacher_id=${teacher_id}&confirmed=1`;
    const rejectUrl = `http://localhost:8080/api/confirm-attendance?communication_id=${communication_id}&teacher_id=${teacher_id}&confirmed=0`;
    const html = `
      <p>¿Confirma su asistencia?</p>
      <a href="${confirmUrl}" style="padding:10px 20px;background:#4caf50;color:white;text-decoration:none;border-radius:5px;">Sí, confirmo asistencia</a>
      <a href="${rejectUrl}" style="padding:10px 20px;background:#f44336;color:white;text-decoration:none;border-radius:5px;margin-left:10px;">No, no podré asistir</a>
      <p>${message}</p>
      `;
    event.preventDefault();
    try {
      await sendEmail(email, subject, message, html); // Llama a la función para enviar el correo
      alert('Correo enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      alert('Error al enviar el correo');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        mt: 5,
      }}
    >
      {role === 'teacher' && (
        <TextField
          label="Curso"
          placeholder="Ejemplo: Matemáticas"
          required
        />
      )}
      <TextField
        label="Correo Electrónico"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Asunto"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <TextField
        label="Mensaje"
        multiline
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        {role === 'secretary' ? 'Siguiente' : 'Siguiente'}
      </Button>
    </Box>
  );
}

export default EmailForm;