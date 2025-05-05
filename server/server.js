
const WebSocket = require("ws");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/chatapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", async function incoming(message) {
    try {
      console.log("Received:", message);
      const { sender, receiver, message: msgContent } = JSON.parse(message);

      const newMessage = new Message({ sender, receiver, message: msgContent });
      await newMessage.save();

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ sender, message: msgContent }));
        }
      });
    } catch (err) {
      console.error("Error:", err);
      ws.send(JSON.stringify({ error: "Failed to process message" }));
    }
  });
});

console.log("WebSocket server running on ws://localhost:8080");
