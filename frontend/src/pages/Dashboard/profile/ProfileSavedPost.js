import React, { useEffect, useState } from "react";
import savedPostICON from "../../../Assets/savedICON.png";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import profileStyle from "./profile.module.css"
function ProfileSavedPost() {
  const { state } = useLocation();
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    setSavedPosts(state)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${profileStyle.dashboard__profileSection__ProfilePostsContainer} ${savedPosts.length === 0 && `${profileStyle.flexContainer}`}`}>
      <div className={`${profileStyle.profilePostContainer__PostBox}`}>
        <>
          {savedPosts?.length === 0 ? (
            <div className={`${profileStyle.ProfilePostsContainer__NOpostBox}`}>
              <img src={savedPostICON} alt="PostsICON" className={`${profileStyle.noPostICON}`} />
              <h2 className={`${profileStyle.noPost__title}`}>Save </h2>
              <p className={`${profileStyle.noPost__secondaryTest}`}>
                Save photos and videos that you want to see again. No one is
                notified, and only you can see what you've saved.{" "}
              </p>
            </div>
          ) : (
            <>
              {savedPosts?.map((posts, index) => {
                return (
                  <div className={`${profileStyle.profilePostContainer__postCard}`} key={index}>
                    <img
                      src={posts?.postPoster}
                      alt={posts?.postPoster}
                      className={`${profileStyle.profilePostContainer__postPoster}`}
                    />
                    <div className={`${profileStyle.profilePostcontainer__postInfo}`}>
                      <p className={`${profileStyle.profilePostContainer_postInfoBox}`}>
                        <FaHeart className={`${profileStyle.profilePostcontainer__postInfoICON}`} />
                        {posts.postLikes}
                      </p>
                      <p className={`${profileStyle.profilePostContainer_postInfoBox}`}>
                        <FaComment className={`${profileStyle.profilePostcontainer__postInfoICON}`} />
                        {posts?.commentCount}
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
