import React, { useState } from "react";
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
export default function Navbar({ CbShowReport }) {
    const navigateTO = useNavigate();
    const dispatch = useDispatch();
    const { instaUserID, instaUserName } = useSelector(
        (state) => state.Instagram
    );
    const [popup, setPopup] = useState(false);

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

    return (
        <div className={`${homeStyle.__appNavbar_Container}`}>
            <Link to={"/home"} className={`${homeStyle.__appNavbar__LOGO_Box}`}>
                <img src={Logo} className={`${homeStyle.__appNavbar_PrimaryLOGO}`} alt="Instagram-logo" />
                <img src={instaIcon} className={`${homeStyle.__appNavbar_SecondaryLOGO}`} alt="Instagram-logo" />
            </Link>
            <nav className={`${homeStyle.__appNavbar}`}>
                <NavLink onClick={()=>setPopup(false)} to={'/home'} className={({ isActive }) => (isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`)}>
                    <MdHome className={`${homeStyle.__appNavbar_Items_ICONS}`} />
                    <span className={`${homeStyle.__appNavbar_Item_Text}`}>Home</span>
                </NavLink>

                <NavLink onClick={()=>setPopup(false)} to={'/search'} className={({ isActive }) => (isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`)}>
                    <IoSearch className={`${homeStyle.__appNavbar_Items_ICONS}`} />
                    <span className={`${homeStyle.__appNavbar_Item_Text}`}>Search</span>
                </NavLink>

                <NavLink onClick={()=>setPopup(false)} to={'/explore'} className={({ isActive }) => (isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`)}>
                    <MdExplore className={`${homeStyle.__appNavbar_Items_ICONS}`} />
                    <span className={`${homeStyle.__appNavbar_Item_Text}`}>Explore</span>
                </NavLink>

                <NavLink onClick={()=>setPopup(false)} to={'/messages'} className={({ isActive }) => (isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`)}>
                    <PiMessengerLogoFill className={`${homeStyle.__appNavbar_Items_ICONS}`} />
                    <span className={`${homeStyle.__appNavbar_Item_Text}`}>Messages</span>
                </NavLink>

                <NavLink onClick={()=>setPopup(false)} to={'/notification'} className={({ isActive }) => (isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`)}>
                    <FaHeart className={`${homeStyle.__appNavbar_Items_ICONS}`} />
                    <span className={`${homeStyle.__appNavbar_Item_Text}`}>Notifications</span>
                </NavLink>

                <NavLink onClick={()=>setPopup(false)} to={'/create'} className={({ isActive }) => (isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`)}>
                    <FaSquarePlus className={`${homeStyle.__appNavbar_Items_ICONS}`} />
                    <span className={`${homeStyle.__appNavbar_Item_Text}`}>Create</span>
                </NavLink>

                <NavLink onClick={()=>setPopup(false)} to={`/${instaUserID}`} className={({ isActive }) => (isActive ? `${homeStyle.__appNavbar_Items} ${homeStyle.active}` : `${homeStyle.__appNavbar_Items}`)}>
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
                <button type="button"  onClick={handleTogglePopup} className={`${homeStyle.__appNavbarMoreButton}`}>
                <FaBars className={`${homeStyle.__appNavbar_Items_ICONS}`} />
                <span className={`${homeStyle.__appNavbar_Item_Text}`}>More</span>
                </button>

            </div>
        </div>
    );
}
