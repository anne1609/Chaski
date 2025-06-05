import React, { useEffect }  from 'react';
import { useLocation } from 'react-router-dom';

const ConfirmationPage = () => {
  const location = useLocation();

  // Capturar los parámetros de la URL
  const queryParams = new URLSearchParams(location.search);
  const communicationId = queryParams.get('communication_id');
  const teacherId = queryParams.get('teacher_id');
  const confirmed = queryParams.get('confirmed');

   useEffect(() => {
    if (communicationId && confirmed) {
      fetch(`http://localhost:8080/api/communication/${communicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance_status: confirmed === '1' ? 'Confirmado' : 'No asistirá',
        }),
      });
    }
  }, [communicationId, confirmed]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎉 ¡Felicidades!</h1>
      <p>Has confirmado tu asistencia exitosamente.</p>
      
    </div>
  );
};

export default ConfirmationPage;