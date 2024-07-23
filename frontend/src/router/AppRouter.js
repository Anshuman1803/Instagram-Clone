import React, { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LazyLoader from "../components/LazyLoader";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

// Home Routes elements
const HomeContainer = lazy(() => import('../pages/Dashboard/Home/HomeContainer.js'));
const Home = lazy(() => import('../pages/Dashboard/Home/Home.js'));
const PostDetails = lazy(() => import('../pages/Dashboard/PostDetails/PostDetails.js'));
const Search = lazy(() => import('../pages/Dashboard/search/Search.js'));
const Explore = lazy(() => import('../pages/Dashboard/Explore/Explore.js'));
const Messages = lazy(() => import('../pages/Dashboard/Messages'));
const Notification = lazy(() => import('../pages/Dashboard/Notification'));
const Create = lazy(() => import('../pages/Dashboard/create_post/Create.js'));
const Profile = lazy(() => import('../pages/Dashboard/profile/Profile.js'));
const ProfilePost = lazy(() => import('../pages/Dashboard/profile/ProfilePost'));
const ProfileSavedPost = lazy(() => import('../pages/Dashboard/profile/ProfileSavedPost.js'));
const SettingContainer = lazy(() => import('../pages/Dashboard/setting/SettingContainer'));
const EditProfile = lazy(() => import('../pages/Dashboard/setting/edit_profile/EditProfile.js'));
const UpdatePassword = lazy(() => import('../pages/Dashboard/setting/UpdatePassword'));
const Privacy = lazy(() => import('../pages/Dashboard/setting/Privacy'));

// Auth Routes elements
const AuthContainer = lazy(() => import("../pages/Auth/AuthContainer"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Signup = lazy(() => import("../pages/Auth/Signup"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"))
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"))
const OTP = lazy(() => import("../components/OTP").then(module => ({ default: module.OTP })));
const GoogleCallback = lazy(()=> import("../pages/Auth/GoogleCallback.js"))


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function AppRouter() {
  const [validate, setValidate] = useState(false);
  const [Loader, setLoader] = useState(true);
  const { instaTOKEN } = useSelector((state) => state.Instagram);
  const navigateTO = useNavigate();

  useEffect(() => {
    setLoader(true);
    if (instaTOKEN) {
      axios
        .post(`${BACKEND_URL}auth/verify/token`, { instaTOKEN })
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
      <Route path="/post/:id" element={<Suspense fallback={<LazyLoader />}> <PostDetails /> </Suspense>} />
      <Route path="/*" element={<Suspense fallback={<LazyLoader />}> <Home /> </Suspense>} />
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
      <Route path="/auth/google/callback" element={<Suspense fallback={<LazyLoader />}> <GoogleCallback /> </Suspense>} />
      <Route path="/*" element={<Suspense fallback={<LazyLoader />}> <Login /> </Suspense>} />
    </Route>
  </Routes>
}

export default AppRouter;
