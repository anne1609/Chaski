const express = require("express");
const { getEmailsTeacher, getAllTeachers, getTeacherCoursesWithStudentsAndTutors } = require("../controllers/teacherController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/teachers", getAllTeachers);
router.get("/teachers/emails", getEmailsTeacher);
router.get("/teachers/my-courses", authenticateToken, authorizeRoles('teacher'), getTeacherCoursesWithStudentsAndTutors);

module.exports = router;