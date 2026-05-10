const Role = require('../../models/role/Role'); 

const createRole = async (req, res) => { 
  const role = await Role.create(req.body); 
  res.json({
    message: 'Role created successfully!', 
    role
  })
} 

const allRoles = async (req, res) => { 
  res.json({ 
    roles: await Role.find().sort({createdAt: -1}).populate('permissions') 
  }) 
} 

module.exports = {
  createRole, 
  allRoles
} 