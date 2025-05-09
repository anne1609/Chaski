const express = require("express");
const { createTutor, getEmailTutorsByGrade } = require("../controllers/tutorController");

const router = express.Router();


router.get("/grade/:gradeId/tutor/emails", getEmailTutorsByGrade);

router.post("/tutor/create", createTutor);

module.exports = router;