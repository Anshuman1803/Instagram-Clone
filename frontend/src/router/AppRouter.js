import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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
import toast from "react-hot-toast";
import ComponentLoader from "../components/ComponentLoader";
import Create from "../pages/Home/Create";
import ProfilePost from "../pages/Home/ProfilePost";
import ProfileSavedPost from "../pages/Home/ProfileSavedPost";
import EditProfile from "../pages/Home/EditProfile";
import { OTP } from "../components/OTP";
import axios from "../utility/customAxios"
function AppRouter() {
  const [validate, setValidate] = useState(false);
  const [Loader, setLoader] = useState(true);
  const { instaTOKEN } = useSelector((state) => state.Instagram);
  const navigateTO = useNavigate();
  useEffect(() => {
    setLoader(true);
    if (instaTOKEN) {
      axios
        .post("/auth/verify/token", { instaTOKEN })
        .then((response) => {
          if (response.data.success) {
            setValidate(true);
            setLoader(false);
          } else {
            setValidate(false);
            setLoader(false);
            toast.error("Access denied! Login Again");
            navigateTO("/user/auth/signin")
          }
        })
        .catch((err) => {
          setValidate(false);
          setLoader(false);
          toast.error(`Invalid or expired token. ${err.message}`);
          navigateTO("/user/auth/signin")
        });
    } else {
      setValidate(false);
      setLoader(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instaTOKEN]);
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
              <Route path="/:instaUserID" element={<Profile />}>
                <Route path="/:instaUserID/posts" element={<ProfilePost />} index />
                <Route path="/:instaUserID/saved" element={<ProfileSavedPost />} />
              </Route>
              <Route path='/accounts/edit' element={<EditProfile />} />
              <Route path="/*" element={<Home />} />
            </Route>
          ) : (
            <Route path="/" element={<AuthContainer />}>
              <Route path="/user/auth/signin" element={<Login />} index />
              <Route path="/user/auth/register" element={<Signup />} />
              <Route path="/user/auth/OTP/:Type" element={<OTP />} />
              <Route path="/user/auth/password/forgot-password" element={<ForgotPassword />} />
              <Route path="/user/auth/password/reset-password" element={<ResetPassword />} />
              <Route path="/*" element={<Login />} />
            </Route>
          )}
        </Routes>
      )}
    </>
  );
}

export default AppRouter;
