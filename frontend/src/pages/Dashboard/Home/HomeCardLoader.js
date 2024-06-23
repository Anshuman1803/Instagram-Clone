import React from 'react'
import homeStyle from "./home.module.css"

export function HomeCardLoader() {
    const dummyArray = [111, 112, 113, 114, 115, 116, 117, 118, 119]
    return (
        <>
            {
                dummyArray.map((data) => {
                    return <div key={data} className={`${homeStyle.HomeSection__homePostCard} ${homeStyle.__homePost_ShimmerCard}`}>
                        <div className={`${homeStyle.__homePost_ShimmerCard_Header}`}>
                            <p className={`${homeStyle.__homePost_ShimmerCardProfile} shimmerBg`}></p>
                            <span className={`${homeStyle.__homePost_ShimmerCard_content} shimmerBg`}></span>
                            <span className={`${homeStyle.__homePost_ShimmerCard_contentDOT} shimmerBg`}></span>
                            <span className={`${homeStyle.__homePost_ShimmerCard_content} shimmerBg`}></span>
                            <span className={`${homeStyle.__homePost_ShimmerCard_content} shimmerBg`}></span>
                        </div>
                        <div className={`${homeStyle.__homePost_ShimmerCard_contentPoster} shimmerBg`}></div>
                    </div>
                })

            }
        </>
    )
}