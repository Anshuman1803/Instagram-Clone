import React from 'react'
import { useSelector } from "react-redux";
export function PostPopup({ userID, CbClosePopup }) {
    const { instaUserID } = useSelector((state) => state.Instagram);

    return (
        <div className={`post_PopupContainer`}>
            <div className={`post__Popup`}>

                {
                    userID === instaUserID && <button onClick={(e) => CbClosePopup(false)} className={`post__Popup_buttons post__Popup_Secondarybuttons`} type='button'>Delete</button>
                }
                {
                    userID !== instaUserID && <>

                        <button onClick={(e) => CbClosePopup(false)} className={`post__Popup_buttons post__Popup_Secondarybuttons`} type='button'>Report</button>

                        <button onClick={(e) => CbClosePopup(false)} className={`post__Popup_buttons post__Popup_Secondarybuttons`} type='button'>Unfollow</button>
                    </>
                }


                <button onClick={(e) => CbClosePopup(false)} className={`post__Popup_buttons`} type='button'>Add to favories</button>

                <button onClick={(e) => CbClosePopup(false)} className={`post__Popup_buttons`} type='button'>About this account</button>

                <button onClick={(e) => CbClosePopup(false)} className={`post__Popup_buttons`} type='button'>Cancle</button>

            </div>

        </div>
    )
}