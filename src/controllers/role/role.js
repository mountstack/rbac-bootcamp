const Role = require('../../models/role/Role'); 

const createRole = async (req, res) => { 
  const role = await Role.create(req.body); 
  res.json({
    message: 'Role created successfully!', 
    role
  })
} 

module.exports = {
  createRole
} 