const express=require('express');

const cors=require('cors');
const messageRouter=require('./routers/messageRouter');
const connectDB=require('./configs/db'); 
const userRouter = require('./routers/UserRouter');
const mongoose = require('mongoose');
const app=express();
const PORT=5000;


connectDB();

app.use(cors());

app.use(express.json());

app.use('/users', userRouter);

app.use('/messages', messageRouter); 

// app.listen(5000, 'localhost', () => {
//   console.log("Server running on http://localhost:5000");
// });


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
