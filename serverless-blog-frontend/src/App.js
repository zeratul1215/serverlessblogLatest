import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./components/userLoginRegister/login";
import Home from "./components/home/home";
import Register from "./components/userLoginRegister/register";
import UserProfile from "./components/userInfo/profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path = "/login" element = {<Login/>}/>
          <Route path = "/register" element = {<Register/>}/>
          <Route path = "/home" element = {<Home/>}/>
          <Route path = "/user-profile" element = {<UserProfile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
