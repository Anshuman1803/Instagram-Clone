import React, { useEffect } from "react";
import defaultProfile from "../../Assets/DefaultProfile.png";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import gridICON from "../../Assets/PostICON.png"
import savedICON from "../../Assets/savedICON.png"
export default function Profile() {
  const navigateTO = useNavigate();
  useEffect(() => {
    navigateTO("/profile/posts");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <section className="dashboard__ProfileSection">

      <div className="dashboard__currentUser__infoContainer">
        <div className="infoContainer__userProfile">
          <img src={defaultProfile} alt="" className="userProile" />
        </div>
        <div className="infoContainer__userBox">
          <h1 className="userBox__userName">Username
          <button className="userBox__editProfileButton">Edit profile</button>
          </h1>

          <div className="userBox__userActivityState">
            <span className="userBox__activity userBox__postActivity">
              <strong style={{ fontSize: "22px" }}>0</strong> posts
            </span>
            <span className="userBox__activity userBox__followersActivity">
              <strong style={{ fontSize: "22px" }}>0</strong> followers
            </span>
            <span className="userBox__activity userBox__followingActivity">
              <strong style={{ fontSize: "22px" }}>0</strong> following
            </span>
          </div>
          <p className="userBox__fullName">Full Name</p>

          <p className="userBox__userBIO">None</p>
        </div>
      </div>

      <div className="dashboard__currentUser__PostsContainer">
        <nav className="dashboard__postsContainer_navbar">
          <NavLink to="/profile/posts" className="PostsContainer__navItem">
          <img src={gridICON} alt="" className="postsContainer__navitemICON"/>  <span className="postsContainer__navItemTExt">Posts</span>
          </NavLink>
          <NavLink to="/profile/saved" className="PostsContainer__navItem">
          <img src={savedICON} alt="" className="postsContainer__navitemICON"/>   <span className="postsContainer__navItemTExt">Saved</span>
          </NavLink>
        </nav>
        <div className="postsContainer__outLetContainer">
          <Outlet />
        </div>
      </div>
    </section>
  );
}
