const express = require("express");
const { createTutor, getEmailTutors, getTutorById } = require("../controllers/tutorController");

const router = express.Router();

// Ruta para obtener todos los tutores con sus estudiantes asignados
router.get("/tutors/emails", getEmailTutors);

// Ruta para obtener un tutor específico con sus estudiantes
router.get("/tutor/:tutorId", getTutorById);

// Ruta para crear un nuevo tutor
router.post("/tutor/create", createTutor);

module.exports = router;