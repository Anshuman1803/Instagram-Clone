import React, { useEffect, useState } from "react";
import savedPostICON from "../../Assets/savedICON.png";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut } from '../../Redux/ReduxSlice';
import axios from "axios";
import toast from "react-hot-toast";
import PostLoader from "../../components/PostLoader";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
function ProfileSavedPost() {
  const { instaUserID, instaTOKEN } = useSelector((state) => state.Instagram);
  const [Loading, setLoading] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const navigateTO = useNavigate();
  const dispatch = useDispatch()
  const headers = {
    Authorization: `Bearer ${instaTOKEN}`
  };
  useEffect(() => {
    setLoading(true)
    axios.get(`http://localhost:5000/api/v1/posts/get-save-post/${instaUserID}`, { headers }).then((response) => {
      if (response.data.success) {
        setSavedPosts(response.data.savePosts);
        setLoading(false);
      } else {
        setSavedPosts(response.data.savePosts);
        setLoading(false);
      }
    }).catch((error) => {
      if (error.response && !error.response.data.success) {
        toast.error(error.response.data.msg);
        navigateTO("/user/auth/signin")
        dispatch(UserLoggedOut());
      } else {
        toast.error(`Server error: ${error.message}`);
      }
      setLoading(false);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instaUserID]);

  return (
    <div className={`dashboar__profileSection__ProfilePostsContaine ${savedPosts.length === 0 && "flexContainer"}`}>
      <div className="profilePostContainer__PostBox">
        {
          Loading ? <PostLoader /> : <>
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
                          {posts?.postComments}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>
        }
      </div>
    </div>
  );
}

export default ProfileSavedPost;
