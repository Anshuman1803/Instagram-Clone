import React, { useEffect, useRef, useState } from 'react'
import defaultPicture from '../../../Assets/DefaultProfile.png'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut, userUpdateDetails } from '../../../Redux/ReduxSlice';
import axios from "axios"
import toast from "react-hot-toast"
import ComponentLoader from "../../../components/ComponentLoader"
import ButtonLoader from "../../../components/ButtonLoader"
function EditProfile() {
  const imageInputRef = useRef();
  const { instaUserID, instaTOKEN } = useSelector((state) => (state.Instagram));
  const [ShowPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch()
  const navigateTO = useNavigate();
  const [Loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false)
  const [userDetails, setUserDetails] = useState({
    userName: "",
    fullName: "",
    gender: "",
    userBio: "",
    profilePicture: ""
  });
  const [selectedImgPath, setSelectedImg] = useState(null)
  const headers = {
    Authorization: `Bearer ${instaTOKEN}`,
    "Content-Type": "multipart/form-data"
  };

  const handleTogglePopup = (e) => {
    e.preventDefault();
    setShowPopup(!ShowPopup)
  }

  // onChange event 
  const handleInputOnChange = (e) => {
    let { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value })
    if (name === "profilePicture") {
      if (e.target?.files[0]?.type.split("/")[0] === "image") {
        setUserDetails({
          ...userDetails,
          [name]: URL.createObjectURL(e.target.files[0]),
        });
        setSelectedImg(e.target.files[0]);
      } else {
        toast.error("Invalid image");
      }
    }
  }
  // /user/update-user-details/:userEmail
  const loaduserDetails = () => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/v1/auth/user/${instaUserID}`, {}, { headers }).then((response) => {
      if (response.data.success) {
        setLoading(false);
        setUserDetails({
          userName: response.data.user.userName,
          fullName: response.data.user.fullName,
          gender: response.data.user.gender ?? "",
          userBio: response.data.user.userBio ?? "N/A",
          profilePicture: response.data.user.userProfile,
        })
      } else {
        setLoading(false);
        toast.error(`User not found`);
      }
    }).catch((error) => {
      setLoading(false);
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


  // Saved updated details
  const handleSaveChanges = (e) => {
    e.preventDefault();
    setButtonLoading(true)
    const formData = new FormData();
    formData.append("userName", userDetails?.userName);
    formData.append("fullName", userDetails?.fullName);
    formData.append("gender", userDetails?.gender);
    formData.append("userBio", userDetails?.userBio);
    formData.append("profilePicture", selectedImgPath);

    axios.patch(`http://localhost:5000/api/v1/auth/user/update-user-details/${instaUserID}`, formData, { headers }).then((response) => {
      setButtonLoading(false)
      if (response.data.success) {
        dispatch(userUpdateDetails({
          instaFullName: response.data.updatedUser.fullName,
          instaProfle: response.data.updatedUser.userProfile,
          instaUserName: response.data.updatedUser.userName,
        }))
        toast.success(`${response.data.msg}`);
        loaduserDetails()
      } else {
        toast.error(`${response.data.msg}`);
        loaduserDetails()
      }
    }).catch((error) => {
      setButtonLoading(false)
      if (error.response && !error.response.data.success) {
        toast.error(error.response.data.msg);
        navigateTO("/user/auth/signin");
        dispatch(UserLoggedOut());
      } else {
        toast.error(`Server error: ${error.message}`);
      }
    })
  }

  return (
    <form className='__EditProfile_form'>
      {
        Loading ? <ComponentLoader /> : <>

          <div className='__EditProfile__profilePicture_box'>
            <div className='__EditProfile_userProfileBox'>
              <input type='file' hidden ref={imageInputRef} accept="image/*" name='profilePicture' id="profilePicture" onChange={handleInputOnChange} />
              <img src={userDetails?.profilePicture ?? defaultPicture} alt='Username profile' className='__EditPrfoile_userProfile' onError={(e) => { e.target.src = `${defaultPicture}`; e.onError = null; }} />
            </div>
            <div className='__EditProfile_buttonBox'>
              <p className='__editProfile__userName'>{userDetails.userName}</p>
              <button type="button" className='__changeProfilePopupButton' onClick={handleTogglePopup}>Change profile photo</button>
            </div>
          </div>

          <div className='__EditProfile__formRow'>
            <label htmlFor='userName' className='__EditProfile_formLabel'>User name</label>
            <input type="text" id='userName' onChange={handleInputOnChange} value={userDetails?.userName} name='userName' placeholder='userName' className='__EditProfile_formInputItem' autoComplete='off' maxLength={15}/>
          </div>

          <div className='__EditProfile__formRow'>
            <label htmlFor='fullName' className='__EditProfile_formLabel'>Full Name</label>
            <input type="text" id='fullName' onChange={handleInputOnChange} value={userDetails?.fullName} name='fullName' placeholder='Full Name' className='__EditProfile_formInputItem' autoComplete='off'  maxLength={20}
              minLength={3} />
          </div>

          <div className='__EditProfile__formRow'>
            <label htmlFor='gender' className='__EditProfile_formLabel'>Gender</label>
            <select id='gender' name='gender' onChange={handleInputOnChange} value={userDetails?.gender} className='__EditProfile_formInputItem' autoComplete='off' >
              <option value="">select your gender</option>
              <option className='__EditProfile__selectOPTION' value="male">male</option>
              <option className='__EditProfile__selectOPTION' value="female">female</option>
              <option className='__EditProfile__selectOPTION' value="other">other</option>
            </select>
          </div>

          <div className='__EditProfile__formRow'>
            <label htmlFor='userBio' className='__EditProfile_formLabel'>userBio</label>
            <textarea name='userBio' id='userBio' onChange={handleInputOnChange} value={userDetails?.userBio} className='__EditProfile_formTextArea' placeholder='userBio' maxLength={150} minLength={4}></textarea>
          </div>

          <div className='__EditProfile__formRow __EditProfile__buttonContainer'>
            <button type='submit' className='__EditProfile_saveButton' onClick={handleSaveChanges}>
              {
                buttonLoading ? <ButtonLoader /> : ' Save Changes'
              }
            </button>
          </div>
        </>
      }
      {
        ShowPopup && <ProfileUpdatePopup CbTogglePopup={handleTogglePopup} CbProfile={userDetails.profilePicture} CbRef={imageInputRef} CbLoadDetails={loaduserDetails} />
      }
    </form>
  )
}

