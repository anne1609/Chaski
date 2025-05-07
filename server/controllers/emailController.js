const transporter = require("../config/nodemailerConfig");

const sendEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"Chaski App" <${process.env.EMAIL_USER}>`, // Remitente
      to, // Destinatario
      subject, // Asunto
      text: message, // Mensaje en texto plano
    });

    res.status(200).json({ message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
};

module.exports = { sendEmail };