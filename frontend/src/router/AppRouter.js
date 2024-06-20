import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LazyLoader from "../components/LazyLoader";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

// Home Routes elements
const HomeContainer = lazy(() => import('../pages/Home/HomeContainer'));
const Home = lazy(() => import('../pages/Home/Home'));
const Search = lazy(() => import('../pages/Home/search/Search.js'));
const Explore = lazy(() => import('../pages/Home/Explore/Explore.js'));
const Messages = lazy(() => import('../pages/Home/Messages'));
const Notification = lazy(() => import('../pages/Home/Notification'));
const Create = lazy(() => import('../pages/Home/Create'));
const Profile = lazy(() => import('../pages/Home/profile/Profile.js'));
const ProfilePost = lazy(() => import('../pages/Home/profile/ProfilePost'));
const ProfileSavedPost = lazy(() => import('../pages/Home/profile/ProfileSavedPost.js'));
const SettingContainer = lazy(()=> import('../pages/Home/setting/SettingContainer'));
const EditProfile = lazy(()=> import('../pages/Home/setting/EditProfile'));
const UpdatePassword = lazy(()=> import('../pages/Home/setting/UpdatePassword'));
const Privacy = lazy(()=> import('../pages/Home/setting/Privacy'));

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
        Loader ? <LazyLoader /> : <>
          {
            validate ? <HomeRoute /> : <AuthRoute />
          }
        </>
      }
    </>
  );
}


const HomeRoute = () => {
  return <Routes>
    <Route path="/" element={<Suspense fallback={<LazyLoader />}> <HomeContainer /> </Suspense>} >
      <Route path="/home" element={<Suspense fallback={<LazyLoader />}> <Home /> </Suspense>} />
      <Route path="/search" element={<Suspense fallback={<LazyLoader />}> <Search /> </Suspense>} />
      <Route path="/explore" element={<Suspense fallback={<LazyLoader />}> <Explore /> </Suspense>} />
      <Route path="/messages" element={<Suspense fallback={<LazyLoader />}> <Messages /> </Suspense>} />
      <Route path="/notification" element={<Suspense fallback={<LazyLoader />}> <Notification /> </Suspense>} />
      <Route path="/create" element={<Suspense fallback={<LazyLoader />}> <Create /> </Suspense>} />
      <Route path="/:instaUserID" element={<Suspense fallback={<LazyLoader />}> <Profile /> </Suspense>}>
        <Route path="/:instaUserID/posts" element={<Suspense fallback={<LazyLoader />}> <ProfilePost /> </Suspense>} index />
        <Route path="/:instaUserID/saved" element={<Suspense fallback={<LazyLoader />}> <ProfileSavedPost /> </Suspense>} />
      </Route>

      <Route path="/Accout/setting" element={<Suspense fallback={<LazyLoader />}> <SettingContainer /> </Suspense>}>

      <Route path="/Accout/setting/edit-profile" element={<Suspense fallback={<LazyLoader />}> <EditProfile /> </Suspense>} />
      <Route path="/Accout/setting/update-password" element={<Suspense fallback={<LazyLoader />}> <UpdatePassword /> </Suspense>} />
      <Route path="/Accout/setting/who_can_see_your_content" element={<Suspense fallback={<LazyLoader />}> <Privacy /> </Suspense>} />
      
      </Route>

    </Route>
  </Routes>
}



const AuthRoute = () => {
  return <Routes>
    <Route path="/" element={<Suspense fallback={<LazyLoader />}> <AuthContainer /> </Suspense>} >
      <Route path="/user/auth/signin" element={<Suspense fallback={<LazyLoader />}> <Login /> </Suspense>} />
      <Route path="/user/auth/register" element={<Suspense fallback={<LazyLoader />}> <Signup /> </Suspense>} />
      <Route path="/user/auth/OTP/:Type" element={<Suspense fallback={<LazyLoader />}> <OTP /> </Suspense>} />
      <Route path="/user/auth/password/forgot-password" element={<Suspense fallback={<LazyLoader />}> <ForgotPassword /> </Suspense>} />
      <Route path="/user/auth/password/reset-password" element={<Suspense fallback={<LazyLoader />}> <ResetPassword /> </Suspense>} />
      <Route path="/*" element={<Suspense fallback={<LazyLoader />}> <Login /> </Suspense>} />
    </Route>
  </Routes>
}

export default AppRouter;
