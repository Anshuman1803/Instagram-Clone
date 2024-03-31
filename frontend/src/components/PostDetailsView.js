import React from "react";
import { Link } from "react-router-dom";
import defaultProfile from "../Assets/DefaultProfile.png";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
function PostDetailsView({ postID }) {
  return (
    <section className="postDetailsView__popupContainer">
      <div className="postDetailsview__box">

        <div className="postDetailsview__postPOsterContainer">
          <img
            src="https://res.cloudinary.com/project-instagram-clone/image/upload/v1711783253/ghftksvkl8xdllbwuwmh.jpg"
            alt="PostPoster"
            className="postDetailsview__postPOster"
          />
        </div>

        <div className="postDetailsview__postDetails">
          <div className="postDetailsview__ownerDetails">
            <img
              src={""}
              alt="ProfilePicture"
              className="postDetailsview__ownerProfile"
              onError={(e) => {
                e.target.src = `${defaultProfile}`;
                e.onerror = null;
              }}
            />
            <Link className="postDetailsview__ownerUserName">UserName</Link>

            <BsThreeDots className="postDetailsView__optionButtonICON" />
          </div>

          <div className="postDetailsview__Commentbox">
            <div className="postDetailsview__captionBox">
              <img
                src={""}
                alt="ProfilePicture"
                className="postDetailsview__ownerProfile"
                onError={(e) => {
                  e.target.src = `${defaultProfile}`;
                  e.onerror = null;
                }}
              />

              <div className="postDetailsView_PostCaption">
                <p className="postCaption">
                  <Link className="PostCaptions__ownerUserName">UserName</Link>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit
                  Aperiam aut alias.
                </p>
                <span className="postDetailsView_PostDate">1w</span>
              </div>
            </div>

            {/* All Comments loaded here */}
            <>
              <div className="postDetailsview__captionBox"   style={{ paddingRight: "5px" }}>
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
                  style={{ padding: "0px 5px 0px 0px",   width: "calc(100% - 100px)"}}
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

                <MdDelete className="postDetailsView__deleteCommentICON"/>
              </div>
              
            </>
          </div>

          <div className="postDetailsview__postICONContainer">
            
          </div>


        </div>
      </div>
    </section>
  );
}

export default PostDetailsView;
