import React, { useState } from "react";
import defaultProfile from "../../../Assets/DefaultProfile.png";
import loaderImg from "../../../Assets/postCommentLoader.gif";
import { BsThreeDots } from "react-icons/bs";
import { CalculateTimeAgo } from "../../../utility/TimeAgo";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserList } from "../../../components/UsersList";
import homeStyle from "./home.module.css";
import PostOptionsPopup from "../../../components/PostOptionsPopup";
import { useLikeUnlike } from "../../../hooks/useLikeUnlike";
import { usePostSave } from "../../../hooks/usePostSave";
import { useRemoveSavePost } from "../../../hooks/useRemoveSavePost";
import {usePostComment} from "../../../hooks/usePostComment";


export const HomePostCard = ({ posts }) => {
  const {instaSavedPost, instaLikes } = useSelector((state) => state.Instagram);
  const {handleLikePostClick,handleUnLikePostClick, buttonLoading, tempLikeCounter} = useLikeUnlike(posts?.postLikes);
  const {tempCommentsCounter, handlePostComment,newComment,setNewComment} = usePostComment(posts?.commentCount)
  const {handleRemoveSavePost} = useRemoveSavePost();
  const {handleSavePost} = usePostSave();
  const [showPopup, setTogglePopup] = useState(false);
  const [showLikeList, setLikeList] = useState("");
  const navigateTO = useNavigate();


  // ! show Details of post
  const handleDetailspostClick = (e, posts) => {
    e.preventDefault();
    navigateTO(`/post/${posts?._id}`, { state: posts });
  };
  
  return (
    <>
      <article className={`${homeStyle.HomeSection__homePostCard}`}>
        <div className={`${homeStyle.homePostCard_header}`}>
          <div className={`${homeStyle.homePostCard__PostOwner}`}>
            <img
              src={posts?.userProfile ?? defaultProfile}
              alt={`${posts?.userName}'s profile`}
              className={`${homeStyle.homePostCard__PostOwnerProfile}`}
              onError={(e) => {
                e.target.src = `${defaultProfile}`;
                e.onerror = null;
              }}
            />
            <Link to={`/${posts?.user}`} className={`${homeStyle.homePostCard__PostOwnerName}`}>
              {posts?.userName}
            </Link>
            <span className={`${homeStyle.homePostCard__blackDOT}`}></span>
            <span className={`${homeStyle.homePostCard__PostDate}`}>
              <CalculateTimeAgo time={posts?.postCreatedAt} />
            </span>
          </div>
          <BsThreeDots className={`${homeStyle.homePostCard__threeDotOptions}`} onClick={(e) => setTogglePopup(true)} />
        </div>
        <img src={posts?.postPoster} alt={posts?.postCaption} className={`${homeStyle.homePostCard_PostPoster}`} />

        <div className={`${homeStyle.homePostCard__iconButton_Box}`}>
          <div>
            {instaLikes?.includes(posts?._id) ? (
              <span>
                {buttonLoading && (
                  <img src={loaderImg} alt="" className={`${homeStyle.homePostCard__iconButtonLoader}`} />
                )}
                <FaHeart
                  className={`${homeStyle.homePostCard__iconButton} post__LIKEDICONS`}
                  onClick={(e) => handleUnLikePostClick(e, posts?._id)}
                />
              </span>
            ) : (
              <span>
                {buttonLoading && (
                  <img src={loaderImg} alt="" className={`${homeStyle.homePostCard__iconButtonLoader}`} />
                )}
                <FaRegHeart
                  className={`${homeStyle.homePostCard__iconButton}`}
                  onClick={(e) => handleLikePostClick(e, posts?._id, posts?.user)}
                />
              </span>
            )}
            <FaRegComment
              className={`${homeStyle.homePostCard__iconButton}`}
              onClick={(e) => handleDetailspostClick(e, posts)}
            />
          </div>
          <div>
            {instaSavedPost?.includes(posts?._id) ? (
              <IoBookmark
                className={`${homeStyle.homePostCard__iconButton}`}
                onClick={(e) => handleRemoveSavePost(e, posts?._id)}
              />
            ) : (
              <IoBookmarkOutline
                className={`${homeStyle.homePostCard__iconButton}`}
                onClick={(e) => handleSavePost(e, posts?._id)}
              />
            )}
          </div>
        </div>

        {tempLikeCounter !== 0 && (
          <p className={`${homeStyle.homePostCard__LikeCounter}`} onClick={() => setLikeList(posts?._id)}>
            <span className={`${homeStyle.homePostCard__LikeCount}`}>{tempLikeCounter}</span>
            {tempLikeCounter > 1 ? "likes" : "like"}
          </p>
        )}

        {posts?.postCaption && (
          <p className={`${homeStyle.homePostCard__captionBox}`}>
            <Link to={`/${posts?.user}`} className={`${homeStyle.homePostCard__captionBox_userName}`}>
              {posts?.userName}
            </Link>
            <span className={`${homeStyle.homePostCard__caption}`}>{posts?.postCaption}</span>
          </p>
        )}

        {tempCommentsCounter !== 0 && (
          <span
            className={`${homeStyle.homePostCard__viewAllComment}`}
            onClick={(e) => handleDetailspostClick(e, posts)}
          >
            View all {tempCommentsCounter} {tempCommentsCounter > 1 ? "comments" : "comment"}
          </span>
        )}

        <div className={`${homeStyle.homePostCard__createCommentBox}`}>
          <input
            type="text"
            name="newComment"
            value={newComment}
            autoComplete="off"
            className={`${homeStyle.homePostCard__commentInput}`}
            placeholder="Add a comment..."
            onChange={(e) => setNewComment(e.target.value)}
          />
          {newComment && (
            <button
              type="button"
              className={`${homeStyle.homePostCard__commentPostButton}`}
              onClick={(e) => handlePostComment(e, posts)}
            >
              Post
            </button>
          )}
        </div>
      </article>
      {showLikeList && <UserList ID={showLikeList} CbClose={setLikeList} popupType={"Likes"} />}
      {showPopup && <PostOptionsPopup userID={posts?.user} CbClosePopup={setTogglePopup} postID={posts?._id} />}
    </>
  );
};
