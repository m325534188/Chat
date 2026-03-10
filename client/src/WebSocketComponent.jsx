import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./chat-style.css";
import "./App.css";

const WebSocketComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [hasName, setHasName] = useState(false);
  const [ws, setWs] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState("general");
  const [channels] = useState(["general", "announcements", "random"]);
  const [users, setUsers] = useState([]);
  const [chatMode, setChatMode] = useState("channels");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.name) {
      setUsername(user.name);
      setHasName(true);
    } else {
      navigate("/Register");
      return;
    }

    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://chat-server-kn0z.onrender.com/users");
        const data = await response.json();
        setUsers(data.map(u => u.username));
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();

    const loadMessagesForUser = (currentUsername) => {
      return JSON.parse(sessionStorage.getItem("messages")) || [];
    };
    setMessages(loadMessagesForUser(user.name));

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const reconnectDelay = 2000;

    const wsUrl = "https://chat-server-kn0z.onrender.com";

    const connectWebSocket = () => {
      console.log("Connecting to WebSocket:", wsUrl);
      const socket = new WebSocket(wsUrl);
      const currentUsername = user.name;

      socket.onopen = () => {
        console.log("Connected to server");
        setWsConnected(true);
        reconnectAttempts = 0;
      };

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const isRelevant = 
          msg.receiver === "general" || 
          msg.receiver === "announcements" || 
          msg.receiver === "random" ||
          msg.sender === currentUsername ||
          msg.receiver === currentUsername;

        if (!isRelevant) return;

        setMessages(prev => {
          const updated = [...prev, msg];
          sessionStorage.setItem("messages", JSON.stringify(updated));
          return updated;
        });
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setWsConnected(false);
      };

      socket.onclose = () => {
        console.log("WebSocket closed");
        setWsConnected(false);
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          setTimeout(connectWebSocket, reconnectDelay);
        }
      };

      setWs(socket);
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
    };
  }, [navigate]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !username) return;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      alert("חיבור לשרת אבוד. מנסה שוב...");
      return;
    }

    const msgObject = {
      sender: username,
      receiver: selectedReceiver,
      message: trimmed,
    };

    ws.send(JSON.stringify(msgObject));

    setMessages(prev => {
      const updated = [...prev, msgObject];
      sessionStorage.setItem("messages", JSON.stringify(updated));
      return updated;
    });

    setInput("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("messages");
    window.location.href = "/";
  };

  const clearChat = () => {
    sessionStorage.removeItem("messages");
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/delete">ניהול משתמשים</Link>
      <h2>Real-Time Chat</h2>
      <p>משתמש: {username}</p>
      {wsConnected ? (
        <p style={{ color: "green" }}> מחובר לשרת</p>
      ) : (
        <p style={{ color: "red" }}>מנותק מהשרת</p>
      )}

      {hasName && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <button onClick={() => setChatMode("channels")} style={{ marginRight: "10px", fontWeight: chatMode === "channels" ? "bold" : "normal" }}>📢 ערוצים</button>
            <button onClick={() => setChatMode("users")} style={{ fontWeight: chatMode === "users" ? "bold" : "normal" }}>👥 שיחות פרטיות</button>
          </div>

          {chatMode === "channels" ? (
            <div style={{ marginBottom: "15px" }}>
              <label>בחר ערוץ: </label>
              <select value={selectedReceiver} onChange={(e) => setSelectedReceiver(e.target.value)}>
                {channels.map(channel => <option key={channel} value={channel}>{channel}</option>)}
              </select>
              <span style={{ marginLeft: "10px", color: "green" }}>✓ {selectedReceiver}</span>
            </div>
          ) : (
            <div style={{ marginBottom: "15px" }}>
              <label>בחר משתמש: </label>
              <select value={selectedReceiver} onChange={(e) => setSelectedReceiver(e.target.value)}>
                <option value="">-- בחר משתמש --</option>
                {users.filter(u => u !== username).map(user => <option key={user} value={user}>{user}</option>)}
              </select>
              {selectedReceiver && <span style={{ marginLeft: "10px", color: "green" }}>✓ {selectedReceiver}</span>}
            </div>
          )}

          <div className="chat-box">
            <div style={{ marginTop: "50px", maxHeight: "400px", overflowY: "auto" }}>
              {messages
                .filter(msg => chatMode === "channels" ? msg.receiver === selectedReceiver : msg.sender === selectedReceiver || msg.receiver === selectedReceiver)
                .map((msg, i) => (
                  <div key={i} className={`message-bubble ${msg.sender === username ? "sent" : "received"}`}>
                    <div><strong>{msg.sender}</strong><br />{msg.message}</div>
                  </div>
                ))}
            </div>
            <div style={{ marginTop: "15px" }}>
              <input
                type="text"
                placeholder="הקלד הודעה"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
                style={{ width: "80%", padding: "8px" }}
              />
              <button onClick={handleSend} style={{ marginLeft: "10px", padding: "8px 15px" }}>שלח</button>
            </div>
          </div>

          <button onClick={handleLogout} style={{ marginTop: "15px", marginRight: "10px" }}>התנתק</button>
          <button onClick={clearChat} style={{ marginTop: "15px" }}>נקה שיחה</button>
        </>
      )}
    </div>
  );
};

export default WebSocketComponent;