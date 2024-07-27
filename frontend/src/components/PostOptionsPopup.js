import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AboutAccount from "./AboutAccount";
import { usePostSave } from "../hooks/usePostSave";
import { useRemoveSavePost } from "../hooks/useRemoveSavePost";
import { useUserFollow } from "../hooks/useUserFollow";
import { useUserUnfollow } from "../hooks/useUserUnfollow";
import { usePostDelete } from "../hooks/usePostDelete";
function PostOptionsPopup({ CbClosePopup, userID, postID }) {
  const { instaUserID, instaSavedPost, instaFollowing, instaFollowers } = useSelector((state) => state.Instagram);
  const { handleRemoveSavePost } = useRemoveSavePost();
  const { handleSavePost } = usePostSave();
  const { handleFollowButtonClick } = useUserFollow();
  const { handleUnfollowButtonClick } = useUserUnfollow();
  const { handleDeletePost } = usePostDelete();
  const navigateTO = useNavigate();
  const [toggleAboutAccount, setToggleAboutAccount] = useState(false);

  // close popup
  const handleClosePopup = (e) => {
    e.preventDefault();
    CbClosePopup(false);
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
            <button
              type="button"
              className="__postOptions_Item"
              onClick={(e) => handleDeletePost(e, postID, userID, CbClosePopup)}
            >
              Delete
            </button>
          )}

          {userID !== instaUserID && (
            <>
              {instaFollowers?.includes(userID) && !instaFollowing?.includes(userID) && (
                <button
                  type="button"
                  className="__postOptions_Item"
                  onClick={(e) => handleFollowButtonClick(e, userID)}
                >
                  Follow Back
                </button>
              )}
              {instaFollowing?.includes(userID) && (
                <button
                  type="button"
                  className="__postOptions_Item __likeListPopup_secondaryButtons"
                  onClick={(e) => handleUnfollowButtonClick(e, userID)}
                >
                  Unfollow
                </button>
              )}
              {!instaFollowers?.includes(userID) && !instaFollowing?.includes(userID) && (
                <button
                  type="button"
                  className="__postOptions_Item"
                  onClick={(e) => handleFollowButtonClick(e, userID)}
                >
                  Follow
                </button>
              )}
            </>
          )}

          {instaSavedPost?.includes(postID) ? (
            <button type="button" className="__postOptions_Item" onClick={(e) => handleRemoveSavePost(e, postID)}>
              Remove from favorites
            </button>
          ) : (
            <button type="button" className="__postOptions_Item" onClick={(e) => handleSavePost(e, postID)}>
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
            Cancel
          </button>
        </article>
      )}

      {toggleAboutAccount && <AboutAccount userID={userID} closePopup={handleClosePopup} />}
    </div>
  );
}
export default React.memo(PostOptionsPopup);
