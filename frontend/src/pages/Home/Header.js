
import Logo from '../../Assets/Logo.png'
import Bars from '../../Assets/bars.png'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { UserLoggedOut } from '../../Redux/ReduxSlice';
import toast from 'react-hot-toast';
import MorePopup from '../../components/MorePopup';
export default function Header() {
    const navigateTO = useNavigate()
    const dispatch = useDispatch()
    const { instaUserID, instaUserName } = useSelector((state) => state.Instagram);
    const [popup, setPopup] = useState(false)

    const handleHidePopup = (e) => {
        e.stopPropagation();
        if(popup){

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
        <header className='__nav_Header' onClick={handleHidePopup}>
            <img className='__nav_Logo' src={Logo} alt='insta logo' />
            {
                popup && <MorePopup CBLogOut={handleLogout} CBClosePopup={handleTogglePopup} PropInstaID={instaUserID} SecondaryClass="__SecondaryPopupContainer" />
            }

            <button type="button" onClick={handleTogglePopup} className='__navbar_moreButton __secondaryMoreButton'><img className='moreIcon' src={Bars} alt='MoreButtonICON' /> <span className='__navTitle'>More</span></button>

        </header>
    )
}
