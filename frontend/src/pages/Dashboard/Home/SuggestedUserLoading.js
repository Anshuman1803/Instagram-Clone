import React from 'react'
import homeStyle from "./home.module.css"
export function SuggestedUserLoading() {
    const dummyArray = [11111, 112222, 113333, 114444, 115555];
    return (
        <>
            {
                dummyArray.map((data) => {
                    return <div key={data} className={`${homeStyle.currentUserContainer_SuggestedUserBox} ${homeStyle._Suggested_shimmerUser}`}>
                        <p className={`${homeStyle.__homePost_ShimmerCardProfile} shimmerBg`}></p>
                        <p className={` ${homeStyle._Suggested_shimmerUserBox}`}>
                            <span className={`${homeStyle._Suggested_shimmerUserBoxContent} shimmerBg`}></span>
                            <span className={`${homeStyle._Suggested_shimmerUserBoxContent} shimmerBg`}></span>
                        </p>
                        <p className={`${homeStyle.__homePost_ShimmerCardButton} shimmerBg`}></p>
                    </div>
                })
            }
        </>
    )
}
