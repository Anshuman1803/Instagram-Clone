import React, { useEffect, useState } from "react";
import savedPostICON from "../../../Assets/savedICON.png";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
function ProfileSavedPost() {
  const {state} = useLocation();
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    setSavedPosts(state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`dashboar__profileSection__ProfilePostsContaine ${savedPosts.length === 0 && "flexContainer"}`}>
      <div className="profilePostContainer__PostBox">
      <>
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
              <>
                {savedPosts.map((posts, index) => {
                  return (
                    <div className="profilePostContainer__postCard" key={index}>
                      <img
                        src={posts?.postPoster}
                        alt={posts?.postPoster}
                        className="profilePostContainer__postPoster"
                      />
                      <div className="profilePostcontainer__postInfo">
                        <p className="profilePostContainer_postInfoBox">
                          <FaHeart className="profilePostcontainer__postInfoICON" />
                          {posts?.postLikes}
                        </p>
                        <p className="profilePostContainer_postInfoBox">
                          <FaComment className="profilePostcontainer__postInfoICON" />
                          {posts?.comments?.length}
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

export default ProfileSavedPost;
