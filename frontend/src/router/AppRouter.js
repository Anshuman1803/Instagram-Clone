import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ComponentLoader from "../components/ComponentLoader";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

// Home Routes elements
const HomeContainer = lazy(() => import('../pages/Home/HomeContainer'));
const Home = lazy(() => import('../pages/Home/Home'));
const Search = lazy(() => import('../pages/Home/Search'));
const Explore = lazy(() => import('../pages/Home/Explore'));
const Messages = lazy(() => import('../pages/Home/Messages'));
const Notification = lazy(() => import('../pages/Home/Notification'));
const Create = lazy(() => import('../pages/Home/Create'));
const Profile = lazy(() => import('../pages/Home/Profile'));
const ProfilePost = lazy(() => import('../pages/Home/ProfilePost'));
const ProfileSavedPost = lazy(() => import('../pages/Home/ProfileSavedPost'));

// Auth Routes elements
const AuthContainer = lazy(() => import("../pages/Auth/AuthContainer"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Signup = lazy(() => import("../pages/Auth/Signup"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"))
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"))
const OTP = lazy(() => import("../components/OTP").then(module => ({ default: module.OTP })));


function AppRouter() {
  const [validate, setValidate] = useState(false);
  const [Loader, setLoader] = useState(true);
  const { instaTOKEN } = useSelector((state) => state.Instagram);
  const navigateTO = useNavigate();

  useEffect(() => {
    setLoader(true);
    if (instaTOKEN) {
      axios
        .post("http://localhost:5000/api/v1/auth/verify/token", { instaTOKEN })
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

      {
        Loader ? <ComponentLoader /> : <>
          {
            validate ? <HomeRoute /> : <AuthRoute />
          }
        </>
      }
    </>
  );
}


const AuthRoute = () => {
  return <Routes>
    <Route path="/" element={<Suspense fallback={<ComponentLoader />}> <AuthContainer /> </Suspense>} >
      <Route path="/user/auth/signin" element={<Suspense fallback={<ComponentLoader />}> <Login /> </Suspense>} />
      <Route path="/user/auth/register" element={<Suspense fallback={<ComponentLoader />}> <Signup /> </Suspense>} />
      <Route path="/user/auth/OTP/:Type" element={<Suspense fallback={<ComponentLoader />}> <OTP /> </Suspense>} />
      <Route path="/user/auth/password/forgot-password" element={<Suspense fallback={<ComponentLoader />}> <ResetPassword /> </Suspense>} />
      <Route path="/user/auth/password/reset-password" element={<Suspense fallback={<ComponentLoader />}> <ForgotPassword /> </Suspense>} />
      <Route path="/*" element={<Suspense fallback={<ComponentLoader />}> <Login /> </Suspense>} />
    </Route>
  </Routes>
}

const HomeRoute = () => {
  return <Routes>
    <Route path="/" element={<Suspense fallback={<ComponentLoader />}> <HomeContainer /> </Suspense>} >
      <Route path="/home" element={<Suspense fallback={<ComponentLoader />}> <Home /> </Suspense>} />
      <Route path="/search" element={<Suspense fallback={<ComponentLoader />}> <Search /> </Suspense>} />
      <Route path="/explore" element={<Suspense fallback={<ComponentLoader />}> <Explore /> </Suspense>} />
      <Route path="/messages" element={<Suspense fallback={<ComponentLoader />}> <Messages /> </Suspense>} />
      <Route path="/notification" element={<Suspense fallback={<ComponentLoader />}> <Notification /> </Suspense>} />
      <Route path="/create" element={<Suspense fallback={<ComponentLoader />}> <Create /> </Suspense>} />
      <Route path="/:instaUserID" element={<Suspense fallback={<ComponentLoader />}> <Profile /> </Suspense>}>
        <Route path="/:instaUserID/posts" element={<Suspense fallback={<ComponentLoader />}> <ProfilePost /> </Suspense>} index />
        <Route path="/:instaUserID/saved" element={<Suspense fallback={<ComponentLoader />}> <ProfileSavedPost /> </Suspense>} />
      </Route>

    </Route>
  </Routes>
}

export default AppRouter;
