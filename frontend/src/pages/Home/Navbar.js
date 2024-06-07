import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from '../../Assets/Logo.png'
import instaIcon from '../../Assets/insta_Icon.svg'
import Home from '../../Assets/home.svg'
import Search from '../../Assets/search.svg'
import Explore from '../../Assets/compass.png'
import Messages from '../../Assets/messenger.svg'
import Notification from '../../Assets/heart.png'
import Create from '../../Assets/create.png'
import Profile from '../../Assets/profile.png'
import Bars from '../../Assets/bars.png'
import { useSelector, useDispatch } from "react-redux";
import { UserLoggedOut } from '../../Redux/ReduxSlice';
import toast from 'react-hot-toast';
import { IoSettingsOutline } from "react-icons/io5";
import { GoReport } from "react-icons/go";
import { IoMdAnalytics } from "react-icons/io";
import { IoBookmark } from "react-icons/io5";

export default function Navbar() {
    const navigateTO = useNavigate()
    const dispatch = useDispatch()
    const { instaUserID, instaUserName } = useSelector((state) => state.Instagram);
    const [popup, setPopup] = useState(false)

    const handleTogglePopup = () => {
        setPopup(!popup)
    }

    const handleLogout = () => {
        dispatch(UserLoggedOut())
        toast.success(`${instaUserName} Logged out !!`)
        setTimeout(() => {
            navigateTO('/user/auth/signin')
        }, 1000);
    }


    return (
        <div className='navbar'>
            <img className='instaLogo' src={Logo} alt='insta logo' />
            <img className='instaLogo __instaIcon_Hide' src={instaIcon} alt='insta logo' />
            <nav className='primary__navbar'>
                <NavLink className='navLink' to='/home'>
                    <img className='navIcon' src={Home} alt='' />  <span className='__navTitle'>Home</span>
                </NavLink>
                <NavLink className='navLink' to='/search'>
                    <img className='navIcon' src={Search} alt='' />   <span className='__navTitle'>Search</span>
                </NavLink>
                <NavLink className='navLink' to='/explore' >
                    <img className='navIcon' src={Explore} alt='' />   <span className='__navTitle'>Explore</span>
                </NavLink>
                <NavLink className='navLink' to='/messages' >
                    <img className='navIcon' src={Messages} alt='' />   <span className='__navTitle'>Messages</span>
                </NavLink>
                <NavLink className='navLink' to='/notification'>
                    <img className='navIcon' src={Notification} alt='' />   <span className='__navTitle'>Notification</span>
                </NavLink>
                <NavLink className='navLink' to='/create'>
                    <img className='navIcon' src={Create} alt='' />   <span className='__navTitle'>Create</span>
                </NavLink>
                <NavLink className='navLink' to={`/${instaUserID}`} >
                    <img className='navIcon' src={Profile} alt='' />   <span className='__navTitle'>Profile</span>
                </NavLink>
            </nav>
            {
                popup && <PopupContainer CBLogOut={handleLogout} CBClosePopup={handleTogglePopup} PropInstaID={instaUserID} />
            }
            <button type="button" onClick={handleTogglePopup} className='__navbar_moreButton'><img className='moreIcon' src={Bars} alt='MoreButtonICON' /> <span className='__navTitle'>More</span></button>
        </div>
    )
}

const PopupContainer = ({ CBLogOut, CBClosePopup, PropInstaID }) => {
    return <div className='__popupContainer'>
        <Link onClick={CBClosePopup} to={"/Accout/setting"} className='__popupLinkItem'> <IoSettingsOutline className='__popupLinkItem_ICON' /> Setting</Link>

        <Link onClick={CBClosePopup} to={`/${PropInstaID}/saved`} className='__popupLinkItem'> <IoBookmark className='__popupLinkItem_ICON' /> saved</Link>

        <Link onClick={CBClosePopup} to={"/Accout/Activity"} className='__popupLinkItem'> <IoMdAnalytics className='__popupLinkItem_ICON' /> Activity</Link>

        <p onClick={CBClosePopup} className='__popupLinkItem'> <GoReport className='__popupLinkItem_ICON' /> Report a problem</p>

        <span className='__popupDividerLINE'></span>

        <button className='__popupLogoutButton' onClick={CBLogOut}>Log out</button>
    </div>
}

