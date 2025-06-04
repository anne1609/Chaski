import React,{ useEffect }  from 'react';
import { useLocation } from 'react-router-dom';
  
const RejectionPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const communicationId = queryParams.get('communication_id');
  const teacherId = queryParams.get('teacher_id');
  
  useEffect(() => {
    if (communicationId) {
      fetch(`http://localhost:8080/api/communication/${communicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance_status: 'Rechazado',
        }),
      });
    }
  }, [communicationId]);
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>😔 ¡Qué pena!</h1>
      <p>Has indicado que no podrás asistir.</p>
    </div>
  );
};

export default RejectionPage;