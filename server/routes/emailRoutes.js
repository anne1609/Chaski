const express = require("express");
const { sendEmail } = require("../controllers/emailController");

const router = express.Router();

// Ruta para enviar correos
router.post("/send-email", sendEmail);

module.exports = router;