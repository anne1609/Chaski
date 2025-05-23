const express = require('express');
const router = express.Router();
const {getAllStudentsWithDetails} = require('../controllers/studentController');

// Route to get all students with their details (full name, email, grade name)
router.get('/students', getAllStudentsWithDetails);

module.exports = router;
