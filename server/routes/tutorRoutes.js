const express = require("express");
const { createTutor, getEmailTutorsByGrade, getEmailTutors } = require("../controllers/tutorController");

const router = express.Router();

router.get("/tutors/emails", getEmailTutors); // Route to get all tutors
router.get("/grade/:gradeId/tutor/emails", getEmailTutorsByGrade);

router.post("/tutor/create", createTutor);

module.exports = router;