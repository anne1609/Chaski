const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ruta de la carpeta donde se guardarán los attachments
const uploadDir = path.join(__dirname, '..', 'uploads');

// Crear carpeta si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('Carpeta "uploads" creada');
}

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Ruta para subir attachments
router.post('/upload', upload.single('attachment'), (req, res) => {
  if (!req.file) return res.status(400).send('No se subió ningún attachment.');

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.send({ url: fileUrl });
});

module.exports = router;
