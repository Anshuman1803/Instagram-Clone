import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userFollow, UserLoggedOut, userRemoveSavePost, userSavePost, userUnFollow } from "../Redux/ReduxSlice";
import AboutAccount from "./AboutAccount";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function PostOptionsPopup({ CbClosePopup, userID, postID }) {
  const { instaTOKEN, instaUserID, instaSavedPost, instaFollowing, instaFollowers } = useSelector(
    (state) => state.Instagram
  );
  const headers = { Authorization: `Bearer ${instaTOKEN}` };
  const dispatch = useDispatch();
  const navigateTO = useNavigate();
  const [toggleAboutAccount, setToggleAboutAccount] = useState(false);

  // close popup
  const handleClosePopup = (e) => {
    e.preventDefault();
    CbClosePopup(false);
  };
  // Saving the post
  const handleSavePost = (e) => {
    e.preventDefault();
    axios
      .patch(`${BACKEND_URL}posts/save-post/${postID}`, { instaUserID }, { headers })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.msg);
          dispatch(userSavePost(postID));
        } else {
          toast.error(response.data.msg);
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
      });
  };

  // Removing Saving the post
  const handleRemoveSavePost = (e) => {
    e.preventDefault();
    axios
      .patch(`${BACKEND_URL}posts/delete/save-post/${postID}`, { instaUserID }, { headers })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.msg);
          dispatch(userRemoveSavePost(postID));
        } else {
          toast.error(response.data.msg);
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
      });
  };

  //   Follow user
  const handleFollowButtonClick = (e) => {
    e.preventDefault();
    axios
      .patch(`${BACKEND_URL}users/add-to-following-list/${instaUserID}`, { followingUserID: userID }, { headers })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.msg);
          dispatch(userFollow(userID));
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          toast.error(error.response.data.msg);
          navigateTO("/user/auth/signin");
          dispatch(UserLoggedOut());
        } else {
          toast.error(`Server error: ${error.message}`);
        }
      });
  };

  //   UnFollow user
  const handleUnfollowButtonClick = (e) => {
    e.preventDefault();
    axios
      .patch(`${BACKEND_URL}users/unfollow/${instaUserID}`, { unfollowUserID: userID }, { headers })
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.msg);
          dispatch(userUnFollow(userID));
        } else {
          toast.error(response.data.msg);
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          toast.error(error.response.data.msg);
          navigateTO("/user/auth/signin");
          dispatch(UserLoggedOut());
        } else {
          toast.error(`Server error: ${error.message}`);
        }
      });
  };

  //   go to profile
  const handleGoToProfile = (e) => {
    e.preventDefault();
    navigateTO(`/${userID}`);
  };
  //   show about account
  const handleAboutAccount = (e) => {
    e.preventDefault();
    setToggleAboutAccount(true);
  };

  return (
    <div className="__postOptionsContainer">
      {!toggleAboutAccount && (
        <article className="__postOptions_Box">
          {userID === instaUserID && (
            <button type="button" className="__postOptions_Item">
              Delete
            </button>
          )}

          {userID !== instaUserID && (
            <>
              {instaFollowers?.includes(userID) && !instaFollowing?.includes(userID) && (
                <button type="button" className="__postOptions_Item" onClick={handleFollowButtonClick}>
                  Follow Back
                </button>
              )}
              {instaFollowing?.includes(userID) && (
                <button
                  type="button"
                  className="__postOptions_Item __likeListPopup_secondaryButtons"
                  onClick={handleUnfollowButtonClick}
                >
                  Unfollow
                </button>
              )}
              {!instaFollowers?.includes(userID) && !instaFollowing?.includes(userID) && (
                <button type="button" className="__postOptions_Item" onClick={handleFollowButtonClick}>
                  Follow
                </button>
              )}
            </>
          )}
          {instaSavedPost?.includes(postID) ? (
            <button type="button" className="__postOptions_Item" onClick={handleRemoveSavePost}>
              Remove from favorites
            </button>
          ) : (
            <button type="button" className="__postOptions_Item" onClick={handleSavePost}>
              Add to favorites
            </button>
          )}

          <button type="button" className="__postOptions_Item" onClick={handleAboutAccount}>
            About this account
          </button>

          <button type="button" className="__postOptions_Item" onClick={handleGoToProfile}>
            Go to profile
          </button>

          <button type="button" onClick={handleClosePopup} className="__postOptions_Item">
            Cancle
          </button>
        </article>
      )}

      {toggleAboutAccount && <AboutAccount userID={userID} closePopup={handleClosePopup} />}
    </div>
  );
}
export default React.memo(PostOptionsPopup);
