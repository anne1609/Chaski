const express = require("express");
const { createTeacher, getEmailsTeacher, getTeacherById } = require("../controllers/teacherController");

const router = express.Router();


router.get("/teachers/emails", getEmailsTeacher);


module.exports = router;