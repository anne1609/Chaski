const express = require("express");
const {      getSubjectTeachersEmails } = require("../controllers/subjectController");

const router = express.Router();


// Ruta para obtener todos los correos de profesores de una materia específica
router.get("/subject/:subjectId/teachers/emails", getSubjectTeachersEmails);

module.exports = router;