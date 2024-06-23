import React from 'react'
import postDetailsStyle from "./postdetails.module.css";
export function CommentsLoader() {
    const dummyArray = [11122, 12112, 113233, 1121324, 1153443, 1143246, 113427, 118234, 112349]
    return (
        <>
        {
            dummyArray.map((data)=>{
                return  <div key={data} className={`${postDetailsStyle.__ShimmerComments}`}>
                <p className={`${postDetailsStyle.__ShimmerCommentsProfile} shimmerBg`}></p>
                <p className={`${postDetailsStyle.__ShimmerCommentsNames}`}>
                    <span className={`${postDetailsStyle.__ShimmerCommentsContent} shimmerBg`}></span>
                    <span className={`${postDetailsStyle.__ShimmerCommentsContent} shimmerBg`}></span>
                    <span className={`${postDetailsStyle.__ShimmerCommentsContent} shimmerBg`}></span>
                </p>
            </div>
            })
        }
        </>
       
    )
}