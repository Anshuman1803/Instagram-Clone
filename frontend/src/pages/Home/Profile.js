import React, { useEffect, useState } from "react";
import defaultProfile from "../../Assets/DefaultProfile.png";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import gridICON from "../../Assets/PostICON.png";
import savedICON from "../../Assets/savedICON.png";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import PostLoader from "../../components/PostLoader";
// import EditProfile from "./EditProfile";
export default function Profile() {
  const userID = useParams();
  const { pathname } = useLocation();
  const { instaUserID } = useSelector((state) => state.Instagram);
  const navigateTO = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    axios.get(`http://localhost:5000/api/v1/auth/user/${userID.instaUserID}`)
      .then((response) => {
        if (response.data.success) {
          setCurrentUser(response.data.user);
          setLoading(false)
        } else {
          toast.error(`Try Again`);
          setLoading(false)
        }
      })
      .catch((err) => {
        toast.error(`Try Again ${err.message}`);
        setLoading(false)
      });

    if (pathname === `/${userID?.instaUserID}`) {
      navigateTO(`/${userID?.instaUserID}/posts`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID, pathname]);

  const handleEdit = () => {
    navigateTO('/accounts/edit')
  }

  return (
    <>
      <section className="dashboard__ProfileSection">
        {
          Loading ? <PostLoader /> :
            <>
              <div className="dashboard__currentUser__infoContainer">

                <div className="infoContainer__userProfile">
                  <img src={currentUser?.userProfile} alt={currentUser?.userName} className="userProile" onError={(e) => { e.target.src = `${defaultProfile}`; e.onerror = null; }} />
                </div>

                <div className="infoContainer__userBox">
                  <h1 className="userBox__userName">
                    <span style={{ marginRight: "10px" }}> {currentUser?.userName}</span>
                    {
                      userID.instaUserID === instaUserID && <button className="userBox__editProfileButton" onClick={handleEdit} >
                        Edit profile
                      </button>
                    }
                  </h1>
                  {/* {
                    edit ? <EditProfile /> : ''
                  } */}

                  <div className="userBox__userActivityState">
                    <span className="userBox__activity userBox__postActivity">
                      <strong style={{ fontSize: "22px", marginRight: "5px" }}>
                        {currentUser?.userPosts}
                      </strong>
                      posts
                    </span>
                    <span className="userBox__activity">
                      <strong style={{ fontSize: "22px", marginRight: "5px" }}>
                        {currentUser?.userFollowers}
                      </strong>
                      followers
                    </span>
                    <span className="userBox__activity">
                      <strong style={{ fontSize: "22px", marginRight: "5px" }}>
                        {currentUser?.userFollowing}
                      </strong>
                      following
                    </span>
                  </div>
                  <p className="userBox__fullName">{currentUser?.fullName}</p>

                  <p className="userBox__userBIO">
                    {currentUser?.userBio ? `${currentUser.userBio}` : ""}
                  </p>
                </div>

              </div>

              <div className="dashboard__currentUser__PostsContainer">
                <nav className="dashboard__postsContainer_navbar">
                  <NavLink
                    to={`/${userID?.instaUserID}/posts`}
                    className="PostsContainer__navItem"
                  >
                    <img
                      src={gridICON}
                      alt="UserPost"
                      className="postsContainer__navitemICON"
                    />
                    <span className="postsContainer__navItemTExt">Posts</span>
                  </NavLink>

                  {userID.instaUserID === instaUserID && (
                    <NavLink
                      to={`/${userID?.instaUserID}/saved`}
                      className="PostsContainer__navItem"
                    >
                      <img
                        src={savedICON}
                        alt="User-saved-Post"
                        className="postsContainer__navitemICON"
                      />
                      <span className="postsContainer__navItemTExt">Saved</span>
                    </NavLink>
                  )}

                </nav>
                <div className="postsContainer__outLetContainer">
                  <Outlet />
                </div>
              </div>
            </>
        }
      </section>

    </>
  );
}
