

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
      const response = await fetch("http://localhost:3001/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
});
      
      const data = await response.json();


      if (response.ok) {
        alert("You have successfully connected !");

        console.log("User data:", username); 
        sessionStorage.setItem("user", JSON.stringify({ name: username }));

        setUsername(username); 


        navigate("/WebSocketComponent");
      } else {
        alert(data.message || "Error occurred while logging in");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error on server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Enter</h2>
        <form onSubmit={handleSubmit}>
  <div className="input-group">
    <label htmlFor="username">Username</label>
    <input
      type="text"
      id="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Enter username"
      required
    />
  </div>
  <div className="input-group">
    <label htmlFor="password">Password</label>
    <input
      type="password"
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter password"
      required
    />
  </div>
  <button type="submit" className="login-button">Log In</button>
</form>

<div className="signup-section">
  <p>?Already registered</p>
    <Link to="/Register">
      <button className="signup-button">Sign Up</button>
    </Link>
</div>

        
      </div>
    </div>
  );
};

export default LogIn;