export default EditProfile


function ProfileUpdatePopup({ CbTogglePopup, CbProfile, CbRef, CbLoadDetails }) {
  const { instaUserID, instaTOKEN } = useSelector((state) => (state.Instagram));
  const dispatch = useDispatch()
  const navigateTO = useNavigate();
  const [buttonLoading, setButtonLoading] = useState(false)
  const headers = {
    Authorization: `Bearer ${instaTOKEN}`,
  };

  const handleRemoveProfile = (e) => {
    e.preventDefault();
    setButtonLoading(true);
    axios.patch(`http://localhost:5000/api/v1/auth/user/remove-profile-picture/${instaUserID}`, {}, { headers }).then((response) => {
      if (response.data.success) {
        toast.success(`${response.data.msg}`);
        CbTogglePopup();
        CbLoadDetails();
      } else {
        toast.error(`${response.data.msg}`);
        CbTogglePopup();
        setButtonLoading(false);
      }
    }).catch((error) => {
      setButtonLoading(false);
      if (error.response && !error.response.data.success) {
        toast.error(error.response.data.msg);
        navigateTO("/user/auth/signin");
        dispatch(UserLoggedOut());
      } else {
        toast.error(`Server error: ${error.message}`);
      }
    })
  }

  const handleUploadClick = (e) => {
    e?.preventDefault()
    CbRef.current.click();
    CbTogglePopup(e);
  }

  return <div className='__EditProfile__UpdatePicturePopup_Container'>
    <div className='__Setting__UpdatePicturePopup'>
      <img src={CbProfile ?? defaultPicture} alt={"user profile"} className='__popupUserProfile' onError={(e) => { e.target.src = `${defaultPicture}`; e.onError = null; }} />
      <h3 className='__UpdatePicturePopup_Heading'>Update Profile picture</h3>

      <button type='button' className='__UpdatePicturePopupButtons __UpdatePictureButton' onClick={handleUploadClick}>Upload Photo</button>

      <button type='button' className={`__UpdatePicturePopupButtons __RemoveCurrentPictureButton ${buttonLoading && 'Unactive'}`} onClick={handleRemoveProfile}>
        {
          buttonLoading ? <ButtonLoader /> : ' Remove Current Photo'
        }
      </button>
      <button type='button' className='__UpdatePicturePopupButtons' onClick={CbTogglePopup}>Cancle</button>
    </div>


  </div>
}