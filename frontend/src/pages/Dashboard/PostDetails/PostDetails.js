import React, { useEffect, useRef, useState } from "react";
import postDetailsStyle from "./postdetails.module.css";
import defaultProfile from "../../../Assets/DefaultProfile.png";
import postCommentLoader from "../../../Assets/postCommentLoader.gif";
import { IoArrowBackSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { CalculateTimeAgo } from "../../../utility/TimeAgo";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
// import { FaHeart } from "react-icons/fa"; // when the user like the post
import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut, userSavePost, userRemoveSavePost, } from "../../../Redux/ReduxSlice";
import { CommentsLoader } from "./CommentsLoader";
import { PostDetailsPopup } from "./PostDetailsPopup";
function PostDetails() {
  const { instaUserID, instaTOKEN, instaSavedPost } = useSelector((state) => state.Instagram);
  const { state } = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigateTO = useNavigate();
  const inputRef = useRef();
  const [showPopup, setTogglePopup] = useState(false);
  const headers = { Authorization: `Bearer ${instaTOKEN}` };
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [allCommentsLoader, setallCommentsLoader] = useState(false);
  const [postCommentLoading, setcommentLoader] = useState(false);

  const handleCloseButtonClick = (e) => {
    e.preventDefault();
    window.history.back();
  };

  // handle delete comment
  const handleDeleteComment = (e, commentId) => {
    setallCommentsLoader(true);
    e.preventDefault();
    axios
      .delete(
        `http://localhost:5000/api/v1/comments/delete-comment/${commentId}`,
        { headers }
      )
      .then((response) => {
        if (response.data.success) {
          toast.error(response.data.msg);
          loadNewComments();
        } else {
          toast.error(response.data.msg);
          loadNewComments();
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
          dispatch(userSavePost(postID));
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
          dispatch(userRemoveSavePost(postID));
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

  //! Creating new comments for the post
  const handlePostComment = (e, posts) => {
    e.preventDefault();
    setcommentLoader(true);
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
        inputRef.current.focus();
        if (response.data.success) {
          toast.success(response.data.msg);
          setNewComment("");
          setcommentLoader(false);
          loadNewComments();
        } else {
          toast.error(response.data.msg);
          setNewComment("");
          setcommentLoader(false);
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
        setcommentLoader(false);
      });
  };

  // load all new comments of current post
  const loadNewComments = () => {
    axios
      .get(`http://localhost:5000/api/v1/comments/get-all-comments/${id}`, {
        headers,
      })
      .then((response) => {
        if (response.data.success) {
          setAllComments(response.data.comments);
          setallCommentsLoader(false);
        } else {
          setAllComments(response.data.comments);
          setallCommentsLoader(false);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadNewComments, [id]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className={`${postDetailsStyle.__PostDetails__Container}`}>
      <div className={`${postDetailsStyle.__PostDetails__box}`}>
        <div className={`${postDetailsStyle.__PostDetails__Posterbox}`}>
          <img
            src={state?.postPoster}
            alt={`${state?.user.userName}'s post `}
            loading="lazy"
            className={`${postDetailsStyle.__PostDetails__Poster}`}
          />
        </div>

        <div className={`${postDetailsStyle.__PostDetails__Detailsbox}`}>
          <div className={`${postDetailsStyle.__PostDetails_userData}`}>
            <div className={`${postDetailsStyle.__PostDetails_userProfileBox}`}>
              <img
                src={state?.user.userProfile ?? defaultProfile}
                loading="lazy"
                alt={`${state?.user.userName}'s profile`}
                className={`${postDetailsStyle.__PostDetails_userProfile}`}
                onError={(e) => {
                  e.target.src = `${defaultProfile}`;
                  e.onerror = null;
                }}
              />
              <Link
                to={`/${state?.user._id}`}
                className={`${postDetailsStyle.__PostDetails_userNameLink}`}
              >
                {state?.user.userName}
              </Link>
            </div>
            <BsThreeDots className={`${postDetailsStyle.__PostDetails_PopupButton}`} onClick={(e)=>setTogglePopup(true)}/>
          </div>

          <div className={`${postDetailsStyle.__PostDetails__CommentBox}`}>
            {/* post caption  */}
            {state?.postCaption && (
              <div
                className={`${postDetailsStyle.__PostDetails_userCaptionBox}`}
              >
                <img
                  src={state?.user.userProfile ?? defaultProfile}
                  loading="lazy"
                  alt="username"
                  className={`${postDetailsStyle.__PostDetails_userProfile} ${postDetailsStyle.__PostDetails_userProfile_Caption}`}
                  onError={(e) => {
                    e.target.src = `${defaultProfile}`;
                    e.onerror = null;
                  }}
                />
                <p>
                  <Link
                    to={`/${state?.user._id}`}
                    className={`${postDetailsStyle.__PostDetails_userNameLink}`}
                  >
                    {state?.user.userName}
                  </Link>
                  <span
                    className={`${postDetailsStyle.__PostDetails_userCaptionText}`}
                  >
                    {state?.postCaption}
                    <span
                      className={`${postDetailsStyle.__PostDetails_PostDate}`}
                    >
                      {state?.postCreatedAt && <CalculateTimeAgo time={state?.postCreatedAt} />}

                    </span>
                  </span>
                </p>
              </div>
            )}

            {/* post comments */}
            {allCommentsLoader ? (
              <CommentsLoader />
            ) : (
              <>
                {
                  allComments.length === 0 && <p className={`${postDetailsStyle.__PostDetails__NoCommentMsg}`} >
                    No comments yet. <span>Start the conversation.</span>
                  </p>
                }
                {
                  allComments.length > 0 && <>
                    {allComments.map((data) => {
                      return (
                        <div key={data?._id} className={`${postDetailsStyle.__PostDetails__Comments}`}
                        >
                          <img src={data?.user.userProfile ?? defaultProfile} loading="lazy" alt="username" className={`${postDetailsStyle.__PostDetails_userProfile} ${postDetailsStyle.__PostDetails_userProfile_Caption}`} onError={(e) => { e.target.src = `${defaultProfile}`; e.onerror = null; }} />

                          <p>
                            <Link to={`/${data?.user._id}`} className={`${postDetailsStyle.__PostDetails_userNameLink}`} > {data?.user.userName} </Link>
                            <span className={`${postDetailsStyle.__PostDetails_userCaptionText}`}>
                              {data?.commentText}
                              <span className={`${postDetailsStyle.__PostDetails_PostDate}`}>
                                {
                                  data?.createAt && <CalculateTimeAgo time={data?.createAt} />
                                }

                                {data?.user._id === instaUserID && (
                                  <MdDelete className={`${postDetailsStyle.__PostDetails_deleteCommentICON}`} onClick={(e) => handleDeleteComment(e, data?._id)} />
                                )}
                              </span>
                            </span>
                          </p>
                        </div>
                      );
                    })}

                  </>
                }
              </>
            )}
          </div>

          <div className={`${postDetailsStyle.__PostDetails__PostStatsBox}`}>
            <div className={`${postDetailsStyle.__PostDetails__PosticonsBox}`}>
              <p>
                <FaRegHeart
                  className={`${postDetailsStyle.__PostDetails__ICONBUTTON}`}
                />
                {/* < FaHeart className={`${postDetailsStyle.__PostDetails__ICONBUTTON} post__LIKEDICONS`} /> */}
                <FaRegComment
                  className={`${postDetailsStyle.__PostDetails__ICONBUTTON}`}
                />
              </p>
              <p>
                {instaSavedPost?.includes(state?._id) ? (
                  <IoBookmark
                    className={`${postDetailsStyle.__PostDetails__ICONBUTTON}`}
                    onClick={(e) => handleRemoveSavePost(e, state?._id)}
                  />
                ) : (
                  <IoBookmarkOutline
                    className={`${postDetailsStyle.__PostDetails__ICONBUTTON}`}
                    onClick={(e) => handleSavePost(e, state?._id)}
                  />
                )}
              </p>
            </div>
            {state?.postLikes > 0 && (
              <span
                className={`${postDetailsStyle.__PostDetails__PostLikeCounter}`}
              >
                {state?.postLiks} {state?.postLiks > 1 ? "likes" : "like"}
              </span>
            )}
            <span className={`${postDetailsStyle.__PostDetails_PostDate}`}>
              {state?.postCreatedAt && <CalculateTimeAgo time={state?.postCreatedAt} />}
            </span>
          </div>

          {/* input for comming on the post */}
          <div className={`${postDetailsStyle.__PostDetails__createCommentBox}`}>
            {postCommentLoading && (
              <img
                src={postCommentLoader}
                alt=""
                className={`${postDetailsStyle.__createCommentbox_LoaderImg}`}
              />
            )}
            <input
              type="text"
              name="newComment"
              value={newComment}
              autoComplete="off"
              className={`${postDetailsStyle.__PostDetails__createCommentBoxInput}`}
              placeholder="Add a comment..."
              onChange={(e) => setNewComment(e.target.value)}
              readOnly={postCommentLoading}
              ref={inputRef}
            />
            <button
              type="button"
              className={`${postDetailsStyle.__PostDetails__createCommentBox_PostButton
                } ${postCommentLoading && "Unactive"} ${!newComment && "Unactive"
                }`}
              onClick={(e) => handlePostComment(e, state)}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      <div className={`${postDetailsStyle.__PostDetails__CloseBox}`}>
        <IoArrowBackSharp
          className={`${postDetailsStyle.__PostDetails__closeButton}`}
          onClick={handleCloseButtonClick}
        />
      </div>

      {
        showPopup && <PostDetailsPopup userData={state} CbClosePopup={setTogglePopup}/>
      }

    </div>
  );
}

export default PostDetails;