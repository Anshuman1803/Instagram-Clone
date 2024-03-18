import React from "react";
import { Routes, Route } from "react-router-dom";
import AuthContainer from "../pages/Auth/AuthContainer";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ResetPassword from "../pages/Auth/ResetPassword";
import ForgotPassword from "../pages/Auth/ForgotPassword";
function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AuthContainer />}>
        <Route path="/user/auth/signin" element={<Login />} index />
        <Route path="/user/auth/register" element={<Signup />} />
        <Route
          path="/user/auth/password/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/user/auth/password/reset-password"
          element={<ResetPassword />}
        />
        <Route path="/*" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
