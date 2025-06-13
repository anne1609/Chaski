const transporter = require("../config/nodemailerConfig");
const emailQueue = require("../utils/emailQueue");

// Función para generar el contenido HTML basado en el tipo de mensaje
const generateEmailContent = (messageType, data) => {
  const { subject, messageBody, selectedDate, selectedTime, confirmAttendance, comunitacionId } = data;
  
  const baseStyle = `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .header { background-color: #0A3359; color: white; padding: 20px; text-align: center; }
      .content { padding: 20px; background-color: #f9f9f9; }
      .footer { background-color: #228C3E; color: white; padding: 15px; text-align: center; }
      .citation-info { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 15px 0; border-radius: 5px; }
      .notice-info { background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; margin: 15px 0; border-radius: 5px; }
      .important { color: #721c24; font-weight: bold; }
    </style>
  `;

  if (messageType === 'citacion') {
    const teacher_id = 1;
    const communication_id = comunitacionId;
    const confirmUrl = `http://localhost:5173/confirmation-accepted?communication_id=${communication_id}&teacher_id=${teacher_id}&confirmed=1`;
    const rejectUrl = `http://localhost:5173/confirmation-rejected?communication_id=${communication_id}&teacher_id=${teacher_id}&confirmed=0`;
    return `
      ${baseStyle}
      <div class="header">
        <h2>🏫 CITACIÓN OFICIAL - Chaski App</h2>
      </div>
      <div class="content">
        <h3>${subject}</h3>
        <div class="citation-info">
          <h4>📅 Información de la Citación:</h4>
          <p><strong>Fecha:</strong> ${selectedDate || 'No especificada'}</p>
          <p><strong>Hora:</strong> ${selectedTime || 'No especificada'}</p>
          <p class="important">Su asistencia es obligatoria.</p>
        </div>
        <div>
          <h4>Mensaje:</h4>
          <p>${messageBody.replace(/\n/g, '<br>')}</p>
        </div>
        ${confirmAttendance ? '<p><strong>⚠️ Se requiere confirmación de asistencia.</strong></p>' : ''}
        <a href="${confirmUrl}" style="padding:10px 20px;background:#4caf50;color:white;text-decoration:none;border-radius:5px;">Sí, confirmo asistencia</a>
        <a href="${rejectUrl}" style="padding:10px 20px;background:#f44336;color:white;text-decoration:none;border-radius:5px;margin-left:10px;">No, no podré asistir</a>
      </div>
      <div class="footer">
        <p>Este es un mensaje automático del sistema Chaski App</p>
        <p>Por favor, no responda a este correo electrónico</p>
      </div>
    `;
  } else if (messageType === 'aviso') {
    return `
      ${baseStyle}
      <div class="header">
        <h2>📢 AVISO IMPORTANTE - Chaski App</h2>
      </div>
      <div class="content"> 
        <h3>${subject}</h3>
        <div class="notice-info">
          <h4>📋 Información del Aviso:</h4>
          <p>Este es un aviso informativo de la institución educativa.</p>
        </div>
        <div>
          <h4>Mensaje:</h4>
          <p>${messageBody.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
      <div class="footer">
        <p>Este es un mensaje automático del sistema Chaski App</p>
        <p>Por favor, no responda a este correo electrónico</p>
      </div>
    `;
  } else {
    // Tipo mensaje genérico
    return `
      ${baseStyle}
      <div class="header">
        <h2>💌 MENSAJE - Chaski App</h2>
      </div>
      <div class="content">
        <h3> ✉️ ${subject}</h3>
        <div>
          <p>${messageBody.replace(/\n/g, '<br>')}</p>
        </div>
        ${confirmAttendance ? '<p><strong>⚠️ Se requiere confirmación de recibido.</strong></p>' : ''}
      </div>
      <div class="footer">
        <p>Este es un mensaje automático del sistema Chaski App</p>
        <p>Por favor, no responda a este correo electrónico</p>
      </div>
    `;
  }
};

