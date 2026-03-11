const userRepo=require('../repositories/usersRepo.js');

const getAllUsers=(filter)=>{
    console.log("Received filter in Service:", filter);

   return userRepo.getAllUsers(filter);
}

const getUserById=(id)=>{
    return userRepo.getById(id);
}

const addUser=(obj)=>{
    return userRepo.addUser(obj);
}

const deleteUser = async (id) => {
    return await userRepo.deleteUser(id);
  };
  
const updateUser=(id,obj)=>{
    return userRepo.updateUser(id,obj);
}
module.exports={
    getAllUsers,
    getUserById,
    addUser,
    deleteUser,
    updateUser
}