import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TutorConfirmationPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const communicationId = queryParams.get('communication_id');
  const sendTo = queryParams.get('send_to'); // 'tutor' o 'student'
  const confirmed = queryParams.get('confirmed'); // '1' para sí, '0' para no

  useEffect(() => {
    if (communicationId && sendTo && confirmed) {
      fetch(`http://localhost:8080/api/confirm-attendance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communication_id: communicationId,
          send_to: sendTo,
          attendance_status: confirmed === '1' ? 'confirmado' : 'rechazado',
        }),
      });
    }
  }, [communicationId, sendTo, confirmed]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {confirmed === '1' ? (
        <>
          <h1>🎉 ¡Asistencia confirmada!</h1>
          <p>Gracias por confirmar tu asistencia.</p>
        </>
      ) : (
        <>
          <h1>😔 ¡Asistencia rechazada!</h1>
          <p>Has indicado que no podrás asistir.</p>
        </>
      )}
    </div>
  );
};

export default TutorConfirmationPage;