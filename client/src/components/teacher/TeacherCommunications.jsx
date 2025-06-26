import React from 'react';
import CommunicationsStatus from '../shared/CommunicationsStatus';
import { Box } from '@mui/material';

function TeacherCommunications() {
  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <h1>Mis Mensajes y Citaciones</h1>
      <CommunicationsStatus role="teacher" />
    </Box>
  );
}

export default TeacherCommunications;
