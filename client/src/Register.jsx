import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser && storedUser.name&&storedUser.password) {
    navigate("/Register"); 
  }
}, [navigate]);
  

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!username.trim() || !password.trim()) {
      alert("נא להזין שם משתמש וסיסמה");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const userData = { name: username, password: password };
        

        localStorage.setItem("user", JSON.stringify(userData));
        
        alert("נרשמת בהצלחה!");
        setUsername(username);
        navigate("/WebSocketComponent");
      } else {
        alert(data.message || "שגיאה בהרשמה");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("שגיאה בשרת");
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>טופס הרשמה</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="username">שם משתמש</label>
            <input
              type="text"
              id="username"
              placeholder="הכנס שם משתמש"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">סיסמא</label>
            <input
  id="password"
  type="password"
  placeholder="הכנס סיסמא"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  autoComplete="current-password"
/>
          </div>
          <div className="input-group">
            <label htmlFor="email">מייל</label>
            <input type="text" id="email" placeholder="הכנס כתובת מייל" />
          </div>
          <button type="submit" className="login-button">Sign Up</button> 
          
          </form>
      </div>
    </div>
  );
};

export default Register;

