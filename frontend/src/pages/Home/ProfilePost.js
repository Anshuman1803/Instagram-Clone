import React, { useState } from "react";
import cameraICON from "../../Assets/CameraICON.png";
function ProfilePost() {
  const [ownPosts, setOwnPosts] = useState([]);
  return (
    <div
      className={`dashboar__profileSection__ProfilePostsContaine ${
        ownPosts.length === 0 && "flexContainer"
      }`}
    >
      {ownPosts.length === 0 ? (
        <div className="ProfilePostsContainer__NOpostBox">
          <img src={cameraICON} alt="PostsICON" className="noPostICON" />
          <h2 className="noPost__title">No Posts yet </h2>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default ProfilePost;
