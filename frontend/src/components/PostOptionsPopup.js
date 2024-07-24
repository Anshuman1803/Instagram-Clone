import React from "react";
import { useSelector } from "react-redux";
function PostOptionsPopup({ CbClosePopup, userID, postID }) {
  const { instaUserID, instaSavedPost, instaFollowing, instaFollowers } = useSelector((state) => state.Instagram);

  const handleClosePopup = (e) => {
    e.preventDefault();
    CbClosePopup(false);
  };
  return (
    <div className="__postOptionsContainer">
      <article className="__postOptions_Box">
        {userID === instaUserID && (
          <button type="button" className="__postOptions_Item">
            Delete
          </button>
        )}

        {userID !== instaUserID && (
          <>
            {instaFollowers?.includes(userID) && !instaFollowing?.includes(userID) && (
              <button className="__postOptions_Item">Follow Back</button>
            )}
            {instaFollowing?.includes(userID) && (
              <button className="__postOptions_Item __likeListPopup_secondaryButtons">Unfollow</button>
            )}
            {!instaFollowers?.includes(userID) && !instaFollowing?.includes(userID) && (
              <button className="__postOptions_Item">Follow</button>
            )}
          </>
        )}
        {instaSavedPost?.includes(postID) ? (
          <button type="button" className="__postOptions_Item">
            Remove from favorites
          </button>
        ) : (
          <button type="button" className="__postOptions_Item">
            Add to favorites
          </button>
        )}

        <button type="button" className="__postOptions_Item">
          About this account
        </button>
        <button type="button" onClick={handleClosePopup} className="__postOptions_Item">
          Cancle
        </button>
      </article>
    </div>
  );
}
export default React.memo(PostOptionsPopup);
