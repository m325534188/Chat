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
const wss = new WebSocket.Server({ server });

//connect db
mongoose.connect("mongodb+srv://username:password@cluster0.tvqct.mongodb.net/yourDB?retryWrites=true&w=majority", { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Message schema and model
const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
// const Message = mongoose.model("Message", messageSchema);
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

// WebSocket handling
const clientMap = new Map(); 

wss.on("connection", function connection(ws) {
  console.log("Client connected");
  let currentUser = null;

  ws.on("message", async function incoming(message) {
    try {
      const { sender, receiver, message: msgContent } = JSON.parse(message);
      console.log("🔹 Server received:", { sender, receiver, message: msgContent });
      currentUser = sender;
      
      // שמור בבסיס הנתונים
      const newMessage = new Message({ sender, receiver, message: msgContent });
      await newMessage.save();

      // שלח להודעות ערוציים לכולם, ופרטיות רק למטרה
      console.log("Broadcasting to", wss.clients.size, "clients");
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // ערוץ - שלח לכולם
          if (receiver === "general" || receiver === "announcements" || receiver === "random") {
            client.send(JSON.stringify({ sender, receiver, message: msgContent }));
          }
          // שיחה פרטית - שלח רק לנמען ולשולח
          // (אנו לא יודעים מי החיבור השני, אז שלח לכולם וקליינט יסנן)
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


app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/messages", messageRouter);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server (Express + WebSocket) is running on port ${PORT}`);
});
