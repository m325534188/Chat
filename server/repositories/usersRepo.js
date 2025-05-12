
const User = require('../models/userModel');
console.log("✅ הקובץ UserServices.js נטען מחדש");

// Get All
const getAllUsers = (filter) => {
  return User.find(filter || {});
}
// Get By ID
const getById = (id) => {
  return User.findById(id);
};

// Create
const addUser=(obj)=>
{
    const per=new User(obj);
    return per.save();
}

//Delete
const deletUser=async(id)=>
{
    return await User.findByIdAndDelete({id});
}

module.exports = {
    getAllUsers,
    getById,
    addUser,
    deletUser,

  };
