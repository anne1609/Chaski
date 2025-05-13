import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { sendEmail } from '../../utils/sendEmail'; // Importa la función para enviar correos

function EmailForm({ role }) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await sendEmail(email, subject, message); // Llama a la función para enviar el correo
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