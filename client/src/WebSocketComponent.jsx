// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom"; 
// import "./chat-style.css";
// import "./App.css";
// const WebSocketComponent = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [username, setUsername] = useState("");
//   const [hasName, setHasName] = useState(false);
//   const [ws, setWs] = useState(null);
//   const navigate = useNavigate(); 

//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user && user.name) {
//       setUsername(user.name);
//       setHasName(true);
//     } else {
//       navigate("/Register"); 
//     }

//       const savedMessages = JSON.parse(localStorage.getItem("messages"));
//       if (savedMessages && Array.isArray(savedMessages)) {
//         setMessages(savedMessages);
//       }
    
//     // const socket = new WebSocket("ws://localhost:8080");
//     // socket.onopen = () => {
//     //   console.log("Connected to server");
//     // };

//      const socket = new WebSocket("wss://chat-1-gm0e.onrender.com");
//     socket.onopen = () => {
//       console.log("Connected to server");
//     };

//     socket.onmessage = (event) => {
//       const msg = JSON.parse(event.data);
//       setMessages((prev) => {
//         const updated = [...prev, msg];
//         localStorage.setItem("messages", JSON.stringify(updated)); 
//         return updated;
//       });
//     }
//     socket.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     setWs(socket);

//     return () => socket.close();
//     console .log("WebSocket closed");
//   }, [navigate]);

//   const handleSend = () => {
//     if (!input || !username || !ws) return;
//   const msgObject = {
//     sender: username,
//     receiver: "general",
//     message: input,
//   };
  
//   ws.send(JSON.stringify(msgObject)); 
  
//   setMessages((prev) => {
//     const updated = [...prev, msgObject]; 
//     localStorage.setItem("messages", JSON.stringify(updated));
//     return updated;
//   });
  
//   setInput("");
// }  

// const currentUser = JSON.parse(localStorage.getItem("user"));

// if (!currentUser) {

//   window.location.href = "/Register"; 
// }

//   function handleLogout() {
//     localStorage.removeItem("user");
//     window.location.href = "/";

//   }
//   function clearChat() {
//     localStorage.removeItem("messages");
//     window.location.reload();
//   }
  
//   return (
//     <div style={{ padding: "20px" }}>
//      <Link to="/delete">ניהול משתמשים</Link>
//       <h2>Real-Time Chat</h2>
//       <p>{username}</p>

//       {!hasName ? (
//         <div>
//           <p>טוען שם משתמש...</p>
//         </div>
//       ) : (
//         <>
//           <div className="chat-box">
//             <div style={{ marginTop: "50px" }}>
//               {messages.map((msg, index) => (
//                 <div
//                   key={index}
//                   className={`message-bubble ${
//                     msg.sender === username ? "sent" : "received"
//                   }`}
//                 > 
//                   <div><strong>{msg.sender}
//                     <br></br>
//                     </strong> {msg.message}</div>

//                 </div>
//               ))}
//             </div>
//             <div>
//               <input
//                 type="text"
//                 placeholder="הקלד הודעה"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     handleSend();
//                   }
//                 }}
//               />
//             </div>
//           </div>
//           <button onClick={handleLogout}>התנתק</button><br>
//           </br>
//           <button onClick={clearChat}>נקה שיחה</button>

//         </>
//       )}
//     </div>
//   );
// };

