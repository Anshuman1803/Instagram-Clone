import React, { useEffect, useState } from 'react'
import defaultPicture from '../../../Assets/DefaultProfile.png'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut } from '../../../Redux/ReduxSlice';
import axios from "axios"
import toast from "react-hot-toast"
function EditProfile() {
  const { instaUserID, instaUserName, instaTOKEN } = useSelector((state) => (state.Instagram));
  const [ShowPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch()
  const navigateTO = useNavigate();
  const [useDetails, setUserDetails] = useState({
    userName: "",
    fullName: "",
    gender: "",
    bio: "",
    profilePicture: ""
  });

  const headers = {
    Authorization: `Bearer ${instaTOKEN}`
  };

  const handleTogglePopup = (e) => {
    e.preventDefault();
    setShowPopup(!ShowPopup)
  }

  const loaduserDetails = () => {
    axios.get(`http://localhost:5000/api/v1/auth/user/${instaUserID}`, { headers }).then((response) => {
      if (response.data.success) {
        setUserDetails({
          userName: response.data.user.userName,
          fullName: response.data.user.fullName,
          gender: response.data.user.gender ?? "",
          bio: response.data.user.bio ?? "N/A",
          profilePicture: response.data.user.userProfile,
        })
      } else {
        toast.error(`User not found`);
      }
    }).catch((error) => {
      if (error.response && !error.response.data.success) {
        toast.error(error.response.data.msg);
        navigateTO("/user/auth/signin");
        dispatch(UserLoggedOut());
      } else {
        toast.error(`Server error: ${error.message}`);
      }
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loaduserDetails, [])


  return (
    <form className='__EditProfile_form'>

      <div className='__EditProfile__profilePicture_box'>
        <div className='__EditProfile_userProfileBox'>
          <img src={useDetails?.profilePicture ?? defaultPicture} alt='Username profile' className='__EditPrfoile_userProfile' />
        </div>
        <div className='__EditProfile_buttonBox'>
          <p className='__editProfile__userName'>{instaUserName}</p>
          <button type="button" className='__changeProfilePopupButton' onClick={handleTogglePopup}>Change profile photo</button>
        </div>
      </div>

      <div className='__EditProfile__formRow'>
        <label htmlFor='userName' className='__EditProfile_formLabel'>User name</label>
        <input type="text" id='userName' value={useDetails?.userName} name='userName' placeholder='userName' className='__EditProfile_formInputItem' />
      </div>

      <div className='__EditProfile__formRow'>
        <label htmlFor='fullName' className='__EditProfile_formLabel'>Full Name</label>
        <input type="text" id='fullName' value={useDetails?.fullName} name='fullName' placeholder='Full Name' className='__EditProfile_formInputItem' />
      </div>

      <div className='__EditProfile__formRow'>
        <label htmlFor='gender' className='__EditProfile_formLabel'>Gender</label>
        <select id='gender' name='gender' value={useDetails?.gender} className='__EditProfile_formInputItem' >
          <option value="">select your gender</option>
          <option className='__EditProfile__selectOPTION' value="male">male</option>
          <option className='__EditProfile__selectOPTION' value="female">female</option>
          <option className='__EditProfile__selectOPTION' value="other">other</option>
        </select>
      </div>

      <div className='__EditProfile__formRow'>
        <label htmlFor='bio' className='__EditProfile_formLabel'>Bio</label>
        <textarea name='bio' id='bio' value={useDetails?.bio} className='__EditProfile_formTextArea' placeholder='bio'></textarea>
      </div>

      <div className='__EditProfile__formRow __EditProfile__buttonContainer'>
        <button className='__EditProfile_saveButton'>Save Changes</button>
      </div>
      {
        ShowPopup && <ProfileUpdatePopup CbTogglePopup={handleTogglePopup} CbProfile={useDetails.profilePicture}/>
      }
    </form>
  )
}

export default EditProfile


function ProfileUpdatePopup({ CbTogglePopup, CbProfile}) {
  return <div className='__EditProfile__UpdatePicturePopup_Container'>
    <div className='__Setting__UpdatePicturePopup'>
      <img src={CbProfile ?? defaultPicture} alt={"user profile"} className='__popupUserProfile' />
      <h3 className='__UpdatePicturePopup_Heading'>Update Profile picture</h3>
      <button type='button' className='__UpdatePicturePopupButtons __UpdatePictureButton'>Upload Photo</button>
      <button type='button' className='__UpdatePicturePopupButtons __RemoveCurrentPictureButton'>Remove Current Photo</button>
      <button type='button' className='__UpdatePicturePopupButtons' onClick={CbTogglePopup}>Cancle</button>
    </div>


  </div>
}