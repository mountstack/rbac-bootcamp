const express = require('express');
const router = express.Router();
const Permission = require('../models/role/Permission')

// Permission Routes 
router.get('/', async (req, res) => {
  res.json({
    permissions: await Permission.find()
  })
}); 

module.exports = router; 