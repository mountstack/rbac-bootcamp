const User = require('../../models/User')

// PATCH: Edit user property
const assignRole = async (req, res) => { 
  const { id } = req.params; 

  const data = {
    type: 'EMPLOYEE', 
    role: req.body.roleId
  } 

  const user = await User.findByIdAndUpdate(id, data, { new: true }); 

  res.json({
    message: "Role assigned Succssfully!", 
    user
  })
} 


// localhost:8000/user/2

module.exports = {
  assignRole
}