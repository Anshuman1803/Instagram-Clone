import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../../../Assets/Logo.png";
import instaIcon from "../../../Assets/insta_Icon.svg";
import { MdHome } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { MdExplore } from "react-icons/md";
import { PiMessengerLogoFill } from "react-icons/pi";
import { FaHeart } from "react-icons/fa";
import { FaSquarePlus } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { UserLoggedOut } from "../../../Redux/ReduxSlice";
import toast from "react-hot-toast";
import MorePopup from "./MorePopup";
import homeStyle from "./home.module.css";
import socket from "../../../utility/socket";
import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export default function Navbar({ CbShowReport }) {
  const navigateTO = useNavigate();
  const dispatch = useDispatch();
  const { instaUserID, instaUserName } = useSelector((state) => state.Instagram);
  const [popup, setPopup] = useState(false);
  const [notificationCounter, setNotificationCounter] = useState(0);

  const handleTogglePopup = () => {
    setPopup(!popup);
  };

  const handleLogout = () => {
    dispatch(UserLoggedOut());
    toast.success(`${instaUserName} Logged out !!`);
    setTimeout(() => {
      navigateTO("/user/auth/signin");
    }, 1000);
  };

  const loadNotificationCount = () => {
    axios.get(`${BACKEND_URL}notifications/get/notification-count/${instaUserID}`).then((response) => {
      if (response.data.success) {
        setNotificationCounter(response.data.notificationCount);
      } else {
        setNotificationCounter(response.data.notificationCount);
      }
    }).catch((error)=>{
        if (error.response?.status === 401) {
            dispatch(UserLoggedOut());
            navigateTO("/user/auth/signin");
            toast.error("Your session has expired. Please login again.");
          } else if (error.response?.status === 404) {
            setNotificationCounter(error.response.data.notificationCount);
          } 
          else {
            toast.error(`Server error: ${error.message}`);
          }
    })
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadNotificationCount,[]);

  useEffect(() => {
    socket.on("receiveNotificationFromUser", () => {
      loadNotificationCount();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className={`${homeStyle.__appNavbar_Container}`}>
      <Link to={"/home"} className={`${homeStyle.__appNavbar__LOGO_Box}`}>
        <img src={Logo} className={`${homeStyle.__appNavbar_PrimaryLOGO}`} alt="Instagram-logo" />
        <img src={instaIcon} className={`${homeStyle.__appNavbar_SecondaryLOGO}`} alt="Instagram-logo" />
      </Link>
      <nav className={`${homeStyle.__appNavbar}`}>
        <NavLink
          onClick={() => setPopup(false)}
          to={"/home"}
          className={({ isActive }) =>
            isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`
          }
        >
          <MdHome className={`${homeStyle.__appNavbar_Items_ICONS}`} />
          <span className={`${homeStyle.__appNavbar_Item_Text}`}>Home</span>
        </NavLink>

        <NavLink
          onClick={() => setPopup(false)}
          to={"/search"}
          className={({ isActive }) =>
            isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`
          }
        >
          <IoSearch className={`${homeStyle.__appNavbar_Items_ICONS}`} />
          <span className={`${homeStyle.__appNavbar_Item_Text}`}>Search</span>
        </NavLink>

        <NavLink
          onClick={() => setPopup(false)}
          to={"/explore"}
          className={({ isActive }) =>
            isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`
          }
        >
          <MdExplore className={`${homeStyle.__appNavbar_Items_ICONS}`} />
          <span className={`${homeStyle.__appNavbar_Item_Text}`}>Explore</span>
        </NavLink>

        <NavLink
          onClick={() => setPopup(false)}
          to={"/messages"}
          className={({ isActive }) =>
            isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`
          }
        >
          <PiMessengerLogoFill className={`${homeStyle.__appNavbar_Items_ICONS}`} />
          <span className={`${homeStyle.__appNavbar_Item_Text}`}>Messages</span>
          <span className={`${homeStyle.__appNavbar_ItemNotificationCounter}`}>0</span>
        </NavLink>

        <NavLink
          onClick={() => setPopup(false)}
          to={"/notification"}
          className={({ isActive }) =>
            isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`
          }
        >
          <FaHeart className={`${homeStyle.__appNavbar_Items_ICONS}`} />
          <span className={`${homeStyle.__appNavbar_Item_Text}`}>Notifications</span>
          <span className={`${homeStyle.__appNavbar_ItemNotificationCounter}`}>{notificationCounter}</span>
        </NavLink>

        <NavLink
          onClick={() => setPopup(false)}
          to={"/create"}
          className={({ isActive }) =>
            isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`
          }
        >
          <FaSquarePlus className={`${homeStyle.__appNavbar_Items_ICONS}`} />
          <span className={`${homeStyle.__appNavbar_Item_Text}`}>Create</span>
        </NavLink>

        <NavLink
          onClick={() => setPopup(false)}
          to={`/${instaUserID}`}
          className={({ isActive }) =>
            isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`
          }
        >
          <FaUserCircle className={`${homeStyle.__appNavbar_Items_ICONS}`} />
          <span className={`${homeStyle.__appNavbar_Item_Text}`}>Profile</span>
        </NavLink>
      </nav>
      {popup && (
        <MorePopup
          CbShowReport={CbShowReport}
          CBLogOut={handleLogout}
          CBClosePopup={handleTogglePopup}
          PropInstaID={instaUserID}
        />
      )}
      <div className={`${homeStyle.__appNavbarButton_Box}`}>
        <button type="button" onClick={handleTogglePopup} className={`${homeStyle.__appNavbarMoreButton}`}>
          <FaBars className={`${homeStyle.__appNavbar_Items_ICONS}`} />
          <span className={`${homeStyle.__appNavbar_Item_Text}`}>More</span>
        </button>
      </div>
    </div>
  );
}
