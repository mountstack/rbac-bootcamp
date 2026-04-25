const express = require('express');
const router = express.Router();
const { createRole } = require('../controllers/role/role');

// Role Routes 
router.post('/', createRole); 

module.exports = router; 