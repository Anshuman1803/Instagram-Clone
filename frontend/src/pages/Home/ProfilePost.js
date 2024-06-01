import React, { useEffect, useState } from "react";
import cameraICON from "../../Assets/CameraICON.png";
import axios from "axios";
import PostLoader from "../../components/PostLoader";
import toast from "react-hot-toast";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut } from '../../Redux/ReduxSlice';
function ProfilePost() {
  const navigateTO = useNavigate();
  const { instaUserID } = useParams();
  const [ownPosts, setOwnPosts] = useState([]);
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  const { instaTOKEN } = useSelector((state) => state.Instagram);

  const headers = {
    Authorization: `Bearer ${instaTOKEN}`
  };
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/v1/posts/post/${instaUserID}`, { headers })
      .then((response) => {
        setOwnPosts(response.data.posts.sort((a, b) => b.postCreatedAt - a.postCreatedAt));
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && !error.response.data.success) {
          toast.error(error.response.data.msg);
          navigateTO("/user/auth/signin")
          dispatch(UserLoggedOut());
        } else {
          toast.error(`Server error: ${error.message}`);
        }
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instaUserID]);

  return (
    <div className={`dashboard__profileSection__ProfilePostsContainer ${ownPosts.length === 0 && "flexContainer"}`}>
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
