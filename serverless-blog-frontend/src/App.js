import React from "react";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./components/userLoginRegister/login";
import Home from "./components/home/home";
import Register from "./components/userLoginRegister/register";
import Article from "./components/article/article";
import UserProfile from "./components/userInfo/profile";
import { Provider } from "react-redux";
import store from "./components/reduxStore/store"

import Marked from "./components/test/markdown";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
            <Route path = "/login" element = {<Login/>}/>
            <Route path = "/register" element = {<Register/>}/>
            <Route path = "/home" element = {<Home/>}/>
            <Route path = "/user-profile" element = {<UserProfile/>}/>
            <Route path = "/article/:slug" element = {<Article/>}/>
            <Route path = "/textEditor" element = {<Marked/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
    
  );
}

export default App;
