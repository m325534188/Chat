const express=require('express');

const router=express.Router();

const UserServices=require('../Services/UserServices.js');

const User = require('../models/userModel.js');

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "שם משתמש כבר קיים" });
    }
        const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'נרשמת בהצלחה', user: newUser }); 
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Login:", username, password);
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "שם משתמש לא קיים" });
  }
  
  if (user.password !== password) {
    return res.status(400).json({ message: "סיסמא לא נכונה" });
  }
  res.status(200).json({ message: "התחברת בהצלחה", user });
});

 router.get('/',async(req,res)=>{
     try{
          console.log(" בקשה התקבלה ב- `/users`");
          const filter=req.query;
          const users=await UserServices.getAllUsers(filter);
    res.json(users);
       }catch(err){
     res.status(500).json({ error: err.message }); 
      }
})

router.get('/:id',async(req,res)=>{
     try{
     const {id}=req.params;
     const user=await UserServices.getUserById(id);
     res.json(user);
}catch(err){
     res.status(500).json({ error: err.message });
}
})

router.delete('/delete', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'לא נשלח מזהה משתמש למחיקה' });

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'משתמש לא נמצא' });

    res.json({ message: 'המשתמש נמחק בהצלחה' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

