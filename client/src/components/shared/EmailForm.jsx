import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function EmailForm({ role }) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      email,
      subject,
      message,
      role,
    });
    // Aquí podrías integrar el backend en el futuro
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
        {role === 'secretary' ? 'Enviar a todo el colegio' : 'Enviar a mi curso'}
      </Button>
    </Box>
  );
}

export default EmailForm;