// Función para procesar el envío real de emails (usada por la cola)
const processEmailSending = async (emailData) => {
  const { selectedEmails, messageType, subject, messageBody, selectedDate, selectedTime, confirmAttendance, attachments, comunitacionsIds } = emailData;
  // Generar contenido HTML
  console.log("Borrame: processEmailSending: LN: 100 ", messageType,subject,messageBody);
  const mailsOptions = [];
let mailOptions = null; // <-- define aquí

if (messageType === 'citacion') {
  for (const item of comunitacionsIds) {
    const htmlContent = generateEmailContent(messageType, {
      subject,
      messageBody,
      selectedDate,
      selectedTime,
      confirmAttendance,
      comunitacionId: item,
    });
    const mailOpt = {
      from: `"Chaski App" <${process.env.EMAIL_USER}>`,
      subject: `[${messageType.toUpperCase()}] ${subject}`,
      text: messageBody,
      html: htmlContent,
      attachments: attachments || []
    };
    mailsOptions.push(mailOpt);
  }
} else {
  const htmlContent = generateEmailContent(messageType, {
    subject,
    messageBody,
    selectedDate,
    selectedTime,
    confirmAttendance
  });
  mailOptions = { // <-- asigna aquí
    from: `"Chaski App" <${process.env.EMAIL_USER}>`,
    subject: `[${messageType.toUpperCase()}] ${subject}`,
    text: messageBody,
    html: htmlContent,
    attachments: attachments || []
  };
}
const results = [];
const errors = [];
// Enviar emails individuales para mejor control
let index = 0;
for (const email of selectedEmails) {
  try {
    if (messageType === 'citacion') {
      await transporter.sendMail({
        ...mailsOptions[index],
        to: email
      });
    } else {
      await transporter.sendMail({
        ...mailOptions,
        to: email
      });
    }
    results.push({ email, status: 'enviado' });
    index++;
  } catch (error) {
    console.error(`Error enviando a ${email}:`, error);
    errors.push({ email, error: error.message });
  }
}
  return {
    message: `Proceso completado. ${results.length} correos enviados exitosamente`,
    enviados: results.length,
    errores: errors.length,
    detalles: {
      exitosos: results,
      fallidos: errors
    },
    tipoMensaje: messageType,
    destinatarios: selectedEmails.length
  };
};

// Nueva función para envío en cola
const sendEmailQueue = async (req, res) => {
  try {
    // Extraer datos del formulario (FormData desde frontend)
    let selectedEmails, messageType, subject, messageBody, selectedDate, selectedTime, confirmAttendance, comunitacionsIds;
    
    // Si los datos vienen en FormData
    if (req.body.selectedEmails) {
      selectedEmails = JSON.parse(req.body.selectedEmails || '[]');
      messageType = req.body.messageType || 'mensaje';
      subject = req.body.subject || '';
      messageBody = req.body.messageBody || '';
      selectedDate = req.body.selectedDate || '';
      selectedTime = req.body.selectedTime || '';
      confirmAttendance = req.body.confirmAttendance === 'true';
      comunitacionsIds = JSON.parse(req.body.comunitacionsIds || '[]');
    } else {
      // Si los datos vienen como JSON en el body (compatibilidad hacia atrás)
      ({
        selectedEmails = [],
        messageType = 'mensaje',
        subject = '',
        messageBody = '',
        selectedDate = '',
        selectedTime = '',
        confirmAttendance = false,
        comunitacionsIds = []
      } = req.body);
    }
    console.log("Borrame: sendEmailQueue: LN: 176 ", comunitacionsIds);
    // Validaciones
    if (!selectedEmails || selectedEmails.length === 0) {
      return res.status(400).json({ error: "Debe especificar al menos un destinatario" });
    }

    if (!subject.trim()) {
      return res.status(400).json({ error: "El asunto es obligatorio" });
    }

    if (!messageBody.trim()) {
      return res.status(400).json({ error: "El mensaje es obligatorio" });
    }

    // Para citaciones, validar fecha y hora
    if (messageType === 'citacion') {
      if (!selectedDate) {
        return res.status(400).json({ error: "La fecha es obligatoria para citaciones" });
      }
      if (!selectedTime) {
        return res.status(400).json({ error: "La hora es obligatoria para citaciones" });
      }
    }

    // Preparar archivos adjuntos si existen
    let attachments = [];
    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer,
        contentType: req.file.mimetype
      });
    }

    // Preparar datos para la cola
    const emailData = {
      selectedEmails,
      messageType,
      subject,
      messageBody,
      selectedDate,
      selectedTime,
      confirmAttendance,
      attachments,
      comunitacionsIds
    };

    // Agregar a la cola
    const taskId = emailQueue.addTask(emailData, (error, result) => {
      if (error) {
        console.error('Error en cola de email:', error);
      } else {
        console.log('Email procesado exitosamente desde cola:', result);
      }
    });

    // Respuesta inmediata
    res.status(202).json({
      message: "Emails agregados a la cola de envío",
      taskId: taskId,
      destinatarios: selectedEmails.length,
      tipoMensaje: messageType,
      status: "En cola",
      queueStats: emailQueue.getStats()
    });

  } catch (error) {
    console.error("Error al agregar emails a la cola:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message 
    });
  }
};

