import React from 'react';
import { useLocation } from 'react-router-dom';

const ConfirmationPage = () => {
  const location = useLocation();

  // Capturar los parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  const communicationId = queryParams.get('communication_id');
  const teacherId = queryParams.get('teacher_id');
  const confirmed = queryParams.get('confirmed');

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎉 ¡Felicidades!</h1>
      <p>Has confirmado tu asistencia exitosamente.</p>
      <p><strong>Detalles:</strong></p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li><strong>Comunicación ID:</strong> {communicationId}</li>
        <li><strong>Profesor ID:</strong> {teacherId}</li>
        <li><strong>Confirmado:</strong> {confirmed === '1' ? 'Sí' : 'No'}</li>
      </ul>
    </div>
  );
};

export default ConfirmationPage;