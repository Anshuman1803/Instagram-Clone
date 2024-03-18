import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthContainer from "../pages/Auth/AuthContainer";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ResetPassword from "../pages/Auth/ResetPassword";
import ForgotPassword from "../pages/Auth/ForgotPassword";

import HomeContainer from '../pages/Home/HomeContainer';
import Home from '../pages/Home/Home'
import Search from '../pages/Home/Search'
import Explore from '../pages/Home/Explore'
import Messages from '../pages/Home/Messages'
import Notification from '../pages/Home/Notification'
import Profile from '../pages/Home/Profile'

function AppRouter() {
  var validate = true
  return (
    <Routes>
      {
        validate ?
          <Route path='/' element={<HomeContainer />} >
            <Route path='/home' element={<Home />} />
            <Route path='/search' element={<Search />} />
            <Route path='/explore' element={<Explore />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/notification' element={<Notification />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
          :
          <Route path="/" element={<AuthContainer />}>
            <Route path="/user/auth/signin" element={<Login />} index />
            <Route path="/user/auth/register" element={<Signup />} />
            <Route path="/user/auth/password/forgot-password" element={<ForgotPassword />} />
            <Route path="/user/auth/password/reset-password" element={<ResetPassword />} />
          </Route>
      }
    </Routes>
  );
}

export default AppRouter;
