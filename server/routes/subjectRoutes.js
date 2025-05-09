const express = require("express");
const { getSubjects,getSubjectTeachersEmails } = require("../controllers/subjectController");

const router = express.Router();

router.get("/subjects", getSubjects);    
router.get("/subject/:subjectId/teachers/emails", getSubjectTeachersEmails);


module.exports = router;