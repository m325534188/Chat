const MessageRepo=require('../repositories/messageRepo.js');

//Get All   
const getAllMessages=()=>
{
    return MessageRepo.getAllMessages();
}

//Get By ID
const getMessageById=(id)=>
{
    return MessageRepo.getById(id);
}

//Create
const addMessage=(obj)=>{
    return MessageRepo.addMessage(obj);
}
 
//Delete
const deleteMessage=(id)=>{
    return MessageRepo.deleteMessage(id);
}
//Update
const upDateMessage=(id,obj)=>{
    return MessageRepo.upDateMessage(id,obj);
}
module.exports={
    getAllMessages,
    getMessageById,
    addMessage,
    upDateMessage,
    deleteMessage
}