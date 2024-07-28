import React, { useEffect, useRef, useState } from 'react'
import defaultPicture from '../../../../Assets/DefaultProfile.png'
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserLoggedOut, userUpdateDetails } from '../../../../Redux/ReduxSlice';
import axios from "axios"
import toast from "react-hot-toast"
import ButtonLoader from "../../../../components/ButtonLoader"
import editProfileStyle from "./editprofile.module.css"
import EditProfileLoader from './EditProfileLoader';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function EditProfile() {
  const imageInputRef = useRef();
  const { instaUserID, instaTOKEN } = useSelector((state) => (state.Instagram));
  const [ShowPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch()
  const navigateTO = useNavigate();
  const [Loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false)
  const [userDetails, setUserDetails] = useState({
    userName: "",
    fullName: "",
    gender: "",
    userBio: "",
    profilePicture: "",
    website: "",
  });
  const [selectedImgPath, setSelectedImg] = useState(null)
  const headers = {
    Authorization: `Bearer ${instaTOKEN}`,
    "Content-Type": "multipart/form-data"
  };

  const handleTogglePopup = () => {
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

  const loaduserDetails = () => {
    setLoading(true);
    axios.get(`${BACKEND_URL}users/${instaUserID}`,{ headers }).then((response) => {
      if (response.data.success) {
        setLoading(false);
        setUserDetails({
          userName: response.data.user.userName,
          fullName: response.data.user.fullName,
          gender: response.data.user.gender ?? "",
          userBio: response.data.user.userBio ?? "N/A",
          profilePicture: response.data.user.userProfile,
          website: response.data.user.website ?? "N/A",
        })
      } else {
        setLoading(false);
        toast.error(`User not found`);
      }
    }).catch((error) => {
      setLoading(false);
      if (error.response.status === 401) {
        dispatch(UserLoggedOut());
        navigateTO("/user/auth/signin")
        toast.error("Your session has expired. Please login again.");
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
    formData.append("website", userDetails?.website);
    formData.append("profilePicture", selectedImgPath);
    axios.patch(`${BACKEND_URL}users/update-user-details/${instaUserID}`, formData, { headers }).then((response) => {
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
      if (error.response.status === 401) {
        dispatch(UserLoggedOut());
         navigateTO("/user/auth/signin")
        toast.error("Your session has expired. Please login again.");
      } else {
        toast.error(`Server error: ${error.message}`);
      }
    })
  }

  return (
    <form className={`${editProfileStyle.__EditProfile_form}`}>
      {
        Loading ? <EditProfileLoader /> : <>

          <div className={`${editProfileStyle.__EditProfile__profilePicture_box}`}>
            <div className={`${editProfileStyle.__EditProfile_userProfileBox}`}>
              <input type='file' hidden ref={imageInputRef} accept="image/*" name='profilePicture' id="profilePicture" onChange={handleInputOnChange} />
              <img src={userDetails?.profilePicture ?? defaultPicture} alt='Username profile' className={`${editProfileStyle.__EditPrfoile_userProfile}`} onError={(e) => { e.target.src = `${defaultPicture}`; e.onError = null; }} />
            </div>
            <div className={`${editProfileStyle.__EditProfile_buttonBox}`}>
              <p className={`${editProfileStyle.__editProfile__userName}`}>{userDetails.userName}</p>
              <button type="button" className={`${editProfileStyle.__changeProfilePopupButton}`} onClick={handleTogglePopup}>Change profile photo</button>
            </div>
          </div>

          <div className={`${editProfileStyle.__EditProfile__formRow}`}>
            <label htmlFor='userName' className={`${editProfileStyle.__EditProfile_formLabel}`}>User name</label>
            <input type="text" id='userName' onChange={handleInputOnChange} value={userDetails?.userName} name='userName' placeholder='userName' className={`${editProfileStyle.__EditProfile_formInputItem}`} autoComplete='off' maxLength={15} readOnly />
          </div>

          <div className={`${editProfileStyle.__EditProfile__formRow}`}>
            <label htmlFor='fullName' className={`${editProfileStyle.__EditProfile_formLabel}`}>Full Name</label>
            <input type="text" id='fullName' onChange={handleInputOnChange} value={userDetails?.fullName} name='fullName' placeholder='Full Name' className={`${editProfileStyle.__EditProfile_formInputItem}`} autoComplete='off' maxLength={20} autoCapitalize="on"
              minLength={3} />
          </div>

          <div className={`${editProfileStyle.__EditProfile__formRow}`}>
            <label htmlFor='gender' className={`${editProfileStyle.__EditProfile_formLabel}`}>Gender</label>
            <select autoCapitalize="on" id='gender' name='gender' onChange={handleInputOnChange} value={userDetails?.gender} className={`${editProfileStyle.__EditProfile_formInputItem}`} autoComplete='off' >
              <option value="">select your gender</option>
              <option className={`${editProfileStyle.__EditProfile__selectOPTION}`} value="male">male</option>
              <option className={`${editProfileStyle.__EditProfile__selectOPTION}`} value="female">female</option>
              <option className={`${editProfileStyle.__EditProfile__selectOPTION}`} value="other">other</option>
            </select>
          </div>

          <div className={`${editProfileStyle.__EditProfile__formRow}`}>
            <label htmlFor='website' className={`${editProfileStyle.__EditProfile_formLabel}`}>website</label>
            <input type="text" id='website' onChange={handleInputOnChange} value={userDetails?.website} name='website' placeholder='Your Website' className={`${editProfileStyle.__EditProfile_formInputItem}`} autoComplete='off' />
          </div>

          <div className={`${editProfileStyle.__EditProfile__formRow}`}>
            <label htmlFor='userBio' className={`${editProfileStyle.__EditProfile_formLabel}`}>Bio</label>
            <textarea name='userBio' id='userBio' onChange={handleInputOnChange} value={userDetails?.userBio} className={`${editProfileStyle.__EditProfile_formTextArea}`} placeholder='userBio' autoCapitalize="on" maxLength={150} minLength={4}></textarea>
          </div>

          <div className={`${editProfileStyle.__EditProfile__formRow} ${editProfileStyle.__EditProfile__buttonContainer}`}>
            <button type='submit' className={`${editProfileStyle.__EditProfile_saveButton}`} onClick={handleSaveChanges}>
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
    axios.patch(`${BACKEND_URL}users/remove-profile-picture/${instaUserID}`, {}, { headers }).then((response) => {
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
      if (error.response.status === 401) {
        dispatch(UserLoggedOut());
         navigateTO("/user/auth/signin")
        toast.error("Your session has expired. Please login again.");
      } else {
        toast.error(`Server error: ${error.message}`);
      }
    })
  }

  const handleUploadClick = () => {
    CbRef.current.click();
    CbTogglePopup();
  }

  return <div className={`${editProfileStyle.__EditProfile__UpdatePicturePopup_Container}`}>
    <div className={`${editProfileStyle.__Setting__UpdatePicturePopup}`}>
      <img src={CbProfile ?? defaultPicture} alt={"user profile"} className={`${editProfileStyle.__popupUserProfile}`} onError={(e) => { e.target.src = `${defaultPicture}`; e.onError = null; }} />
      <h3 className={`${editProfileStyle.__UpdatePicturePopup_Heading}`}>Update Profile picture</h3>

      <button type='button' className={`${editProfileStyle.__UpdatePicturePopupButtons} ${editProfileStyle.__UpdatePictureButton}`} onClick={handleUploadClick}>Upload Photo</button>

      <button type='button' className={`${editProfileStyle.__UpdatePicturePopupButtons} ${editProfileStyle.__RemoveCurrentPictureButton} ${buttonLoading && 'Unactive'}`} onClick={handleRemoveProfile}>
        {
          buttonLoading ? <ButtonLoader /> : ' Remove Current Photo'
        }
      </button>
      <button type='button' className={`${editProfileStyle.__UpdatePicturePopupButtons}`} onClick={CbTogglePopup}>Cancle</button>
    </div>
  </div>
}