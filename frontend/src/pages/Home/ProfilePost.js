import React, { useEffect, useState } from "react";
import cameraICON from "../../Assets/CameraICON.png";
import axios from "axios";
import PostLoader from "../../components/PostLoader";
import toast from "react-hot-toast";
import { FaComment } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { useNavigate, useParams } from "react-router-dom";
function ProfilePost() {

  const { instaUserID } = useParams();
  const [ownPosts, setOwnPosts] = useState([]);
  const [Loading, setLoading] = useState(false);
  const navigateTO = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/v1/posts/post/${instaUserID}`)
      .then((response) => {
        setOwnPosts(response.data.posts);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(`${error.message}`);
        setLoading(false);
      });
  }, [instaUserID]);

  const handleShowPostDetails = (e, posts)=> {
    e.preventDefault();
    navigateTO(`/posts/${posts._id}`, {state : posts})
  }

  return (
    <div
      className={`dashboar__profileSection__ProfilePostsContaine ${ownPosts.length === 0 && "flexContainer"
        }`}
    >
      <div className="profilePostContainer__PostBox">
        {Loading ? (
          <PostLoader />
        ) : (
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
                    <div onClick={(e)=>handleShowPostDetails(e, posts)} className="profilePostContainer__postCard" key={index}>
                      <img
                        src={posts.postPoster}
                        alt={posts.postPoster}
                        className="profilePostContainer__postPoster"
                      />

                      <div className="profilePostcontainer__postInfo">
                        <p className="profilePostContainer_postInfoBox">
                          <CiHeart className="profilePostcontainer__postInfoICON" />
                          {posts.postLikes}
                        </p>
                        <p className="profilePostContainer_postInfoBox">
                          <FaComment className="profilePostcontainer__postInfoICON" />
                          {posts.postComments}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePost;