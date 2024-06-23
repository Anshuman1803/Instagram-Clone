import React from 'react'
import postDetailsStyle from "./postdetails.module.css";
import { useSelector } from "react-redux";
export function PostDetailsPopup({ userData, CbClosePopup }) {
    const { instaUserID } = useSelector((state) => state.Instagram);

    return (
        <div className={`${postDetailsStyle.__postDetailsPopupContainer}`}>
            <div className={`${postDetailsStyle.__postDetailsPopup}`}>

                {
                    userData?._id === instaUserID && <button onClick={(e) => CbClosePopup(false)} className={`${postDetailsStyle.__postDetailsPopup_buttons} ${postDetailsStyle.__postDetailsPopup_Secondarybuttons}`} type='button'>Delete</button>
                }
                {
                    userData?._id !== instaUserID && <>

                        <button onClick={(e) => CbClosePopup(false)} className={`${postDetailsStyle.__postDetailsPopup_buttons} ${postDetailsStyle.__postDetailsPopup_Secondarybuttons}`} type='button'>Report</button>

                        <button onClick={(e) => CbClosePopup(false)} className={`${postDetailsStyle.__postDetailsPopup_buttons} ${postDetailsStyle.__postDetailsPopup_Secondarybuttons}`} type='button'>Unfollow</button>
                    </>
                }


                <button onClick={(e) => CbClosePopup(false)} className={`${postDetailsStyle.__postDetailsPopup_buttons}`} type='button'>Add to favories</button>

                <button onClick={(e) => CbClosePopup(false)} className={`${postDetailsStyle.__postDetailsPopup_buttons}`} type='button'>About this account</button>

                <button onClick={(e) => CbClosePopup(false)} className={`${postDetailsStyle.__postDetailsPopup_buttons}`} type='button'>Cancle</button>

            </div>

        </div>
    )
}