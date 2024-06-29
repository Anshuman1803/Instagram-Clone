
import Logo from '../../../Assets/Logo.png'
import Bars from '../../../Assets/bars.png'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { UserLoggedOut } from '../../../Redux/ReduxSlice';
import toast from 'react-hot-toast';
import MorePopup from './MorePopup';
import homeStyle from "./home.module.css"
export default function Header({ CbShowReport }) {
    const navigateTO = useNavigate()
    const dispatch = useDispatch()
    const { instaUserID, instaUserName } = useSelector((state) => state.Instagram);
    const [popup, setPopup] = useState(false)

    const handleHidePopup = (e) => {
        e.stopPropagation();
        if (popup) {

            setPopup(false)
        }
    }
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
        <header className={`${homeStyle.__nav_Header}`} onClick={handleHidePopup}>
            <img className={`${homeStyle.__nav_Logo}`} src={Logo} alt='insta logo' />
            {
                popup && <MorePopup CbShowReport={CbShowReport} CBLogOut={handleLogout} CBClosePopup={handleTogglePopup} PropInstaID={instaUserID} SecondaryClass={`${homeStyle.__SecondaryPopupContainer}`} />
            }

            <button type="button" onClick={handleTogglePopup} className={`${homeStyle.__navbar_moreButton} ${homeStyle.__secondaryMoreButton}`}><img className={`${homeStyle.moreIcon}`} src={Bars} alt='MoreButtonICON' /> <span className={`${homeStyle.__navTitle}`}>More</span></button>

        </header>
    )
}
