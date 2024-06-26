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
export const HomePostCard = ({ posts }) => {
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
    const handleDetailspostClick = (e, posts) => {
        e.preventDefault();
        navigateTO(`/post/${posts?._id}`, { state: posts })
    }

    //! Creating new comments for the post
    const handlePostComment = (e, posts) => {
        e.preventDefault();

        const tempNewComments = {
            postID: posts?._id,
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
                            src={posts?.userProfile ?? defaultProfile}
                            alt={`${posts?.userName}'s profile`}
                            className={`${homeStyle.homePostCard__PostOwnerProfile}`}
                            onError={(e) => {
                                e.target.src = `${defaultProfile}`;
                                e.onerror = null;
                            }}
                        />
                        <Link
                            to={`/${posts?.user}`}
                            className={`${homeStyle.homePostCard__PostOwnerName}`}
                        >
                            {posts?.userName}
                        </Link>
                        <span className={`${homeStyle.homePostCard__blackDOT}`}></span>
                        <span className={`${homeStyle.homePostCard__PostDate}`}>
                            <CalculateTimeAgo time={posts?.postCreatedAt} />
                        </span>
                    </div>
                    <BsThreeDots className={`${homeStyle.homePostCard__threeDotOptions}`} />
                </div>
                <img
                    src={posts?.postPoster}
                    alt={posts?.postCaption}
                    className={`${homeStyle.homePostCard_PostPoster}`}
                />

                <div className={`${homeStyle.homePostCard__iconButton_Box}`}>
                    <div>
                        <FaRegHeart className={`${homeStyle.homePostCard__iconButton}`} />
                        <FaRegComment className={`${homeStyle.homePostCard__iconButton}`} onClick={(e) => handleDetailspostClick(e,posts )} />
                        {/* <FaHeart className={`${homeStyle.homePostCard__iconButton} post__LIKEDICONS` }  /> */}
                    </div>
                    <div>
                        {instaSavedPost?.includes(posts?._id) ? (
                            <IoBookmark className={`${homeStyle.homePostCard__iconButton}`} onClick={(e) => handleRemoveSavePost(e, posts?._id)} />
                        ) : (
                            <IoBookmarkOutline
                                className={`${homeStyle.homePostCard__iconButton}`}
                                onClick={(e) => handleSavePost(e, posts?._id)}
                            />
                        )}
                    </div>
                </div>

                {posts?.postLikes !== 0 && (
                    <p className={`${homeStyle.homePostCard__LikeCounter}`}>

                        <span className={`${homeStyle.homePostCard__LikeCount}`}>
                            {posts?.postLikes}
                        </span>
                        {posts?.postLikes > 1 ? "likes" : "like"}
                    </p>
                )}

                {posts?.postCaption && (
                    <p className={`${homeStyle.homePostCard__captionBox}`}>
                        <Link
                            to={`/${posts?.user}`}
                            className={`${homeStyle.homePostCard__captionBox_userName}`}
                        >
                            {posts?.userName}
                        </Link>
                        <span className={`${homeStyle.homePostCard__caption}`}>{posts?.postCaption}</span>
                    </p>
                )}

                {posts?.commentCount !== 0 && (
                    <span className={`${homeStyle.homePostCard__viewAllComment}`}>
                        View all {posts?.commentCount} comments
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
        </>
    );
};