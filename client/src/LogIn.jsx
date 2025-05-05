

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        alert("התחברת בהצלחה!");

        console.log("User data:", username); 
        localStorage.setItem("user", JSON.stringify({ name: username }));

        setUsername(username); 
        console.log("User data:", username); 


        navigate("/WebSocketComponent");
      } else {
        alert(data.message || "שגיאה בהתחברות");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("שגיאה בשרת");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>כניסה לאתר</h2>
        <form onSubmit={handleSubmit}>
  <div className="input-group">
    <label htmlFor="username">שם משתמש</label>
    <input
      type="text"
      id="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="הכנס שם משתמש"
      required
    />
  </div>
  <div className="input-group">
    <label htmlFor="password">סיסמא</label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="הכנס סיסמא"
      required
    />
  </div>
  
  <button type="submit" className="login-button">Log In</button> 
</form>
<div className="signup-section">
  <p>?עוד לא רשום</p>
  <Link to="/register">
    <button className="signup-button">Sign Up</button>
  </Link>
</div>

        
      </div>
    </div>
  );
};

export default LogIn;


