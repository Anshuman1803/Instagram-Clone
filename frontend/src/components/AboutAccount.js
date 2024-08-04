import React, { useEffect, useState } from "react";
import axios from "axios";
import defaultProfile from "../Assets/DefaultProfile.png";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut } from "../Redux/ReduxSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SlCalender } from "react-icons/sl";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineGridOn } from "react-icons/md";
import Loader from "../Assets/postCommentLoader.gif";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
function AboutAccount({ userID, closePopup }) {
  const dispatch = useDispatch();
  const { instaTOKEN } = useSelector((state) => state.Instagram);
  const navigateTO = useNavigate();
  const [loading, setLoading] = useState(true);
  const [aboutAccount, setAboutAccount] = useState({});
  const headers = { Authorization: `Bearer ${instaTOKEN}` };



  useEffect(() => {
    axios
      .get(`${BACKEND_URL}users/about-account/${userID}`, { headers })
      .then((response) => {
        if (response.data.success) {
          setAboutAccount(response.data.aboutAccount);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response.status === 401) {
          dispatch(UserLoggedOut());
          navigateTO("/");
          toast.error("Your session has expired. Please login again.");
        } else if (error.response.status === 500) {
          toast.error("Internal Server Error. Please try again later.");
        } else {
          toast.error("Failed to load user's about account.");
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  return (
    <div className="__aboutAccountBox">
        <h1 className="__aboutAccountBox_heading">About this account </h1>
      {loading ? (
        <img src={Loader} alt="Loading" className="__likelistPopup_loading" />
      ) : (
        <>
          <img
            src={aboutAccount?.userProfile ?? defaultProfile}
            alt={aboutAccount?.userName}
            className={"__userProfile"}
            onError={(e) => {
              e.target.src = `${defaultProfile}`;
              e.onerror = null;
            }}
          />
          <p className="__aboutAccount_userName">{aboutAccount?.userName}</p>

          {aboutAccount?.userBio && <p className="__aboutAccount_BIO">{aboutAccount?.userBio}</p>}

          <div className="__aboutAccount__itmes">
            <SlCalender className="__aboutAccount_ItemICON" />
            <p className="__aboutAccount_ItemText">
                Date joined <span className="__aboutAccount_itemCount">
                    {new Date(aboutAccount.createdAt).toString().split(" ")[2]} {new Date(aboutAccount.createdAt).toString().split(" ")[1]} {new Date(aboutAccount.createdAt).toString().split(" ")[3]}
                </span>
            </p>
          </div>

          <div className="__aboutAccount__itmes">
            <MdOutlineGridOn className="__aboutAccount_ItemICON" />
            <p className="__aboutAccount_ItemText">
                Posts <span className="__aboutAccount_itemCount">{aboutAccount?.postCount} </span>
            </p>
          </div>

          <div className="__aboutAccount__itmes">
            <FaRegUser className="__aboutAccount_ItemICON" />
            <p className="__aboutAccount_ItemText">
                Followers <span className="__aboutAccount_itemCount">{aboutAccount?.followersCount} </span>
            </p>
          </div>

          <div className="__aboutAccount__itmes">
            <FaRegUser className="__aboutAccount_ItemICON" />
            <p className="__aboutAccount_ItemText">
            Following <span className="__aboutAccount_itemCount">{aboutAccount?.followingCount}</span>
            </p>
          </div>


          <button type="button" className="__aboutAccount__button"onClick={closePopup}>Close</button>
        </>
      )}
    </div>
  );
}

export default AboutAccount;
