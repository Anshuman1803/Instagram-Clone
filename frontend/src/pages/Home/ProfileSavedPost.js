import React, { useEffect, useState } from "react";
import savedPostICON from "../../Assets/savedICON.png";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import PostLoader from "../../components/PostLoader";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
function ProfileSavedPost() {
  const { instaUserID } = useSelector((state) => state.Instagram);
  const [Loading, setLoading] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    setLoading(true)
    axios.get(`http://localhost:5000/api/v1/posts/get-save-post/${instaUserID}`).then((response) => {
      if (response.data.success) {
        setSavedPosts(response.data.savePosts);
        setLoading(false);
      } else {
        setSavedPosts(response.data.savePosts);
        setLoading(false);
      }
    }).catch((error) => {
      toast.error(`Server failed : ${error.message}`);
      setLoading(false);
    })
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
                        src={posts?.post.postPoster}
                        alt={posts?.post.postPoster}
                        className="profilePostContainer__postPoster"
                      />
                      <div className="profilePostcontainer__postInfo">
                        <p className="profilePostContainer_postInfoBox">
                          <FaHeart className="profilePostcontainer__postInfoICON" />
                          {posts?.post.postLikes}
                        </p>
                        <p className="profilePostContainer_postInfoBox">
                          <FaComment className="profilePostcontainer__postInfoICON" />
                          {posts?.post.postComments}
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
