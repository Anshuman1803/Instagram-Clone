import React, { useEffect, useState } from "react";
import defaultProfile from "../../Assets/DefaultProfile.png";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import gridICON from "../../Assets/PostICON.png";
import savedICON from "../../Assets/savedICON.png";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
export default function Profile() {
  const { instaUserID } = useSelector((state) => state.Instagram);
  const navigateTO = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/auth/user/${instaUserID}`)
      .then((response) => {
        if (response.data.success) {
          setCurrentUser(response.data.user);
        } else {
          toast.error(`Try Again`);
        }
      })
      .catch((err) => {
        toast.error(`Try Again ${err.message}`);
      });
    navigateTO("/profile/posts");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instaUserID]);
  console.log(currentUser);
  return (
    <section className="dashboard__ProfileSection">
      <div className="dashboard__currentUser__infoContainer">
        <div className="infoContainer__userProfile">
          <img src={currentUser?.userProfile} alt="" className="userProile" onError={(e)=>{
              e.target.src = `${defaultProfile}`;
              e.onerror = null;
          }}/>
        </div>
        <div className="infoContainer__userBox">
          <h1 className="userBox__userName">
            {currentUser?.userName}
            <button className="userBox__editProfileButton">Edit profile</button>
          </h1>

          <div className="userBox__userActivityState">
            <span className="userBox__activity userBox__postActivity">
              <strong style={{ fontSize: "22px" }}>{currentUser?.userPosts}</strong> posts
            </span>
            <span className="userBox__activity userBox__followersActivity">
              <strong style={{ fontSize: "22px" }}>{currentUser?.userFollowers}</strong> followers
            </span>
            <span className="userBox__activity userBox__followingActivity">
              <strong style={{ fontSize: "22px" }}>{currentUser?.userFollowing}</strong> following
            </span>
          </div>
          <p className="userBox__fullName">{currentUser?.fullName}</p>

          <p className="userBox__userBIO">{currentUser?.userBio ? `${currentUser.userBio}` : "none"}</p>
        </div>
      </div>

      <div className="dashboard__currentUser__PostsContainer">
        <nav className="dashboard__postsContainer_navbar">
          <NavLink to="/profile/posts" className="PostsContainer__navItem">
            <img
              src={gridICON}
              alt=""
              className="postsContainer__navitemICON"
            />{" "}
            <span className="postsContainer__navItemTExt">Posts</span>
          </NavLink>
          <NavLink to="/profile/saved" className="PostsContainer__navItem">
            <img
              src={savedICON}
              alt=""
              className="postsContainer__navitemICON"
            />{" "}
            <span className="postsContainer__navItemTExt">Saved</span>
          </NavLink>
        </nav>
        <div className="postsContainer__outLetContainer">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
