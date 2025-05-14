const express = require('express');
const router = express.Router();
const userController = require('../controllers/secretaryController');

router.get('/secretaries', userController.getAllSecretaries);
router.get('/secretaries:id', userController.getSecretaryById);
router.post('/secretaries', userController.createSecretary);
router.put('/secretaries/:id', userController.updateSecretary);
router.delete('/secretaries/:id', userController.deleteSecretary);

module.exports = router;