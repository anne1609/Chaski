
import React, { useState } from 'react';
import EmailForm from '../shared/EmailForm';
import CommunicationsStatus from '../shared/CommunicationsStatus';
import { Button, Box } from '@mui/material';

function Secretary() {
  const [showForm, setShowForm] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleToggleStatus = () => {
    setShowStatus((prev) => !prev);
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <h1>Hola, soy la secretaria</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={handleToggleForm}
        sx={{ mt: 2, ml: 2 }}
      >
        {showForm ? 'Ocultar Formulario' : 'Enviar Correo'}
      </Button>
      {showForm && <EmailForm role="secretary" />}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleToggleStatus}
        sx={{ mt: 2, ml: 2 }}
      >
        {showStatus ? 'Ocultar Estado' : 'Mostrar Estado'}
      </Button>
      {showStatus && <CommunicationsStatus />}
    </Box>
  );
}

export default Secretary;