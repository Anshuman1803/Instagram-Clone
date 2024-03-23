import React from "react";
import defaultProfile from "../../Assets/DefaultProfile.png";
import { NavLink, Outlet } from "react-router-dom";
export default function Profile() {
  return (
    <section className="dashboard__ProfileSection">

      <div className="dashboard__currentUser__infoContainer">
        <div className="infoContainer__userProfile">
          <img src={defaultProfile} alt="" className="userProile" />
        </div>
        <div className="infoContainer__userBox">
          <h1 className="userBox__userName">Username</h1>

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
          <NavLink to="/profile/posts" className="PostsContainer__navItem">Posts</NavLink>
          <NavLink to="/profile/saved" className="PostsContainer__navItem">Saved</NavLink>
        </nav>
        <div className="postsContainer__outLetContainer">
        <Outlet/>
        </div>
      </div>
    </section>
  );
}
