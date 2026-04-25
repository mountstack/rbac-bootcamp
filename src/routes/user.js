const express = require('express');
const router = express.Router();
const { assignRole } = require('../controllers/user/user');

// User Routes 
router.patch('/:id', assignRole); 

module.exports = router; 