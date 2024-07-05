import React, { useEffect, useState } from "react";
import cameraICON from "../../../Assets/CameraICON.png";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import profileStyle from "./profile.module.css"
function ProfilePost() {
  const { state } = useLocation();
  const [ownPosts, setOwnPosts] = useState([]);
  const navigateTO = useNavigate();

  const handleShowPostDetails = (e, posts)=>{
    e.preventDefault();
    navigateTO(`/post/${posts?._id}`, { state: posts })
  }

  useEffect(() => {
    setOwnPosts(state.sort((a, b)=>b.postCreatedAt - a.postCreatedAt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${profileStyle.dashboard__profileSection__ProfilePostsContainer} ${ownPosts.length === 0 && `${profileStyle.flexContainer}`}`}>
      <div className={`${profileStyle.profilePostContainer__PostBox}`}>
        <>
          {ownPosts?.length === 0 ? (
            <div  className={`${profileStyle.ProfilePostsContainer__NOpostBox}`}>
              <img src={cameraICON} alt="PostsICON" className={`${profileStyle.noPostICON}`} />
              <h2 className={`${profileStyle.noPost__title}`}>No Posts yet </h2>
            </div>
          ) : (
            <>
              {ownPosts.map((posts, index) => {
                return (
                  <div className={`${profileStyle.profilePostContainer__postCard}`} key={index} onClick={(e)=>handleShowPostDetails(e, posts)} >
                    <img
                      src={posts.postPoster}
                      alt={posts.postPoster}
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

export default ProfilePost;
