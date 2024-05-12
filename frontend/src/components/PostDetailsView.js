import React from "react";
import { Link, useLocation} from "react-router-dom";
import defaultProfile from "../Assets/DefaultProfile.png";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa"; // when the user like the post
import savedPostICON_outline from "../Assets/favoutite.png"
import savedPostICON_Filled from "../Assets/Filled_favoutite.png"
import { CalculateTimeAgo } from "../utility/TimeAgo";
import { RxCross2 } from "react-icons/rx";
function PostDetailsView() {
  const {state} =useLocation();
  console.log(state)

  const handleBackClick = (e)=>{
    e.preventDefault();
    window.history.back();
  }
  return (
    <section className="postDetailsView__popupContainer" >
      <RxCross2 className="postDetailsView__closeButton" onClick={handleBackClick}/>
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
            <Link className="postDetailsview__ownerUserName">{state?.userName}</Link>

            <BsThreeDots className="postDetailsView__optionButtonICON" />
          </div>

          <div className="postDetailsview__Commentbox">
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
                  <Link className="PostCaptions__ownerUserName">{state?.userName}</Link>
                 {state?.postCaption}
                </p>
                <span className="postDetailsView_PostDate"><CalculateTimeAgo time={state?.postCreatedAt}/></span>
              </div>
            </div>

            {/* All Comments loaded here */}
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
                    Lorem ipsum dolor sit amet consectetur adipisicing elit
                    Aperiam aut alias.
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
          </div>

          <div className="postDetailsview__postICONContainer">

            <div className="iconContainer">
              <FaRegHeart className="postDetailsview__ICONS" />
              <FaHeart className="postDetailsview__ICONS postDetailsview__LIKEDICONS" />
              <FaRegComment className="postDetailsview__ICONS" />
              <img src={savedPostICON_outline} alt="SavedPost"  className="postDetailsview__ICONIMG"/>
              <img src={savedPostICON_Filled} alt="Un-SavedPost"  className="postDetailsview__ICONIMG postDetailsview__ICONIMG2"/>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default PostDetailsView;
