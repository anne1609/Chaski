const express = require("express");
const multer = require("multer");
const { sendEmail, sendEmailQueue, getQueueStats } = require("../controllers/emailController");

const router = express.Router();

// Configuración de multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Límite de 10MB por archivo
  },
  fileFilter: (req, file, cb) => {
    // Permitir diferentes tipos de archivos comunes
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  }
});

// Ruta para enviar correos con posible archivo adjunto
router.post("/send-email", (req, res, next) => {
  upload.single('attachment')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 10MB permitido.' });
      }
      return res.status(400).json({ error: `Error al procesar archivo: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    // Si no hay error, continuar con el controlador
    sendEmail(req, res);
  });
});

// Ruta para enviar correos en cola (en segundo plano)
router.post("/send-email-queue", (req, res, next) => {
  upload.single('attachment')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'El archivo es demasiado grande. Máximo 10MB permitido.' });
      }
      return res.status(400).json({ error: `Error al procesar archivo: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    // Si no hay error, continuar con el controlador
    sendEmailQueue(req, res);
  });
});

// Ruta para obtener estadísticas de la cola
router.get("/queue-stats", getQueueStats);

module.exports = router;