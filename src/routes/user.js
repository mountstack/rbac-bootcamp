const express = require('express');
const router = express.Router();
const { assignRole, getAllUser } = require('../controllers/user/user');

// User Routes 
router.get('/', getAllUser); 
router.patch('/:id/assign-role', assignRole); 

module.exports = router; 