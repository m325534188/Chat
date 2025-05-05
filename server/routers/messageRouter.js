const express=require('express');

const router=express.Router();

const MessageServices=require('../Services/MessageServices.js');

 router.get('/',async(req,res)=>{
     try{
          console.log("📢 בקשה התקבלה ב- `/Message`");
          const filter=req.query;
          const message=await MessageServices.getAllMessages(filter)
    res.json(message);
       }catch(err){
     res.status(500).json({ error: err.message }); 
      }
})

router.get('/:id',async(req,res)=>{
     try{
     const {id}=req.params;
     const message=await MessageServices.getMessageById(id);
     res.json(message);
}catch(err){
     res.status(500).json({ error: err.message }); 
}
})
   

   router.post('/send', async (req,res) => {
    try {
      const { sender, receiver, message } = req.body;
      const newMessage = new Message({ sender, receiver, message });
      await newMessage.save();
      res.status(200).json({ message: 'Message sent successfully', data: newMessage });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  module.exports=router;