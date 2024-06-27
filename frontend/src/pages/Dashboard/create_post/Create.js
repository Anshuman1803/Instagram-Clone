import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut } from '../../../Redux/ReduxSlice';
import noPreviewPoster from "../../../Assets/noPreviewPoster.png";
import defaultProfile from "../../../Assets/DefaultProfile.png";
import selectImageICON from "../../../Assets/selectImageICON.png";
import toast from "react-hot-toast";
import axios from "axios";
import LazyLoader from "../../../components/LazyLoader";
import { useNavigate } from "react-router-dom";
import createPostStyle from "./create.module.css"
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Create() {
  const { instaUserID, instaUserName, instaProfle } = useSelector(
    (state) => state.Instagram
  );
  const dispatch = useDispatch();
  const navigateTO = useNavigate();
  const [Loading, setLoading] = useState(false);
  const imgRef = useRef();
  const [post, setPost] = useState({
    postPoster: "",
    postCaption: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const handleOnChangeInput = (e) => {
    if (e.target.name === "postPoster") {
      if (e.target.files[0].type.split("/")[0] === "image") {
        setPost({
          ...post,
          [e.target.name]: URL.createObjectURL(e.target.files[0]),
        });
        setSelectedImage(e.target.files[0]);
      } else {
        toast.error("Invalid image");
      }
    } else {
      setPost({ ...post, [e.target.name]: e.target.value });
    }
  };

  const handleCreateNewPost = (e) => {
    e.preventDefault();

    if (post.postPoster === "") {
      toast.error("Select an image for post");
    } else if (post.postCaption.length > 75) {
      toast.error("Caption should be only 75 characters.");
    }
    else {
      const formData = new FormData();
      formData.set("user", instaUserID);
      formData.set("userName", instaUserName);
      formData.set("userProfile", instaProfle);
      formData.set("postCreatedAt", Date.now());
      formData.append("postPoster", selectedImage);
      formData.append("postCaption", post.postCaption);
      setLoading(true);
      axios
        .post(`${BACKEND_URL}posts/create-post`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          if (response.data.success) {
            toast.success("Post created successfully");
            setPost({
              postPoster: "",
              postCaption: "",
            });
            setSelectedImage("");
            setLoading(false);
          } else {
            toast.error("Try again");
            setPost({
              postPoster: "",
              postCaption: "",
            });
            setSelectedImage(null);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (!err.response.data.success) {
            toast.error(err.response.data.msg);
            navigateTO("/user/auth/signin");
            dispatch(UserLoggedOut())
            return;
          }
          toast.error(`${err.message}`);
          setPost({
            postPoster: "",
            postCaption: "",
          });
          setSelectedImage(null);
          setLoading(false);
        });
    }
  };

  return (
    <section className={`${createPostStyle.Dashboard__CreateSection__container}`}>
      <div className={`${createPostStyle.CreatePost__box}`}>
        <div className={`${createPostStyle.createPost__previewImageBox}`}>
          <img
            src={post.postPoster}
            alt="Preview_Image"
            className={`${createPostStyle.creaetPost__PreviewImage}`}
            onError={(e) => {
              e.target.src = `${noPreviewPoster}`;
              e.onerror = null;
            }}
          />
        </div>
        <form className={`${createPostStyle.createPost__form}`} onSubmit={handleCreateNewPost}>
          <h1 className={`${createPostStyle.createPost__formHeading}`}>
            Create new post
            <button
              type="submit"
              className={`${createPostStyle.createPost__ShareButton}`}
              value={"Share"}
            >
              Share
            </button>
          </h1>

          <div className={`${createPostStyle.createPost__currentUserInfo}`}>
            <div className={`${createPostStyle.CreatePost__profilePictureBox}`}>
              <img
                src={instaProfle ? instaProfle : ""}
                alt="ProfilePicture"
                className={`${createPostStyle.CreatePost__profilePicture}`}
                onError={(e) => {
                  e.target.src = `${defaultProfile}`;
                  e.onerror = null;
                }}
              />
            </div>
            <h3 className={`${createPostStyle.createPost__currentUserName}`}>{instaUserName}</h3>
          </div>
          <textarea
            name="postCaption"
            id="caption"
            className={`${createPostStyle.createPost__captionBox}`}
            placeholder="Write a caption..."
            autoFocus
            onChange={handleOnChangeInput}
            value={post.postCaption}
          ></textarea>

          <input
            type="file"
            hidden
            ref={imgRef}
            accept="image/*"
            name="postPoster"
            onChange={handleOnChangeInput}
          />

          <img
            src={selectImageICON}
            alt=""
            className={`${createPostStyle.createPost__selectImageICON}`}
            onClick={() => imgRef.current.click()}
          />
        </form>
        {Loading && <LazyLoader customClass={"createPostLoaderContainer"}/>}
      </div>
    </section>
  );
}
