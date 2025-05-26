require('dotenv').config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const mongoose = require("mongoose");

const messageRouter = require("./routers/messageRouter");
const userRouter = require("./routers/UserRouter");

const app = express();
const server = http.createServer(app); // שיתוף השרת בין Express ל־WebSocket
const wss = new WebSocket.Server({ server });

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// סכמה של הודעות
const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
// const Message = mongoose.model("Message", messageSchema);
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

// WebSocket handling
wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", async function incoming(message) {
    try {
      const { sender, receiver, message: msgContent } = JSON.parse(message);
      const newMessage = new Message({ sender, receiver, message: msgContent });
      await newMessage.save();

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ sender, message: msgContent }));
        }
      });
    } catch (err) {
      console.error("Error handling message:", err);
      ws.send(JSON.stringify({ error: "Failed to process message" }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// שימוש ב־Express כרגיל
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/messages", messageRouter);

// הרצת השרת המאוחד
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server (Express + WebSocket) is running on port ${PORT}`);
});
