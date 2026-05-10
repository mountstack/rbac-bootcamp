const User = require('../../models/User'); 

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

const getAllUser = async (req, res) => { 
  const users = await User
                          .find({type: {$ne: 'BUSINESS-OWNER'}}).
                          sort({createdAt: -1})
                          .populate({
                              path: 'role',
                              populate: {
                                  path: 'permissions'
                              }
                          }); 
  res.json({
    users
  })
} 

module.exports = { 
  assignRole, 
  getAllUser 
} 