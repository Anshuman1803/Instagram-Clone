import React, { useEffect, useState } from 'react'
import defaultProfile from "../../Assets/DefaultProfile.png";
import { BsThreeDots } from "react-icons/bs";
import { CalculateTimeAgo } from "../../utility/TimeAgo"
import axios from "axios"
import toast from "react-hot-toast"
import PostLoader from "../../components/PostLoader";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
// import { FaHeart } from "react-icons/fa"; // when the user like the post
// import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
export default function Home() {
  const { instaUserID } = useSelector((state) => state.Instagram);
  const [PostLoading, setPostLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);

  const loadAllPosts = () => {
    axios.get(`http://localhost:5000/api/v1/posts/get-all/${instaUserID}`).then((response) => {
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
  useEffect(loadAllPosts, [instaUserID]);

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
      <aside className="homeSection__currentUserContainer">

        <div>

        </div>
      </aside>

    </section>
  )
}

const HomePostCard = ({ posts }) => {
  const { instaUserID, instaProfle, instaUserName } = useSelector((state) => state.Instagram);
  const [newComment, setNewComment] = useState("");
  const navigateTO = useNavigate()

  //! Creating new comments for the post
  const handlePostComment = (e, posts) => {
    e.preventDefault();

    const tempNewComments = {
      postID: posts?._id,
      commentText: newComment,
      userName: instaUserName,
      userID: instaUserID,
      userProfile: instaProfle,
    }

    axios.post(`http://localhost:5000/api/v1/comments/create-new-comments`, tempNewComments).then((response) => {
      if (response.data.success) {
        toast.success(response.data.msg);
        setNewComment('');
      } else {
        toast.error(response.data.msg);
        setNewComment('');
      }
    }).catch((error) => {
      toast.error(`Something went wrong - ${error.message}`);
      setNewComment('');
    })

  }

  const handleShowPostDetails = (e, posts) => {
    e.preventDefault();
    navigateTO(`/posts/${posts._id}`, { state: posts })
  }

  return <article className='HomeSection__homePostCard'>
    <div className='homePostCard_header'>
      <div className='homePostCard__PostOwner'>
        <img src={posts?.userProfile ?? defaultProfile} alt={`${posts?.userName}'s profile`} className='homePostCard__PostOwnerProfile' onError={(e) => { e.target.src = `${defaultProfile}`; e.onerror = null; }} />
        <Link to={`/${posts?.user}`} className='homePostCard__PostOwnerName'>{posts?.userName}</Link>
        <span className='homePostCard__blackDOT'></span>
        <span className='homePostCard__PostDate'><CalculateTimeAgo time={posts?.postCreatedAt} /> </span>
      </div>
      <BsThreeDots className='homePostCard__threeDotOptions' />
    </div>
    <img src={posts?.postPoster} alt={posts?.postCaption} className='homePostCard_PostPoster' />

    <div className='homePostCard__iconButton_Box'>
      <div>
        <FaRegHeart className='homePostCard__iconButton' />
        <FaRegComment className='homePostCard__iconButton' onClick={(e) => handleShowPostDetails(e, posts)} />
        {/* <FaHeart className='homePostCard__iconButton post__LIKEDICONS' /> */}
      </div>
      <div>
        {/* <IoBookmark className='homePostCard__iconButton' /> */}
        <IoBookmarkOutline className='homePostCard__iconButton' />
      </div>

    </div>

    {
      posts?.postLikes !== 0 &&
      <p className='homePostCard__LikeCounter'> <span className='homePostCard__LikeCount'>{posts?.postLikes} </span> {posts?.postLikes > 1 ? 'likes' : 'like'} </p>
    }

    {
      posts?.postCaption &&
      <p className='homePostCard__captionBox'>
        <Link to={`/${posts?.user}`} className='homePostCard__captionBox_userName'>{posts?.userName} </Link>
        <span className='homePostCard__caption'>{posts?.postCaption}</span>
      </p>
    }

    {
      posts?.postComments !== 0 && <Link state={posts} to={`/posts/${posts?._id}`} className='homePostCard__viewAllComment'>
        View all {posts?.postComments} comments
      </Link>
    }

    <div className='homePostCard__createCommentBox'>
      <input type="text" name="newComment" value={newComment} autoComplete='off' className='homePostCard__commentInput' placeholder='Add a comment...' onChange={(e) => setNewComment(e.target.value)} />
      {
        newComment && <button type="button" className='homePostCard__commentPostButton' onClick={(e) => handlePostComment(e, posts)}>Post</button>
      }
    </div>

  </article>
}