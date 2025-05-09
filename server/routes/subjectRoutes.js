const express = require("express");
const { getSubjects,getSubjectTeachersEmails } = require("../controllers/subjectController");

const router = express.Router();

router.get("/subjects", getSubjects);    
// Ruta para obtener todos los correos de profesores de una materia específica
router.get("/subject/:subjectId/teachers/emails", getSubjectTeachersEmails);


module.exports = router;