import React, { useState } from "react";
import defaultProfile from "../../../Assets/DefaultProfile.png";
import { BsThreeDots } from "react-icons/bs";
import { CalculateTimeAgo } from "../../../utility/TimeAgo";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
// import { FaHeart } from "react-icons/fa"; // when the user like the post
import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut, userSavePost, userRemoveSavePost } from "../../../Redux/ReduxSlice";

import homeStyle from "./home.module.css"
export const HomePostCard = ({ postDetails }) => {
    const { instaUserID, instaTOKEN, instaSavedPost } = useSelector(
        (state) => state.Instagram
    );
    const [newComment, setNewComment] = useState("");
    const dispatch = useDispatch();
    const navigateTO = useNavigate();
    const headers = {
        Authorization: `Bearer ${instaTOKEN}`,
    };

    // ! show Details of post
    const handleDetailspostClick = (e, postDetails) => {
        e.preventDefault();
        navigateTO(`/post/${postDetails.posts?._id}`, { state: postDetails })
    }

    //! Creating new comments for the post
    const handlePostComment = (e, postData) => {
        e.preventDefault();

        const tempNewComments = {
            postID: postData?.posts?._id,
            commentText: newComment,
            userID: instaUserID,
        };

        axios
            .post(
                `http://localhost:5000/api/v1/comments/create-new-comments`,
                tempNewComments,
                { headers }
            )
            .then((response) => {
                if (response.data.success) {
                    toast.success(response.data.msg);
                    setNewComment("");
                } else {
                    toast.error(response.data.msg);
                    setNewComment("");
                }
            })
            .catch((error) => {
                if (error.response && !error.response.data.success) {
                    toast.error(error.response.data.msg);
                    navigateTO("/user/auth/signin");
                    dispatch(UserLoggedOut());
                } else {
                    toast.error(`Server error: ${error.message}`);
                }
                setNewComment("");
            });
    };

    // Saving the post
    const handleSavePost = (e, postID) => {
        e.preventDefault();
        axios
            .patch(
                `http://localhost:5000/api/v1/posts/save-post/${postID}`,
                { instaUserID },
                { headers }
            )
            .then((response) => {
                if (response.data.success) {
                    toast.success(response.data.msg);
                    dispatch(userSavePost(postID))
                } else {
                    toast.error(response.data.msg);
                }
            })
            .catch((error) => {
                if (error.response && !error.response.data.success) {
                    toast.error(error.response.data.msg);
                    navigateTO("/user/auth/signin");
                    dispatch(UserLoggedOut());
                } else {
                    toast.error(`Server error: ${error.message}`);
                }
            });
    };

    // Removing Saving the post
    const handleRemoveSavePost = (e, postID) => {
        e.preventDefault();
        axios
            .patch(
                `http://localhost:5000/api/v1/posts/delete/save-post/${postID}`,
                { instaUserID },
                { headers }
            )
            .then((response) => {
                if (response.data.success) {
                    toast.success(response.data.msg);
                    dispatch(userRemoveSavePost(postID))
                } else {
                    toast.error(response.data.msg);
                }
            })
            .catch((error) => {
                if (error.response && !error.response.data.success) {
                    toast.error(error.response.data.msg);
                    navigateTO("/user/auth/signin");
                    dispatch(UserLoggedOut());
                } else {
                    toast.error(`Server error: ${error.message}`);
                }
            });
    }

    return (
        <>
            <article className={`${homeStyle.HomeSection__homePostCard}`}>
                <div className={`${homeStyle.homePostCard_header}`}>
                    <div className={`${homeStyle.homePostCard__PostOwner}`}>
                        <img
                            src={postDetails?.userProfile ?? defaultProfile}
                            alt={`${postDetails?.userName}'s profile`}
                            className={`${homeStyle.homePostCard__PostOwnerProfile}`}
                            onError={(e) => {
                                e.target.src = `${defaultProfile}`;
                                e.onerror = null;
                            }}
                        />
                        <Link
                            to={`/${postDetails?._id}`}
                            className={`${homeStyle.homePostCard__PostOwnerName}`}
                        >
                            {postDetails?.userName}
                        </Link>
                        <span className={`${homeStyle.homePostCard__blackDOT}`}></span>
                        <span className={`${homeStyle.homePostCard__PostDate}`}>
                            <CalculateTimeAgo time={postDetails?.posts?.postCreatedAt} />
                        </span>
                    </div>
                    <BsThreeDots className={`${homeStyle.homePostCard__threeDotOptions}`} />
                </div>
                <img
                    src={postDetails?.posts?.postPoster}
                    alt={postDetails?.posts?.postCaption}
                    className={`${homeStyle.homePostCard_PostPoster}`}
                />

                <div className={`${homeStyle.homePostCard__iconButton_Box}`}>
                    <div>
                        <FaRegHeart className={`${homeStyle.homePostCard__iconButton}`} />
                        <FaRegComment className={`${homeStyle.homePostCard__iconButton}`} onClick={(e) => handleDetailspostClick(e,postDetails )} />
                        {/* <FaHeart className={`${homeStyle.homePostCard__iconButton} post__LIKEDICONS` }  /> */}
                    </div>
                    <div>
                        {instaSavedPost?.includes(postDetails?.posts?._id) ? (
                            <IoBookmark className={`${homeStyle.homePostCard__iconButton}`} onClick={(e) => handleRemoveSavePost(e, postDetails?.posts?._id)} />
                        ) : (
                            <IoBookmarkOutline
                                className={`${homeStyle.homePostCard__iconButton}`}
                                onClick={(e) => handleSavePost(e, postDetails?.posts?._id)}
                            />
                        )}
                    </div>
                </div>

                {postDetails?.posts?.postLikes !== 0 && (
                    <p className={`${homeStyle.homePostCard__LikeCounter}`}>

                        <span className={`${homeStyle.homePostCard__LikeCount}`}>
                            {postDetails?.posts?.postLikes}
                        </span>
                        {postDetails?.posts?.postLikes > 1 ? "likes" : "like"}
                    </p>
                )}

                {postDetails?.posts?.postCaption && (
                    <p className={`${homeStyle.homePostCard__captionBox}`}>
                        <Link
                            to={`/${postDetails?.user}`}
                            className={`${homeStyle.homePostCard__captionBox_userName}`}
                        >
                            {postDetails?.userName}
                        </Link>
                        <span className={`${homeStyle.homePostCard__caption}`}>{postDetails?.posts?.postCaption}</span>
                    </p>
                )}

                {postDetails?.posts?.commentCount !== 0 && (
                    <span className={`${homeStyle.homePostCard__viewAllComment}`}>
                        View all {postDetails?.posts?.commentCount} comments
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
                            onClick={(e) => handlePostComment(e, postDetails)}
                        >
                            Post
                        </button>
                    )}
                </div>
            </article>
        </>
    );
};