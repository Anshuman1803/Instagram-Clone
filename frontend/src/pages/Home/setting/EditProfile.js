import React, { useState } from 'react'
import defaultPicture from '../../../Assets/DefaultProfile.png'
import { useSelector } from "react-redux"
function EditProfile() {
  const { instaProfle, instaUserID, instaUserName, instaTOKEN } = useSelector((state) => (state.Instagram));
  const [ShowPopup, setShowPopup] = useState(false);

  const handleTogglePopup = (e) => {
    e.preventDefault();
    setShowPopup(!ShowPopup)
  }

  return (
    <form className='__EditProfile_form'>

      <div className='__EditProfile__profilePicture_box'>
        <div className='__EditProfile_userProfileBox'>
          <img src={instaProfle ?? defaultPicture} alt='Username profile' className='__EditPrfoile_userProfile' />
        </div>
        <div className='__EditProfile_buttonBox'>
          <p className='__editProfile__userName'>{instaUserName}</p>
          <button type="button" className='__changeProfilePopupButton' onClick={handleTogglePopup}>Change profile photo</button>
        </div>
      </div>

      <div className='__EditProfile__formRow'>
        <label htmlFor='userName' className='__EditProfile_formLabel'>User name</label>
        <input type="text" id='userName' name='userName' placeholder='userName' className='__EditProfile_formInputItem' />
      </div>

      <div className='__EditProfile__formRow'>
        <label htmlFor='fullName' className='__EditProfile_formLabel'>Full Name</label>
        <input type="text" id='fullName' name='fullName' placeholder='Full Name' className='__EditProfile_formInputItem' />
      </div>

      <div className='__EditProfile__formRow'>
        <label htmlFor='gender' className='__EditProfile_formLabel'>Gender</label>
        <select id='gender' name='gender' className='__EditProfile_formInputItem' >
          <option value="">select your gender</option>
          <option className='__EditProfile__selectOPTION' value="male">male</option>
          <option className='__EditProfile__selectOPTION' value="female">female</option>
          <option className='__EditProfile__selectOPTION' value="other">other</option>
        </select>
      </div>

      <div className='__EditProfile__formRow'>
        <label htmlFor='bio' className='__EditProfile_formLabel'>Bio</label>
        <textarea name='bio' id='bio' className='__EditProfile_formTextArea' placeholder='bio'></textarea>
      </div>

      <div className='__EditProfile__formRow __EditProfile__buttonContainer'>
        <button className='__EditProfile_saveButton'>Save Changes</button>
      </div>
      {
        ShowPopup && <ProfileUpdatePopup CbTogglePopup={handleTogglePopup} />
      }
    </form>
  )
}

export default EditProfile


function ProfileUpdatePopup({ CbTogglePopup }) {
  return <div className='__EditProfile__UpdatePicturePopup_Container'>
    <div className='__Setting__UpdatePicturePopup'>
      <img src={defaultPicture} alt={"user profile"} className='__popupUserProfile' />
      <h3 className='__UpdatePicturePopup_Heading'>Update Profile picture</h3>
      <button type='button' className='__UpdatePicturePopupButtons __UpdatePictureButton'>Upload Photo</button>
      <button type='button' className='__UpdatePicturePopupButtons __RemoveCurrentPictureButton'>Remove Current Photo</button>
      <button type='button' className='__UpdatePicturePopupButtons' onClick={CbTogglePopup}>Cancle</button>
    </div>


  </div>
}