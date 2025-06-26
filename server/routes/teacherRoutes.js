const express = require("express");
const { getEmailsTeacher, getAllTeachers, getTeacherCoursesWithStudentsAndTutors, getTeacher } = require("../controllers/teacherController");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.get("/teachers", getAllTeachers);
router.get("/teacher/:id", getTeacher);
router.get("/teachers/emails", getEmailsTeacher);
router.get("/teachers/my-courses", authenticateToken, authorizeRoles('teacher'), getTeacherCoursesWithStudentsAndTutors);

module.exports = router;