const sendEmail = async (req, res) => {
  try {
    // Extraer datos del formulario (FormData desde frontend)
    let selectedEmails, messageType, subject, messageBody, selectedDate, selectedTime, confirmAttendance;
    
    // Si los datos vienen en FormData
    if (req.body.selectedEmails) {
      selectedEmails = JSON.parse(req.body.selectedEmails || '[]');
      messageType = req.body.messageType || 'mensaje';
      subject = req.body.subject || '';
      messageBody = req.body.messageBody || '';
      selectedDate = req.body.selectedDate || '';
      selectedTime = req.body.selectedTime || '';
      confirmAttendance = req.body.confirmAttendance === 'true';
    } else {
      // Si los datos vienen como JSON en el body (compatibilidad hacia atrás)
      ({
        selectedEmails = [],
        messageType = 'mensaje',
        subject = '',
        messageBody = '',
        selectedDate = '',
        selectedTime = '',
        confirmAttendance = false
      } = req.body);
    }

    // Validaciones
    if (!selectedEmails || selectedEmails.length === 0) {
      return res.status(400).json({ error: "Debe especificar al menos un destinatario" });
    }

    if (!subject.trim()) {
      return res.status(400).json({ error: "El asunto es obligatorio" });
    }

    if (!messageBody.trim()) {
      return res.status(400).json({ error: "El mensaje es obligatorio" });
    }

    // Para citaciones, validar fecha y hora
    if (messageType === 'citacion') {
      if (!selectedDate) {
        return res.status(400).json({ error: "La fecha es obligatoria para citaciones" });
      }
      if (!selectedTime) {
        return res.status(400).json({ error: "La hora es obligatoria para citaciones" });
      }
    }

    // Preparar archivos adjuntos si existen
    let attachments = [];
    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        content: req.file.buffer,
        contentType: req.file.mimetype
      });
    }

    // Usar la función de procesamiento real
    const result = await processEmailSending({
      selectedEmails,
      messageType,
      subject,
      messageBody,
      selectedDate,
      selectedTime,
      confirmAttendance,
      attachments
    });

    if (result.errores > 0) {
      res.status(207).json(result); // 207 Multi-Status
    } else {
      res.status(200).json(result);
    }

  } catch (error) {
    console.error("Error general al enviar correos:", error);
    res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message 
    });
  }
};

// Nueva función para obtener estadísticas de la cola
const getQueueStats = (req, res) => {
  try {
    const stats = emailQueue.getStats();
    res.status(200).json({
      message: "Estadísticas de la cola de emails",
      stats: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error al obtener estadísticas de cola:", error);
    res.status(500).json({ 
      error: "Error al obtener estadísticas",
      details: error.message 
    });
  }
};

module.exports = { sendEmail, sendEmailQueue, getQueueStats, processEmailSending };