// export default WebSocketComponent;


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
  const [chatMode, setChatMode] = useState("channels"); // "channels" or "users"
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
    const fetchUsers = async () => {
      try {
        const response = await fetch("/users");
        const data = await response.json();
        setUsers(data.map(u => u.username));
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();


    const loadMessagesForUser = (currentUsername) => {
      const savedMessages = JSON.parse(sessionStorage.getItem("messages")) || [];
      // סנן רק הודעות שרלוונטיות למשתמש הנוכחי
      // ללא ערבוב של ערוצים וחלקות פרטיות
      return savedMessages;
    };
    
    setMessages(loadMessagesForUser(user.name));

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const reconnectDelay = 2000; // 2 seconds

    // Use environment variable or localhost for development
    const wsUrl = process.env.REACT_APP_WS_URL || "ws://localhost:8080";
    
    const connectWebSocket = () => {
      console.log("🔌 Attempting WebSocket connection to:", wsUrl);
      const socket = new WebSocket(wsUrl);
      const currentUsername = user.name;

      socket.onopen = () => {
        console.log("✅ Connected to server");
        setWsConnected(true);
        reconnectAttempts = 0;
      };

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        console.log("📩 Received message:", msg);
        setMessages((prev) => {
          // בדוק אם הודעה זו רלוונטית למשתמש הנוכחי
          const isRelevant = 
            msg.receiver === "general" || 
            msg.receiver === "announcements" || 
            msg.receiver === "random" ||
            msg.sender === currentUsername ||
            msg.receiver === currentUsername;
          
          console.log("Is relevant?", isRelevant, "CurrentUser:", currentUsername, "Sender:", msg.sender, "Receiver:", msg.receiver);
          
          if (!isRelevant) return prev;

          const updated = [...prev, msg];
          sessionStorage.setItem("messages", JSON.stringify(updated));
          return updated;
        });
      };

      socket.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        setWsConnected(false);
      };

      socket.onclose = () => {
        console.log("🔴 WebSocket closed");
        setWsConnected(false);
        
        // Try to reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          console.log(`🔄 Reconnecting... (attempt ${reconnectAttempts}/${maxReconnectAttempts})`);
          setTimeout(connectWebSocket, reconnectDelay);
        } else {
          console.error("❌ Failed to reconnect after", maxReconnectAttempts, "attempts");
        }
      };

      setWs(socket);
    };

    connectWebSocket();

    return () => {
      console.log("Cleaning up WebSocket");
    };
  }, [navigate]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || !username) return;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("⚠️ WebSocket not connected");
      alert("חיבור לשרת אבוד. יוצר חיבור מחדש...");
      return;
    }

    const msgObject = {
      sender: username,
      receiver: selectedReceiver,
      message: trimmed,
    };

    console.log("📤 Sending message:", msgObject, "WebSocket state:", ws.readyState);
    try {
      ws.send(JSON.stringify(msgObject));

      setMessages((prev) => {
        const updated = [...prev, msgObject];
        sessionStorage.setItem("messages", JSON.stringify(updated));
        return updated;
      });

      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
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
        <p style={{ color: "green" }}>✅ מחובר לשרת</p>
      ) : (
        <p style={{ color: "red" }}>🔴 מנותק מהשרת - הקליינט מנסה להתחבר מחדש...</p>
      )}

      {hasName ? (
        <>
          <div style={{ marginBottom: "20px" }}>
            <button 
              onClick={() => setChatMode("channels")} 
              style={{ marginRight: "10px", fontWeight: chatMode === "channels" ? "bold" : "normal" }}
            >
              📢 ערוצים
            </button>
            <button 
              onClick={() => setChatMode("users")} 
              style={{ fontWeight: chatMode === "users" ? "bold" : "normal" }}
            >
              👥 שיחות פרטיות
            </button>
          </div>

          {chatMode === "channels" ? (
            <div style={{ marginBottom: "15px" }}>
              <label>בחר ערוץ: </label>
              <select value={selectedReceiver} onChange={(e) => setSelectedReceiver(e.target.value)}>
                {channels.map(channel => (
                  <option key={channel} value={channel}>
                    {channel}
                  </option>
                ))}
              </select>
              <span style={{ marginLeft: "10px", color: "green" }}>✓ {selectedReceiver}</span>
            </div>
          ) : (
            <div style={{ marginBottom: "15px" }}>
              <label>בחר משתמש: </label>
              <select value={selectedReceiver} onChange={(e) => setSelectedReceiver(e.target.value)}>
                <option value="">-- בחר משתמש --</option>
                {users.filter(u => u !== username).map(user => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
              {selectedReceiver && <span style={{ marginLeft: "10px", color: "green" }}>✓ {selectedReceiver}</span>}
            </div>
          )}

          <div className="chat-box">
            <div style={{ marginTop: "50px", maxHeight: "400px", overflowY: "auto" }}>
              {messages
                .filter(msg => 
                  chatMode === "channels" 
                    ? msg.receiver === selectedReceiver
                    : (msg.receiver === selectedReceiver || msg.sender === selectedReceiver)
                )
                .map((msg, index) => (
                  <div
                    key={index}
                    className={`message-bubble ${
                      msg.sender === username ? "sent" : "received"
                    }`}
                  >
                    <div>
                      <strong>{msg.sender}</strong>
                      <br />
                      {msg.message}
                    </div>
                  </div>
                ))}
            </div>
            <div style={{ marginTop: "15px" }}>
              <input
                type="text"
                placeholder="הקלד הודעה"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                style={{ width: "80%", padding: "8px" }}
              />
              <button 
                onClick={handleSend}
                style={{ marginLeft: "10px", padding: "8px 15px" }}
              >
                שלח
              </button>
            </div>
          </div>
          <button onClick={handleLogout} style={{ marginTop: "15px", marginRight: "10px" }}>
            התנתק
          </button>
          <button onClick={clearChat} style={{ marginTop: "15px" }}>
            נקה שיחה
          </button>
        </>
      ) : (
        <p>טוען שם משתמש...</p>
      )}
    </div>
  );
};

export default WebSocketComponent;
