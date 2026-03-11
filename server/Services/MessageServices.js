const MessageRepo=require('../repositories/messageRepo.js');

const getAllMessages=()=>
{
    return MessageRepo.getAllMessages();
}

const getMessageById=(id)=>
{
    return MessageRepo.getById(id);
}

const addMessage=(obj)=>{
    return MessageRepo.addMessage(obj);
}
 
const deleteMessage=(id)=>{
    return MessageRepo.deleteMessage(id);
}
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