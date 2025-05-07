export async function sendEmail(to, subject, message) {
    try {
      const response = await fetch('http://localhost:8080/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, subject, message }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el correo');
      }
      return data;
    } catch (error) {
      console.error('Error en sendEmail:', error);
      throw error;
    }
  }