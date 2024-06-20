import React from 'react'
import editProfileStyle from "./editprofile.module.css"
function EditProfileLoader() {
    return (
        // shimmerBg
        <div className={`${editProfileStyle.__EditProfile_form} ${editProfileStyle.__EditProfileShimmerCard}`}>
            <div className={`${editProfileStyle.__EditProfile__profilePicture_box}`}>
                <div className={`${editProfileStyle.____EditProfileShimmerCard_ProfileBox}`}>
                    <p className={`shimmerBg ${editProfileStyle.__EditProfileShimmerCardProfile}`}></p>
                </div>
                <div className={`${editProfileStyle.____EditProfileShimmerCard_buttonBox}`}>
                    <span className={`shimmerBg ${editProfileStyle.__editProfileContent}`}></span>
                    <span className={`shimmerBg ${editProfileStyle.__editProfileContent}`}></span>
                </div>
            </div>

            <div className={`${editProfileStyle.__EditProfile__formRow}`}>
                <span className={`shimmerBg ${editProfileStyle.__editProfileContentLabel}`}></span>
                <span className={`shimmerBg ${editProfileStyle.__editProfileContentInput}`}></span>
            </div>

            <div className={`${editProfileStyle.__EditProfile__formRow}`}>
                <span className={`shimmerBg ${editProfileStyle.__editProfileContentLabel}`}></span>
                <span className={`shimmerBg ${editProfileStyle.__editProfileContentInput}`}></span>
            </div>

            <div className={`${editProfileStyle.__EditProfile__formRow}`}>
                <span className={`shimmerBg ${editProfileStyle.__editProfileContentLabel}`}></span>
                <span className={`shimmerBg ${editProfileStyle.__editProfileContentInput}`}></span>
            </div>

            <div className={`${editProfileStyle.__EditProfile__formRow}`}>
                <span className={`shimmerBg ${editProfileStyle.__editProfileContentLabel}`}></span>
                <span className={`shimmerBg ${editProfileStyle.__editProfileContentInput}`}></span>
            </div>

            <div className={`${editProfileStyle.__EditProfile__formRow}`}>
                <span className={`shimmerBg ${editProfileStyle.__editProfileContentLabel}`}></span>
                <span className={`shimmerBg ${editProfileStyle.__editProfileContentInput}`}></span>
            </div>

            <span className={`shimmerBg ${editProfileStyle.__editProfileContentButton}`}></span>
        </div>
    )
}

export default EditProfileLoader