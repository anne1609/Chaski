
import React, { useState } from 'react';
import EmailForm from '../shared/EmailForm';
import { Button, Box } from '@mui/material';

function Secretary() {
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <h1>Hola, soy la secretaria</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={handleToggleForm}
      >
        {showForm ? 'Ocultar Formulario' : 'Enviar Correo'}
      </Button>
      {showForm && <EmailForm role="secretary" />}
    </Box>
  );
}

export default Secretary;