const userRepo=require('../repositories/usersRepo.js');

//Get All
const getAllUsers=(filter)=>{
    console.log("📢 קיבלנו filter ב-Service:", filter);

   return userRepo.getAllUsers(filter);
}

//Get By ID
const getUserById=(id)=>{
    return userRepo.getById(id);
}

//Create
const addUser=(obj)=>{
    return userRepo.addUser(obj);
}

//Delete
const deleteUser = async (id) => {
    return await userRepo.deleteUser(id);
  };
  
//Update
const updateUser=(id,obj)=>{
    return userRepo.updateUser(id,obj);
}
module.exports={
    getAllUsers,
    getUserById,
    addUser,
    deleteUser
}