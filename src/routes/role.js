const express = require('express');
const router = express.Router();
const { createRole, allRoles } = require('../controllers/role/role');

// Role Routes 
router.post('/', createRole); 
router.get('/', allRoles); 

module.exports = router; 