const express = require("express");
const { createTutor, getEmailTutors, getTutorById, getEmailTutorsByGrade } = require("../controllers/tutorController");

const router = express.Router();

// Route to get emails of tutors by grade
router.get("/grade/:gradeId/tutor/emails", getEmailTutorsByGrade);

// Route to get a specific tutor with their students
router.get("/tutor/:tutorId", getTutorById);

// Route to create a new tutor
router.post("/tutor/create", createTutor);

// Route to get all tutors and their assigned students (potentially for a general list)
router.get("/tutors/emails", getEmailTutors); // Changed from /grade/:gradeId/emails to avoid conflict and clarify purpose

module.exports = router;