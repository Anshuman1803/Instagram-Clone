import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from '../../../Assets/Logo.png'
import instaIcon from '../../../Assets/insta_Icon.svg'
import Home from '../../../Assets/home.svg'
import Search from '../../../Assets/search.svg'
import Explore from '../../../Assets/compass.png'
import Messages from '../../../Assets/messenger.svg'
import Notification from '../../../Assets/heart.png'
import Create from '../../../Assets/create.png'
import Profile from '../../../Assets/profile.png'
import Bars from '../../../Assets/bars.png'
import { useSelector, useDispatch } from "react-redux";
import { UserLoggedOut } from '../../../Redux/ReduxSlice';
import toast from 'react-hot-toast';
import MorePopup from './MorePopup'
import homeStyle from "./home.module.css"
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
        <div className={`${homeStyle.navbar}`}>
            <img className={`${homeStyle.instaLogo}`} src={Logo} alt='insta logo' />
            <img className={`${homeStyle.instaLogo} ${homeStyle.__instaIcon_Hide}`} src={instaIcon} alt='insta logo' />
            <nav className={`${homeStyle.primary__navbar} ${homeStyle.nav}`}>
                <NavLink className={`${homeStyle.navLink}`} to='/home'>
                    <img className={`${homeStyle.navIcon}`} src={Home} alt='' />  <span className={`${homeStyle.__navTitle}`}>Home</span>
                </NavLink>
                <NavLink className={`${homeStyle.navLink}`} to='/search'>
                    <img className={`${homeStyle.navIcon}`} src={Search} alt='' />   <span className={`${homeStyle.__navTitle}`}>Search</span>
                </NavLink>
                <NavLink className={`${homeStyle.navLink}`} to='/explore' >
                    <img className={`${homeStyle.navIcon}`} src={Explore} alt='' />   <span className={`${homeStyle.__navTitle}`}>Explore</span>
                </NavLink>
                <NavLink className={`${homeStyle.navLink}`} to='/messages' >
                    <img className={`${homeStyle.navIcon}`} src={Messages} alt='' />   <span className={`${homeStyle.__navTitle}`}>Messages</span>
                </NavLink>
                <NavLink className={`${homeStyle.navLink}`} to='/notification'>
                    <img className={`${homeStyle.navIcon}`} src={Notification} alt='' />   <span className={`${homeStyle.__navTitle}`}>Notification</span>
                </NavLink>
                <NavLink className={`${homeStyle.navLink}`} to='/create'>
                    <img className={`${homeStyle.navIcon}`} src={Create} alt='' />   <span className={`${homeStyle.__navTitle}`}>Create</span>
                </NavLink>
                <NavLink className={`${homeStyle.navLink}`} to={`/${instaUserID}`} >
                    <img className={`${homeStyle.navIcon}`} src={Profile} alt='' />   <span className={`${homeStyle.__navTitle}`}>Profile</span>
                </NavLink>
            </nav>
            {
                popup && <MorePopup CBLogOut={handleLogout} CBClosePopup={handleTogglePopup} PropInstaID={instaUserID} />
            }
            <button type="button" onClick={handleTogglePopup} className={`${homeStyle.__navbar_moreButton}`}><img className={`${homeStyle.moreIcon}`} src={Bars} alt='MoreButtonICON' /> <span className={`${homeStyle.__navTitle}`}>More</span></button>
        </div>
    )
}

