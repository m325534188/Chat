
const mongoose = require('mongoose');

const messageSchema=new mongoose.Schema(
    {
    timestamp:{type:Date,default:Date.now}
    ,sender:{type:String,required:true}
    ,receiver:{type:String,required:true}
    ,message:{type:String,required:true}
    

    }
);

const Message=mongoose.model('Message',messageSchema);

module.exports=Message;