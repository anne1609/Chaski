const express = require('express');
const router = express.Router();
const communicationController = require('../controllers/communicationController');

router.get('/communication', communicationController.getAllCommunications);
router.get('/communication/:id', communicationController.getCommunicationById);
router.post('/communication', communicationController.createCommunication);
router.put('/communication/:id', communicationController.updateCommunication);
router.delete('/communication/:id', communicationController.deleteCommunication);

module.exports = router;