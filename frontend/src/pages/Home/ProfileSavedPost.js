import React, { useState } from "react";
import savedPostICON from "../../Assets/savedICON.png";
function ProfileSavedPost() {
  const [savedPosts, setSavedPosts] = useState([]);
  return (
    <div className={`dashboar__profileSection__ProfilePostsContaine ${savedPosts.length === 0 && "flexContainer"}`}>
      {savedPosts.length === 0 ? (
        <div className="ProfilePostsContainer__NOpostBox">
          <img src={savedPostICON} alt="PostsICON" className="noPostICON" />
          <h2 className="noPost__title">Save </h2>
          <p className="noPost__secondaryTest">
            Save photos and videos that you want to see again. No one is
            notified, and only you can see what you've saved.{" "}
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ProfileSavedPost;
