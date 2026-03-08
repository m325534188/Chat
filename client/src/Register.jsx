import React, { useState, useEffect } from "react";
import "./Login.css";
import WebSocketComponent from "./WebSocketComponent";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

useEffect(() => {
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  if (storedUser && storedUser.name&&storedUser.password) {
    navigate("/WebSocketComponent"); 
  }
}, [navigate]);
  

  const handleRegister = async (e) => {
    e.preventDefault();
  console.log("Register clicked");
    if (!username.trim() || !password.trim()) {
      alert("Please enter a username and password");
      return;
    }
  
    try {
      const response = await fetch("/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const userData = { name: username, password: password };
        

        sessionStorage.setItem("user", JSON.stringify(userData));
        
        alert("Registered successfully!");
        setUsername(username);
        navigate("/WebSocketComponent");
      } else {
        alert(data.message || "Error occurred while registering");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert(" Error on server");
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Registration Form</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
  id="password"
  type="password"
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  autoComplete="current-password"
/>
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="text" id="email" placeholder="Enter email" />
          </div>
          <button
  type="submit"
  className="login-button"
>
  Sign Up
</button> 
          </form>
      </div>
    </div>
  );
};

export default Register;

