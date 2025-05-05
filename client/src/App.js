import WebSocketComponent from './WebSocketComponent';
import './App.css';
import LogIn from './LogIn';
import Register from './Register';
import React from 'react';
import { BrowserRouter, Link, Route,Routes,Navigate } from 'react-router-dom'; 
import  DeleteUser from './Component/DeleteUser';
import "./chat-style.css";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
    
 <Routes>
    <Route path='/' element={<LogIn/>}/>
    <Route path='/Register' element={<Register/>}/>
    <Route path='/WebSocketComponent' element={<WebSocketComponent/>}/>
    <Route path="/delete" element={<DeleteUser />} />
  </Routes>
    </>
  );
}

export default App;

