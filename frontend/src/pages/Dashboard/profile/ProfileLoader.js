import React from 'react'
import profileStyle from "./profile.module.css"
export function ProfileLoader() {
  return (
    <>
      <div className={`${profileStyle.dashboard__currentUser__infoContainer} ${profileStyle.__shimmerInfoContainer}`}>

        <p className={`${profileStyle.infoContainer__userProfile} shimmerBg`}></p>

        <div className={`${profileStyle.infoContainer__userBox} ${profileStyle.__shimmerInfoContainer}`}>
          <p className={`${profileStyle.userBox__userName} shimmerBg`}></p>

          <p className={`${profileStyle.userBox__userActivityState} shimmerBg`}></p>

          <p className={`${profileStyle.userBox__fullName}  ${profileStyle.__userProfileShimmerCONTENT} shimmerBg`}></p>

          <p className={`${profileStyle.userBox__userBIO} ${profileStyle.__userProfileShimmerCONTENT} shimmerBg`}></p>
        </div>

      </div>

      <div className={`${profileStyle.Postcontainer__shimmer}`}>
      <div className={`${profileStyle.__ExplorePostCard__ShimmerEffect} shimmerBg`}></div>
      <div className={`${profileStyle.__ExplorePostCard__ShimmerEffect} shimmerBg`}></div>
      <div className={`${profileStyle.__ExplorePostCard__ShimmerEffect} shimmerBg`}></div>
      </div>
    </>
  )
}
