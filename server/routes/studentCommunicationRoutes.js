const express = require('express');
const router = express.Router();
const studentCommunicationController = require('../controllers/studentCommunicationController');

router.get('/students-communications', studentCommunicationController.getAllStudentsCommunications);
router.get('/students-communications/:student_id/:communication_id', studentCommunicationController.getStudentCommunicationById);
router.post('/students-communications', studentCommunicationController.createStudentCommunication);
router.put('/students-communications/:student_id/:communication_id', studentCommunicationController.updateStudentCommunication);
router.delete('/students-communications/:student_id/:communication_id', studentCommunicationController.deleteStudentCommunication);
router.get('/confirm-attendance-students', studentCommunicationController.confirmAttendance);

module.exports = router;