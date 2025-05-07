const express = require("express");
const { createGrade, getEmailStudents } = require("../controllers/gradeController");

const router = express.Router();


router.get("/grade/:gradeId/emails", getEmailStudents);


module.exports = router;