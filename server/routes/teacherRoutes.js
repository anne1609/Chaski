const express = require("express");
const { getEmailsTeacher, getAllTeachers } = require("../controllers/teacherController");

const router = express.Router();

router.get("/teachers", getAllTeachers);
router.get("/teachers/emails", getEmailsTeacher);


module.exports = router;