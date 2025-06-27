const express = require('express');
const router = express.Router();
const tutorCommunicationController = require('../controllers/tutorCommunicationController');

router.get('/tutors-communications', tutorCommunicationController.getAllTutorsCommunications);
router.get('/tutors-communications/:tutor_id/:communication_id', tutorCommunicationController.getTutorCommunicationById);
router.post('/tutors-communications', tutorCommunicationController.createTutorCommunication);
router.put('/tutors-communications/:tutor_id/:communication_id', tutorCommunicationController.updateTutorCommunication);
router.delete('/tutors-communications/:tutor_id/:communication_id', tutorCommunicationController.deleteTutorCommunication);
router.get('/confirm-attendance-tutors', tutorCommunicationController.confirmAttendance);
router.get('/tutors-communications/:communication_id', tutorCommunicationController.getTutorCommunicationByIdCommunication);

module.exports = router;
