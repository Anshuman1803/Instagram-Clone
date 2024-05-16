import React, { useEffect, useState } from 'react'
import defaultProfile from "../../Assets/DefaultProfile.png";
import { BsThreeDots } from "react-icons/bs";
import { CalculateTimeAgo } from "../../utility/TimeAgo"
import axios from "axios"
import toast from "react-hot-toast"
import PostLoader from "../../components/PostLoader";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa"; // when the user like the post
import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
export default function Home() {
  const [PostLoading, setPostLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);

  const loadAllPosts = () => {
    axios.get("http://localhost:5000/api/v1/posts/get-all").then((response) => {
      if (response.data.success) {
        setAllPosts(response.data.posts.sort((a, b) => b.postCreatedAt - a.postCreatedAt));
        setPostLoading(false)
      } else {
        setAllPosts(response.data.posts);
        setPostLoading(false)
      }
    }).catch((error) => {
      toast.error(`Server error : ${error.message}`);
      setPostLoading(false)
    })
  }

  useEffect(loadAllPosts, [])
  return (
    <section className="dashboard__homeSection">
      <div className="homeSection__ShowPostContainer">
        {
          PostLoading ? <PostLoader /> : <>
            {
              allPosts.map((posts) => {
                return <HomePostCard key={posts._id} posts={posts} />
              })
            }
          </>
        }
      </div>
      <div className="homeSection__currentUserContainer">

      </div>

    </section>
  )
}

const HomePostCard = ({ posts }) => {
  return <article className='HomeSection__homePostCard'>
    <div className='homePostCard_header'>
      <div className='homePostCard__PostOwner'>
        <img src={posts?.userProfile ?? defaultProfile} alt={`${posts?.userName}'s profile`} className='homePostCard__PostOwnerProfile' onError={(e) => { e.target.src = `${defaultProfile}`; e.onerror = null; }} />
        <p className='homePostCard__PostOwnerName'>{posts?.userName}</p>
        <span className='homePostCard__blackDOT'></span>
        <span className='homePostCard__PostDate'><CalculateTimeAgo time={posts?.postCreatedAt} /> </span>
      </div>
      <BsThreeDots className='homePostCard__threeDotOptions' />
    </div>
    <img src={posts?.postPoster} alt={posts?.postCaption} className='homePostCard_PostPoster' />

    <div className='homePostCard__iconButton_Box'>
      <div>
        <FaRegHeart className='homePostCard__iconButton' />
        <FaRegComment className='homePostCard__iconButton' />
        {/* <FaHeart className='homePostCard__iconButton post__LIKEDICONS' /> */}
      </div>
      <div>
        {/* <IoBookmark className='homePostCard__iconButton' /> */}
        <IoBookmarkOutline className='homePostCard__iconButton' />
      </div>

    </div>

    {
        //  posts?.postLikes > 0 && 
   <p className='homePostCard__LikeCounter'> <span className='homePostCard__LikeCount'>{posts?.postLikes} </span> {posts?.postLikes > 1 ? 'likes' : 'like'} </p>

    }

    {
      //  posts?.postCaption &&
      <p className='homePostCard__captionBox'>
        <Link className='homePostCard__captionBox_userName'>{posts?.userName} </Link>
        <span className='homePostCard__caption'>{posts?.postCaption}</span>
      </p>
    }
    <span className='homePostCard__viewAllComment'>
      View all {posts?.postComments} comments
    </span>

  </article>
}