import React, { useEffect, useState } from "react";
import cameraICON from "../../../Assets/CameraICON.png";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
function ProfilePost() {
  const { state } = useLocation();
  const [ownPosts, setOwnPosts] = useState([]);

  useEffect(() => {
    setOwnPosts(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`dashboard__profileSection__ProfilePostsContainer ${ownPosts.length === 0 && "flexContainer"}`}>
      <div className="profilePostContainer__PostBox">
        <>
          {ownPosts.length === 0 ? (
            <div className="ProfilePostsContainer__NOpostBox">
              <img src={cameraICON} alt="PostsICON" className="noPostICON" />
              <h2 className="noPost__title">No Posts yet </h2>
            </div>
          ) : (
            <>
              {ownPosts.map((posts, index) => {
                return (
                  <div className="profilePostContainer__postCard" key={index}>
                    <img
                      src={posts.postPoster}
                      alt={posts.postPoster}
                      className="profilePostContainer__postPoster"
                    />
                    <div className="profilePostcontainer__postInfo">
                      <p className="profilePostContainer_postInfoBox">
                        <FaHeart className="profilePostcontainer__postInfoICON" />
                        {posts.postLikes}
                      </p>
                      <p className="profilePostContainer_postInfoBox">
                        <FaComment className="profilePostcontainer__postInfoICON" />
                        {posts.comments.length}
                      </p>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </>
      </div>
    </div>
  );
}

export default ProfilePost;
