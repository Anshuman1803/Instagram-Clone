import React from 'react'
import { Link } from 'react-router-dom'
import { IoSettingsOutline } from "react-icons/io5";
import { GoReport } from "react-icons/go";
import { IoMdAnalytics } from "react-icons/io";
import { IoBookmark } from "react-icons/io5";
import homeStyle from "./home.module.css"
function MorePopup({ CBLogOut, CBClosePopup, PropInstaID, SecondaryClass, CbShowReport }) {
    return (
        <div className={`${homeStyle.__popupContainer} ${SecondaryClass ?? SecondaryClass}`}>
            <Link onClick={CBClosePopup} to={"/Accout/setting"} className={`${homeStyle.__popupLinkItem}`}> <IoSettingsOutline className={`${homeStyle.__popupLinkItem_ICON}`} /> Setting</Link>

            <Link onClick={CBClosePopup} to={`/${PropInstaID}/posts`} className={`${homeStyle.__popupLinkItem}`}> <IoBookmark className={`${homeStyle.__popupLinkItem_ICON}`} /> saved</Link>

            <Link onClick={CBClosePopup} to={"/Accout/Activity"} className={`${homeStyle.__popupLinkItem}`}> <IoMdAnalytics className={`${homeStyle.__popupLinkItem_ICON}`} /> Activity</Link>

            <p onClick={() => {
                CbShowReport(true);
                CBClosePopup()

            }} className={`${homeStyle.__popupLinkItem}`}> <GoReport className={`${homeStyle.__popupLinkItem_ICON}`} /> Report a problem</p>

            <span className={`${homeStyle.__popupDividerLINE}`}></span>

            <button className={`${homeStyle.__popupLogoutButton}`} onClick={CBLogOut}>Log out</button>
        </div>
    )
}

export default MorePopup