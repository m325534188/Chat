require('dotenv').config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");
const mongoose = require("mongoose");

const messageRouter = require("./routers/messageRouter");
const userRouter = require("./routers/UserRouter");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ 
  server,
  perMessageDeflate: false
});

const mongoURL = process.env.MONGODB_URI || "mongodb://localhost:27017/chatapp";
mongoose.connect(mongoURL, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

const clientMap = new Map(); 

wss.on("connection", function connection(ws) {
  console.log("Client connected");
  let currentUser = null;

  ws.on("message", async function incoming(message) {
    try {
      const { sender, receiver, message: msgContent } = JSON.parse(message);
      console.log("🔹 Server received:", { sender, receiver, message: msgContent });
      currentUser = sender;
      
      const newMessage = new Message({ sender, receiver, message: msgContent });
      await newMessage.save();

      console.log("Broadcasting to", wss.clients.size, "clients");
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          if (receiver === "general" || receiver === "announcements" || receiver === "random") {
            client.send(JSON.stringify({ sender, receiver, message: msgContent }));
          }
          
          else {
            client.send(JSON.stringify({ sender, receiver, message: msgContent }));
          }
        }
      });
    } catch (err) {
      console.error("Error handling message:", err);
      ws.send(JSON.stringify({ error: "Failed to process message" }));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    if (currentUser) clientMap.delete(currentUser);
  });
});


app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/users", userRouter);
app.use("/messages", messageRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server (Express + WebSocket) is running on port ${PORT}`);
});
