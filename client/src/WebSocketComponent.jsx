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
  const [channels] = useState(["general", "announcements"]);
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
        const response = await fetch("http://localhost:3001/users");
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

    const wsUrl = "ws://localhost:3001";

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
    <div className="chat-container">
      <div className="chat-header">
        <h2> צ'אט בזמן אמת</h2>
        <p>משתמש: <strong>{username}</strong></p>
        {wsConnected ? (
          <p><span className="status-indicator online"></span>מחובר לשרת</p>
        ) : (
          <p><span className="status-indicator offline"></span>מנותק מהשרת</p>
        )}
        <Link to="/delete" style={{ color: "black", textDecoration: "none", marginTop: "10px", display: "inline-block" }}> ניהול משתמשים</Link>
      </div>

      {hasName && (
        <>
          <div className="mode-buttons">
            <button onClick={() => setChatMode("channels")} style={{ backgroundColor: chatMode === "channels" ? "white" : "rgba(255, 255, 255, 0.2)", color: chatMode === "channels" ? "#667eea" : "black" }}>📢 ערוצים</button>
            <button onClick={() => setChatMode("users")} style={{ backgroundColor: chatMode === "users" ? "white" : "rgba(255, 255, 255, 0.2)", color: chatMode === "users" ? "#667eea" : "black" }}>👥 שיחות פרטיות</button>
          </div>

          <div className="chat-selector">
            {chatMode === "channels" ? (
              <>
                <label style={{ color: "black", fontWeight: "bold" }}>בחר ערוץ: </label>
                <select value={selectedReceiver} onChange={(e) => setSelectedReceiver(e.target.value)}>
                  {channels.map(channel => <option key={channel} value={channel}>{channel}</option>)}
                </select>
                <span style={{ color: "white" }}>✓ {selectedReceiver}</span>
              </>
            ) : (
              <>
                <label style={{ color: "white", fontWeight: "bold" }}>בחר משתמש: </label>
                <select value={selectedReceiver} onChange={(e) => setSelectedReceiver(e.target.value)}>
                  <option value="">-- בחר משתמש --</option>
                  {users.filter(u => u !== username).map(user => <option key={user} value={user}>{user}</option>)}
                </select>
                {selectedReceiver && <span style={{ color: "white" }}>✓ {selectedReceiver}</span>}
              </>
            )}
          </div>

          <div className="chat-box">
            {messages
              .filter(msg => chatMode === "channels" ? msg.receiver === selectedReceiver : msg.sender === selectedReceiver || msg.receiver === selectedReceiver)
              .map((msg, i) => (
                <div key={i} className={`message-bubble ${msg.sender === username ? "sent" : "received"}`}>
                  <strong>{msg.sender}</strong>
                  <div>{msg.message}</div>
                </div>
              ))}
          </div>

          <div className="input-area">
            <input
              type="text"
              placeholder="הקלד הודעה..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            />
            <button onClick={handleSend}> שלח</button>
          </div>

          <div className="chat-controls">
            <button onClick={handleLogout}> התنתק</button>
            <button onClick={clearChat}> נקה שיחה</button>
          </div>
        </>
      )}
    </div>
  );
};

export default WebSocketComponent;