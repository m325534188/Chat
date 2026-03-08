import WebSocketComponent from './WebSocketComponent';
import './App.css';
import LogIn from './LogIn';
import Register from './Register';
//import Ract from 'react';
import { Route,Routes } from 'react-router-dom'; 
import  DeleteUser from './Component/DeleteUser';
import "./chat-style.css";

function App() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <>

 <Routes>
    <Route path='/' element={<LogIn/>}/>
    <Route path='/Register' element={<Register/>}/>
    <Route path='/WebSocketComponent' element={<WebSocketComponent/>}/>
    <Route path="/delete" element={<DeleteUser />} />
    <Route path="/delete/WebSocketComponent" element={<WebSocketComponent />} />
    {/* <Route path="/login/WebSocketComponent" element={<WebSocketComponent />} /> */}

  </Routes>


    </>
  );
}

export default App;

