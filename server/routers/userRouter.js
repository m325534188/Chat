const express=require('express');

const router=express.Router();

const UserServices=require('../Services/UserServices.js');

const User = require('../models/userModel'); // מודל המשתמש

 router.get('/',async(req,res)=>{
     try{
          console.log("📢 בקשה התקבלה ב- `/users`");
          const filter=req.query;
          const users=await UserServices.getAllUsers(filter);
    res.json(users);
       }catch(err){
     res.status(500).json({ error: err.message }); // שלח את השגיאה עם הקוד 500
      }
})

router.get('/:id',async(req,res)=>{
     try{
     const {id}=req.params;
     const user=await UserServices.getUserById(id);
     res.json(user);
}catch(err){
     res.status(500).json({ error: err.message }); // שלח את השגיאה עם הקוד 500
}
})

// router.delete('/delete',async(req,res)=>{
//      try{
//       const deleteUser = async (id) => {
//         return await User.findByIdAndDelete(id); // בלי סוגריים מסביב ל־id!
//       };
//                  if (!deleted) {
//       return res.status(404).json({ error: 'משתמש לא נמצא' });
//     }
//     res.json({ message: 'משתמש נמחק בהצלחה', user: deleted });
//   } catch (err) {
//     console.error('Delete User Error:', err);
//     res.status(500).json({ error: err.message });
//   }
// })

// router.delete('/delete', async (req, res) => {
//   try {
//     const { id } = req.body;
//     const deleted = await User.findByIdAndDelete(id);
//     if (!deleted) return res.status(404).json({ error: "לא נמצא משתמש" });
//     res.json({ message: "נמחק בהצלחה", user: deleted });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



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

// שליפת כל המשתמשים
// router.get('/all', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// routers/UserRouter.js

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "שם משתמש כבר קיים" });
    }
        const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'נרשמת בהצלחה', user: newUser }); // ✅ גם כאן
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשרת' });
  }
});
   
// routes/users.js

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log("Login:", username, password);
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "שם משתמש לא קיים" });
  }
  
  // לבדוק אם הסיסמא מתאימה
  if (user.password !== password) {
    return res.status(400).json({ message: "סיסמא לא נכונה" });
  }
  res.status(200).json({ message: "התחברת בהצלחה", user });

  });


module.exports = router;

