const express = require('express');
const router = express.Router();
const teacherCommunicationController = require('../controllers/teacherCommunicationController');

router.get('/teachers-communications', teacherCommunicationController.getAllTeachersCommunications);
router.get('/teachers-communications/:teacher_id/:communication_id', teacherCommunicationController.getTeacherCommunicationsById);
router.post('/teachers-communications', teacherCommunicationController.createTeacherCommunication);
router.put('/teachers-communications/:teacher_id/:communication_id', teacherCommunicationController.updateTeacherCommunication);
router.delete('/teachers-communications/:teacher_id/:communication_id', teacherCommunicationController.deleteTeacherCommunication);
router.get('/confirm-attendance-teachers', teacherCommunicationController.confirmAttendance);

module.exports = router;