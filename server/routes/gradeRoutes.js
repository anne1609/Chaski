const express = require("express");
const {  getEmailStudents, getGrades} = require("../controllers/gradeController");

const router = express.Router();


router.get("/grade/:gradeId/emails", getEmailStudents);
router.get("/grades", getGrades);



module.exports = router;