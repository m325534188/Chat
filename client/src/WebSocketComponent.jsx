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
  const [ws, setWs] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.name) {
      return navigate("/Register");
    }

    setUsername(user.name);

    const savedMessages = JSON.parse(localStorage.getItem("messages"));
    if (Array.isArray(savedMessages)) {
      setMessages(savedMessages);
    }

    const socket = new WebSocket("wss://chat-1-gm0e.onrender.com");

    socket.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.sender && msg.message) {
          setMessages((prev) => {
            const updated = [...prev, msg];
            localStorage.setItem("messages", JSON.stringify(updated));
            return updated;
          });
        }
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    setWs(socket);

    return () => {
      console.log("🔌 WebSocket closed");
      socket.close();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim() || !username || !ws || ws.readyState !== WebSocket.OPEN) return;

    const msgObject = {
      sender: username,
      receiver: "general",
      message: input.trim(),
    };

    ws.send(JSON.stringify(msgObject));
    setInput("");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const clearChat = () => {
    localStorage.removeItem("messages");
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/delete">ניהול משתמשים</Link>
      <h2>Real-Time Chat</h2>
      <p>{username}</p>

      <div className="chat-box">
        <div style={{ marginTop: "50px" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble ${msg.sender === username ? "sent" : "received"}`}
            >
              <div>
                <strong>{msg.sender}</strong>
                <br />
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        <div>
          <input
            type="text"
            placeholder="הקלד הודעה"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />
        </div>
      </div>

      <button onClick={handleLogout}>התנתק</button>
      <br />
      <button onClick={clearChat}>נקה שיחה</button>
    </div>
  );
};

export default WebSocketComponent;
