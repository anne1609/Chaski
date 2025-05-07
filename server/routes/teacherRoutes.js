const express = require("express");
const { createTeacher, getEmailsTeacher, getTeacherById } = require("../controllers/teacherController");

const router = express.Router();

// Ruta para obtener todos los profesores con sus grados asignados
router.get("/teachers/emails", getEmailsTeacher);


module.exports = router;