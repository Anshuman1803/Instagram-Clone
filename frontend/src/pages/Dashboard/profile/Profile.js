import React, { useEffect, useState } from "react";
import defaultProfile from "../../../Assets/DefaultProfile.png";
import loaderImg from "../../../Assets/postCommentLoader.gif"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import gridICON from "../../../Assets/PostICON.png";
import savedICON from "../../../Assets/savedICON.png";
import lockPng from "../../../Assets/lockPNG.png"
import { PiLinkSimple } from "react-icons/pi";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut, userFollow, userUnFollow } from '../../../Redux/ReduxSlice';
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import profileStyle from "./profile.module.css"
import { ProfileLoader } from "./ProfileLoader";
import { UserList } from "../../../components/UsersList"
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Profile() {
  const dispatch = useDispatch()
  const userID = useParams();
  const { pathname } = useLocation();
  const { instaUserID, instaTOKEN, instaFollowing } = useSelector((state) => state.Instagram);
  const navigateTO = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [Loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showUserList, setshowUserList] = useState("");
  const headers = { Authorization: `Bearer ${instaTOKEN}` };

  const handleEdit = () => {
    navigateTO('/Accout/setting/edit-profile')
  }

  const handleFollowButtonClick = (e, followingUserID) => {
    e.preventDefault();
    setButtonLoading(true)
    axios.patch(`${BACKEND_URL}users/add-to-following-list/${instaUserID}`, { followingUserID }, { headers }).then((response) => {
      if (response.data.success) {
        toast.success(response.data.msg)
        dispatch(userFollow(followingUserID));
        setButtonLoading(false);
      } else {
        toast.error(response.data.msg);
        setButtonLoading(false);
      }
    }).catch((error) => {
      setButtonLoading(false);
      if (!error.response.data.success) {
        toast.error(error.response.data.msg);
        navigateTO("/user/auth/signin");
        dispatch(UserLoggedOut());
      } else {
        toast.error(`Server error: ${error.message}`);
      }
    })
  }

  const handleUnfollowButtonClick = (e, unfollowUserID) => {
    e.preventDefault();
    setButtonLoading(true)
    axios.patch(`${BACKEND_URL}users/unfollow/${instaUserID}`, { unfollowUserID }, { headers }).then((response) => {
      if (response.data.success) {
        toast.success(response.data.msg)
        dispatch(userUnFollow(unfollowUserID));
        setButtonLoading(false);
      } else {
        toast.error(response.data.msg)
        setButtonLoading(false);
      }
    }).catch((error) => {
      setButtonLoading(false);
      if (!error.response.data.success) {
        toast.error(error.response.data.msg);
        navigateTO("/user/auth/signin");
        dispatch(UserLoggedOut());
      } else {
        toast.error(`Server error: ${error.message}`);
      }
    })
  }


  // load the current USer
  const loadeUserDetails = () => {
    setLoading(true)
    axios.get(`${BACKEND_URL}users/${userID.instaUserID}?currentUser=${instaUserID}`, { headers })
      .then((response) => {
        if (response.data.success) {
          setCurrentUser(response.data.user);
          setLoading(false);
          navigateTO(`/${userID?.instaUserID}/posts`, { state: response.data.user.posts });
        } else {
          navigateTO(`/home`);
          setLoading(false)
        }
      })
      .catch((error) => {
        if (error.response && !error.response.data.success) {
          toast.error(error.response.data.msg);
          navigateTO("/user/auth/signin");
          dispatch(UserLoggedOut());
        } else {
          toast.error(`Server error: ${error.message}`);
        }
        setLoading(false);
      });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadeUserDetails, [userID.instaUserID,showUserList]);


  useEffect(() => {
    if (pathname === `/${userID?.instaUserID}`) {
      navigateTO(`/${userID?.instaUserID}/posts`, { state: currentUser?.posts });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID, pathname]);

  return (
    <>
      <section className={`${profileStyle.dashboard__ProfileSection}`}>
        {
          Loading ? <ProfileLoader /> :
            <>
              <div className={`${profileStyle.dashboard__currentUser__infoContainer}`}>

                <div className={`${profileStyle.infoContainer__userProfile}`}>
                  <img src={currentUser?.userProfile ?? defaultProfile} alt={currentUser?.userName} className={`${profileStyle.userProile}`} onError={(e) => { e.target.src = `${defaultProfile}`; e.onerror = null; }} />
                </div>

                <div className={`${profileStyle.infoContainer__userBox}`}>
                  <h1 className={`${profileStyle.userBox__userName}`}>
                    <span style={{ marginRight: "10px" }}> {currentUser?.userName}</span>
                    {
                      userID.instaUserID === instaUserID ? <button className={`${profileStyle.userBox__editProfileButton}`} onClick={handleEdit} >
                        Edit profile
                      </button> : <>
                        {instaFollowing?.includes(userID.instaUserID) ? (
                          <button className={`${profileStyle.userBox__editProfileButton}`} onClick={(e) => handleUnfollowButtonClick(e, currentUser._id)}  >
                            {
                              buttonLoading ? <img src={loaderImg} alt="loader" className={`${profileStyle.userBox__followButtonLoader}`} /> : "Unfollow"
                            }
                          </button>
                        ) : (
                          <button className={`${profileStyle.userBox__editProfileButton} ${profileStyle.userBox__followButton}`} onClick={(e) => handleFollowButtonClick(e, currentUser._id)}  >
                            {
                              buttonLoading ? <img src={loaderImg} alt="loader" className={`${profileStyle.userBox__followButtonLoader}`} /> : "Follow"
                            }

                          </button>
                        )}
                      </>
                    }
                  </h1>

                  <div className={`${profileStyle.userBox__userActivityState}`}>

                    <span className={`${profileStyle.userBox__activity} ${profileStyle.unactive__activity} ${profileStyle.userBox__postActivity}`}>
                      <strong style={{ fontSize: "22px", marginRight: "5px" }}>
                        {currentUser?.userPostsCount}
                      </strong>
                      posts
                    </span>

                    <span className={`${profileStyle.userBox__activity} ${currentUser?.userFollowers?.length === 0 && `${profileStyle.unactive__activity}`} `} onClick={()=>setshowUserList({
                      userID : userID.instaUserID,
                      type : "Followers"
                    })}>
                      <strong style={{ fontSize: "22px", marginRight: "5px" }}>
                        {currentUser?.userFollowers?.length}
                      </strong>
                      followers
                    </span>

                    <span className={`${profileStyle.userBox__activity}  ${currentUser?.userFollowing?.length === 0 && `${profileStyle.unactive__activity}`}`} onClick={()=>setshowUserList({
                      userID : userID.instaUserID,
                      type : "Following"
                    })}>
                      <strong style={{ fontSize: "22px", marginRight: "5px" }}>
                        {currentUser?.userFollowing?.length}
                      </strong>
                      following
                    </span>

                  </div>

                  <p className={`${profileStyle.userBox__fullName}`}>{currentUser?.fullName}</p>

                  <p className={`${profileStyle.userBox__userBIO}`}>
                    {currentUser?.userBio ? `${currentUser.userBio}` : ""}
                    {
                      currentUser?.website && <a className={`${profileStyle.userBox__websiteLINK}`} target="_blank" rel="noreferrer" href={currentUser?.website}> <PiLinkSimple className={`${profileStyle.userBox__websitelinkICON}`} /> {currentUser?.website.split("/")[2]}</a>
                    }
                  </p>
                </div>

              </div>

              <div className={`${profileStyle.dashboard__currentUser__PostsContainer}`}>
                {
                  (currentUser?.isPrivate && currentUser?._id !== instaUserID && !currentUser?.userFollowers.includes(instaUserID)) ? <div className={`${profileStyle.dashboard__currentUser__PrivateAccount}`}>
                    <img src={lockPng} alt="" className={`${profileStyle.__PrivateAccountPOSTer}`} />
                    <p className={`${profileStyle.__PrivateAccount_primaryMsg}`}>This account is private <span className={`${profileStyle.__PrivateAccount_secondaryMsg}`}>Follow to see their photos and videos.</span></p>
                  </div> :
                    <>
                      <nav className={`${profileStyle.dashboard__postsContainer_navbar}`}>
                        <NavLink
                          to={`/${userID?.instaUserID}/posts`}
                          state={currentUser?.posts}
                          className={({ isActive }) => isActive ? profileStyle.active : profileStyle.PostsContainer__navItem}
                        >
                          <img
                            src={gridICON}
                            alt="UserPost"
                            className={`${profileStyle.postsContainer__navitemICON}`}
                          />
                          <span className={`${profileStyle.postsContainer__navItemTExt}`}>Posts</span>
                        </NavLink>

                        {userID.instaUserID === instaUserID && (
                          <NavLink
                            to={`/${userID?.instaUserID}/saved`}
                            className={({ isActive }) => isActive ? profileStyle.active : profileStyle.PostsContainer__navItem}
                            state={currentUser?.savedPost}
                          >
                            <img src={savedICON} alt="User-saved-Post" className={`${profileStyle.postsContainer__navitemICON}`}
                            />
                            <span className={`${profileStyle.postsContainer__navItemTExt}`}>Saved</span>
                          </NavLink>
                        )}

                      </nav>
                      <div className={`${profileStyle.postsContainer__outLetContainer}`}>
                        <Outlet />
                      </div>

                    </>
                }

              </div>
            </>
        }
      </section>
      {
        showUserList && <UserList ID={showUserList?.userID} CbClose={setshowUserList} popupType={showUserList?.type} />
      }
    </>
  );
}
