import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import defaultProfile from "../Assets/DefaultProfile.png";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
// import { FaHeart } from "react-icons/fa"; // when the user like the post
// import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { CalculateTimeAgo } from "../utility/TimeAgo";
import { RxCross2 } from "react-icons/rx";
import PostLoader from "./PostLoader";
function PostDetailsView() {
  const { state } = useLocation();
  const [AllComments] = useState([]);
  const [CommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const inputRef = useRef();
  console.log(state);

  const handleBackClick = (e) => {
    e.preventDefault();
    window.history.back();
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);
  return (
    <section className="postDetailsView__popupContainer">
      <RxCross2
        className="postDetailsView__closeButton"
        onClick={handleBackClick}
      />
      <div className="postDetailsview__box">
        <div className="postDetailsview__postPOsterContainer">
          <img
            src={state?.postPoster}
            alt="PostPoster"
            className="postDetailsview__postPOster"
          />
        </div>

        <div className="postDetailsview__postDetails">
          <div className="postDetailsview__ownerDetails">
            <img
              src={state?.userProfile}
              alt="ProfilePicture"
              className="postDetailsview__ownerProfile"
              onError={(e) => {
                e.target.src = `${defaultProfile}`;
                e.onerror = null;
              }}
            />
            <Link className="postDetailsview__ownerUserName">
              {state?.userName}
            </Link>

            <BsThreeDots className="postDetailsView__optionButtonICON" />
          </div>

          <div className="postDetailsview__CommentContainer">
            <div className="postDetailsview__captionBox">
              <img
                src={state?.userProfile}
                alt="ProfilePicture"
                className="postDetailsview__ownerProfile"
                onError={(e) => {
                  e.target.src = `${defaultProfile}`;
                  e.onerror = null;
                }}
              />

              <div className="postDetailsView_PostCaption">
                <p className="postCaption">
                  <Link className="PostCaptions__ownerUserName">
                    {state?.userName}
                  </Link>
                  {state?.postCaption}
                </p>
                <span className="postDetailsView_PostDate">
                  <CalculateTimeAgo time={state?.postCreatedAt} />
                </span>
              </div>
            </div>

            {/* All Comments loaded here */}
            <div className="postDetailsview__CommentBox">
              {CommentsLoading ? (
                <PostLoader />
              ) : (
                <>
                  {AllComments.length === 0 ? (
                    <p className="postDetailsview__NoCommentsMsg">
                      No comments yet.
                    </p>
                  ) : (
                    <>
                      <div
                        className="postDetailsview__captionBox"
                        style={{ paddingRight: "5px" }}
                      >
                        <img
                          src={""}
                          alt="ProfilePicture"
                          className="postDetailsview__ownerProfile"
                          onError={(e) => {
                            e.target.src = `${defaultProfile}`;
                            e.onerror = null;
                          }}
                        />

                        <div
                          className="postDetailsView_PostCaption"
                          style={{
                            padding: "0px 5px 0px 0px",
                            width: "calc(100% - 100px)",
                          }}
                        >
                          <p
                            className="postCaption"
                            style={{ fontSize: "16px", fontWeight: "300" }}
                          >
                            <Link className="PostCaptions__ownerUserName">
                              UserName
                            </Link>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit Aperiam aut alias.
                          </p>
                          <span
                            className="postDetailsView_PostDate"
                            style={{ fontSize: "14px" }}
                          >
                            1w
                          </span>
                        </div>

                        <MdDelete className="postDetailsView__deleteCommentICON" />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

          </div>

          <div className="postDetailsview__postICONContainer">
            <div className="iconContainer">
              <div>
                <FaRegHeart className="postDetailsview__ICONS" />
                {/* <FaHeart className="postDetailsview__ICONS postDetailsview__LIKEDICONS" /> */}
                <FaRegComment className="postDetailsview__ICONS" onClick={() => inputRef.current.focus()} />
              </div>
              <div>
                {/* <IoBookmark className="postDetailsview__ICONS" /> */}
                <IoBookmarkOutline className="postDetailsview__ICONS" />
              </div>
            </div>
            <p className="postDetailsview__LikeCounter">
              {state.postLikes > 0 && `Likes ${state.postLikes}`}
            </p>

            <div className="PostDetailsBox__CommentInputOBox">
              <input
                type="text"
                name="newComment"
                value={newComment}
                id="newComment_input"
                className="PostDetailsBox__inputBox"
                placeholder="Add a comment..."
                onChange={(e) => setNewComment(e.target.value)}
                ref={inputRef}
              />
              <button
                type="button"
                className={`PostDetailsBox__PostCommentButton ${newComment.length <= 5
                  ? "PostDetailsBox__unActiveButton"
                  : "PostDetailsBox__activeButton"
                  }`}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PostDetailsView;
