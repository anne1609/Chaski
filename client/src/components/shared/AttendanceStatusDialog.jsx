import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const AttendanceStatusDialog = ({ open, onClose, status }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Estado de Asistencia</DialogTitle>
    <DialogContent>
      <Typography variant="body1">
        {status || 'Sin estado'}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary" variant="contained">Cerrar</Button>
    </DialogActions>
  </Dialog>
);

export default AttendanceStatusDialog;
