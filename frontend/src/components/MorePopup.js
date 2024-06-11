import React from 'react'
import { Link } from 'react-router-dom'
import { IoSettingsOutline } from "react-icons/io5";
import { GoReport } from "react-icons/go";
import { IoMdAnalytics } from "react-icons/io";
import { IoBookmark } from "react-icons/io5";
function MorePopup({ CBLogOut, CBClosePopup, PropInstaID, SecondaryClass }) {
    return (
        <div className={`__popupContainer ${SecondaryClass ?? SecondaryClass}`}>
            <Link onClick={CBClosePopup} to={"/Accout/setting"} className='__popupLinkItem'> <IoSettingsOutline className='__popupLinkItem_ICON' /> Setting</Link>

            <Link onClick={CBClosePopup} to={`/${PropInstaID}/saved`} className='__popupLinkItem'> <IoBookmark className='__popupLinkItem_ICON' /> saved</Link>

            <Link onClick={CBClosePopup} to={"/Accout/Activity"} className='__popupLinkItem'> <IoMdAnalytics className='__popupLinkItem_ICON' /> Activity</Link>

            <p onClick={CBClosePopup} className='__popupLinkItem'> <GoReport className='__popupLinkItem_ICON' /> Report a problem</p>

            <span className='__popupDividerLINE'></span>

            <button className='__popupLogoutButton' onClick={CBLogOut}>Log out</button>
        </div>
    )
}

export default MorePopup