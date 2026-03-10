require('dotenv').config(); // קודם כל נטען הסביבה
const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/db');
const userRouter = require('./routers/UserRouter');
const messageRouter = require('./routers/messageRouter');

connectDB(); // חיבור ל‑MongoDB

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRouter);
app.use('/messages', messageRouter);

app.get("/", (req, res) => {
  res.send("Chat server is running");
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});