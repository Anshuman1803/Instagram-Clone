import React from 'react'
import postDetailsStyle from "./postdetails.module.css";
export function CommentsLoader() {
    return (
        <div className={`${postDetailsStyle.__ShimmerComments}`}>
            <p className={`${postDetailsStyle.__ShimmerCommentsProfile} shimmerBg`}></p>
            <p className={`${postDetailsStyle.__ShimmerCommentsNames}`}>
                <span className={`${postDetailsStyle.__ShimmerCommentsContent} shimmerBg`}></span>
                <span className={`${postDetailsStyle.__ShimmerCommentsContent} shimmerBg`}></span>
                <span className={`${postDetailsStyle.__ShimmerCommentsContent} shimmerBg`}></span>
            </p>
        </div>
    )
}