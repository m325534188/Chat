const Message=require('../models/messageSchama.js');

// Get All
const getAllMessages=()=>{
    return Message.find();
}

// Get By ID
const getById=(id)=>{
    return Message.findById(id);
}

// Create
const addMessage=(obj)=>{
    const mes=new Message(obj);
    return mes.save();
}

// Update
const upDateMessage=(id,obj)=>{
    return Message.findByIdAndUpdate(id,obj);
}

// Delete
const deleteMessage=(id)=>{
    return Message.findByIdAndDelete(id)
}
module.exports={
    getAllMessages,
    getById,
    addMessage,
    upDateMessage,
    deleteMessage
}