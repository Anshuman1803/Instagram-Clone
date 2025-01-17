
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from "react-hot-toast";
import { FaComment } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut } from "../../../Redux/ReduxSlice";
import ExploreLoader from './ExploreLoader';
import exploreStyle from './explore.module.css'
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Explore() {
  const { instaTOKEN, instaUserID } = useSelector((state) => state.Instagram);
  const headers = { Authorization: `Bearer ${instaTOKEN}` };
  const [ExplorePost, setExplorePosts] = useState([]);
  const [postLoading, setloading] = useState(false)
  const dispatch = useDispatch();
  const navigateTO = useNavigate();

  const handleShowPostDetails = (e, posts)=>{
    e.preventDefault();
    navigateTO(`/post/${posts?._id}`, { state: posts })
  }

  useEffect(() => {
    setloading(true)
    axios.get(`${BACKEND_URL}posts/get-explore-posts/${instaUserID}`, { headers }).then((response) => {
      if (response.data.success) {
        setExplorePosts(response.data.posts);
        setloading(false)
      } else {
        setExplorePosts(response.data.posts);
        setloading(false)
      }
    }).catch((error) => {
      setloading(false)
      if (error.response.status === 401) {
        dispatch(UserLoggedOut());
         navigateTO("/user/auth/signin")
        toast.error("Your session has expired. Please login again.");
      } else {
        toast.error(`Server error: ${error.message}`);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <section className={`${exploreStyle.__ExploreContainer}`}>
      {
        postLoading ? <ExploreLoader /> : <>
          {
            ExplorePost.length === 0 ? <p> No Posts</p> : <>
              {
                ExplorePost.map((posts) => {
                  return <div onClick={(e)=>handleShowPostDetails(e, posts)} className={`${exploreStyle.__ExplorePostCard}`} key={posts?._id}>
                    <img src={posts?.postPoster} alt={posts?.postCaption} className={`${exploreStyle.__ExplorePostCard_postPoster}`} loading="lazy" />
                    <div className={`${exploreStyle.__ExplorePostCard__postInfo}`}>
                      <p className={`${exploreStyle.__ExplorePostCard_postInfoBox}`}>
                        <FaHeart className={`${exploreStyle.__ExplorePostCard__postInfoICON}`} />
                        {posts?.postLikes}
                      </p>
                      <p className={`${exploreStyle.__ExplorePostCard_postInfoBox}`}>
                        <FaComment className={`${exploreStyle.__ExplorePostCard__postInfoICON}`} />
                        {posts.commentCount}
                      </p>
                    </div>
                  </div>
                })
              }
            </>
          }
        </>
      }
    </section>
  )
}
