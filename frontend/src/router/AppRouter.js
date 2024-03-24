import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthContainer from "../pages/Auth/AuthContainer";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ResetPassword from "../pages/Auth/ResetPassword";
import ForgotPassword from "../pages/Auth/ForgotPassword";

import HomeContainer from "../pages/Home/HomeContainer";
import Home from "../pages/Home/Home";
import Search from "../pages/Home/Search";
import Explore from "../pages/Home/Explore";
import Messages from "../pages/Home/Messages";
import Notification from "../pages/Home/Notification";
import Profile from "../pages/Home/Profile";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import ComponentLoader from "../components/ComponentLoader";
import Create from "../pages/Home/Create";
import ProfilePost from "../pages/Home/ProfilePost";
import ProfileSavedPost from "../pages/Home/ProfileSavedPost";
function AppRouter() {
  const [validate, setValidate] = useState(false);
  const [Loader, setLoader] = useState(true);
  const { Token } = useSelector((state) => state.Instagram);

  useEffect(() => {
    setLoader(true);
    if (Token) {
      axios
        .post(
          "https://instagram-clone-bsmc.onrender.com/api/v1/auth/verify/token",
          { Token }
        )
        .then((response) => {
          if (response.data.success) {
            setValidate(true);
            setLoader(false);
          } else {
            setValidate(false);
            setLoader(false);
            toast.error("Invalid or expired token. Please log in again.");
          }
        })
        .catch((err) => {
          setValidate(false);
          setLoader(true)(false);
          toast.error("Invalid or expired token. Please log in again.");
        });
    } else {
      setValidate(false);
      setLoader(false);
    }
  }, [Token]);
  return (
    <>
      {Loader ? (
        <ComponentLoader type="initialLoader" />
      ) : (
        <Routes>
          {validate ? (
            <Route path="/" element={<HomeContainer />}>
              <Route path="/home" element={<Home />} index />
              <Route path="/search" element={<Search />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/create" element={<Create />} />
              <Route path="/profile" element={<Profile />}>
                <Route path= "/profile/posts" element={<ProfilePost/>} index/>
                <Route path= "/profile/saved" element={<ProfileSavedPost/>} />
              </Route>
              <Route path="/*" element={<Home />} />
            </Route>
          ) : (
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
          )}
        </Routes>
      )}
    </>
  );
}

export default AppRouter;
