
import Logo from '../../../Assets/Logo.png'
import { FaBars } from "react-icons/fa";
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
        <header className={`${homeStyle.__AppHeader}`} onClick={handleHidePopup}>
            <Link to={"/home"} className={`${homeStyle.__appNavbar__LOGO_Box} ${homeStyle.__appHeader__LOGO_Box}`}>
                <img className={`${homeStyle.__AppHeaderLOGO}`} src={Logo} alt='insta logo' />
            </Link>
            {
                popup && <MorePopup CbShowReport={CbShowReport} CBLogOut={handleLogout} CBClosePopup={handleTogglePopup} PropInstaID={instaUserID} SecondaryClass={`${homeStyle.__SecondaryPopupContainer}`} />
            }
            <button type="button" onClick={handleTogglePopup} className={`${homeStyle.__appNavbarMoreButton} ${homeStyle.__AppHeader_moreButton}`}>
                <FaBars className={`${homeStyle.__appNavbar_Items_ICONS}`} />
            </button>

        </header>
    )
}
