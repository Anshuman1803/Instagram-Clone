import React, { useRef, useState } from 'react'
import { MdDelete } from "react-icons/md";
import ButtonLoader from "../../../components/ButtonLoader"
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserLoggedOut } from '../../../Redux/ReduxSlice';
function Privacy() {
  return (
    <section className='__Setting__PrivacyContainer'>

      <div className='__PrivacyContainer__DeleteAccoutBox'>
        <UserDeleteComponent />
      </div>

    </section>
  )
}

export default Privacy


function UserDeleteComponent() {
  const { instaUserID, instaTOKEN } = useSelector((state) => state.Instagram);
  const passRef = useRef()
  const navigateTO = useNavigate();
  const dispatch = useDispatch();
  const [togglePass, setTogglePass] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [toggleConfirmPass, setTogglConfirmPass] = useState(false);
  const [togglePopup, setTogglePopup] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userPassword: "",
    confirmPassword: ""
  });
  const headers = {
    Authorization: `Bearer ${instaTOKEN}`,
  };

  const handleOnchangePassword = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value.trim() });
  }

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    setButtonLoading(true)
    if (userDetails.userPassword !== userDetails.confirmPassword) {
      toast.error('Password not matched');
      passRef.current.focus();
      setButtonLoading(false)
    } else {
      axios.post(`http://localhost:5000/api/v1/auth/user/verify-user-password`, {
        userID: instaUserID,
        userPassword: userDetails.userPassword
      }, { headers }).then((response) => {
        if (response.data.success) {
          toast.success(response.data.msg)
          setButtonLoading(false);
          setTogglePopup(true)
        } else {
          toast.error(response.data.msg)
          setButtonLoading(false);
        }

      }).catch((error) => {
        if (error.response && !error.response.data.success) {
          toast.error(error.response.data.msg);
          navigateTO("/user/auth/signin");
          dispatch(UserLoggedOut());
        } else {
          toast.error(`Server error: ${error.message}`);
        }
        setButtonLoading(false);
      })
    }
  }
  return <>
    <h1 className='__DeleteAccountBox__heading'>Delete Account</h1>

    <form className='__DeleteAccountBox_Deleteform'>

      <div className='__Deleteform_Row'>
        <label htmlFor='password' className='__Deleteform__label'>Enter Password</label>
        <input type={`${togglePass ? 'text' : "password"}`} name='userPassword' id='password' placeholder='Enter your current password' className='__DeleteformRow__inputBox' onChange={handleOnchangePassword} value={userDetails?.userPassword} autoComplete='off' maxLength={15} />
        {
          userDetails.userPassword.length > 0 && <button type='button' className='__DeleteForm__ShowPassbtn' onClick={() => setTogglePass(!togglePass)}>
            {
              togglePass ? 'Hide' : 'Show'
            }
          </button>
        }
      </div>

      <div className='__Deleteform_Row'>
        <label htmlFor='confirmPassword' className='__Deleteform__label'>Confirm Password</label>
        <input type={`${toggleConfirmPass ? 'text' : "password"}`} name='confirmPassword' id='confirmPassword' placeholder='Confirm your password' className='__DeleteformRow__inputBox' ref={passRef} onChange={handleOnchangePassword} value={userDetails?.confirmPassword} autoComplete='off' maxLength={15} />
        {
          userDetails.confirmPassword.length > 0 && <button type='button' className='__DeleteForm__ShowPassbtn' onClick={() => setTogglConfirmPass(!toggleConfirmPass)}>
            {
              toggleConfirmPass ? 'Hide' : 'Show'
            }
          </button>
        }
      </div>

      <div className='__DeleteForm__buttonContainer'>
        <button type="button" onClick={handleDeleteAccount} className={`__Deleteform__deleteButton ${(userDetails.userPassword.length === 0 || userDetails.confirmPassword.length === 0) && 'Unactive'} ${buttonLoading && 'Unactive'}`}>
          {
            buttonLoading ? <ButtonLoader /> : 'Delete'
          }
        </button>
      </div>

    </form>

    {
      togglePopup && <DeleteAccoutPopup CbTogglePopup={setTogglePopup} propsUserDetails={userDetails} />
    }

  </>
}

function DeleteAccoutPopup({ CbTogglePopup, propsUserDetails }) {
  const [buttonLoading] = useState(false)
  const handleDeleteAccount = (e) => {
    e.preventDefault();

  }
  return <section className='__DeleteAccoutPopupContainer'>

    <div className='__DeleteAccoutPopup'>
      <h2 className='__DeleteAccountPopup__Heading'>
        <span className='__DeleteAccoutPopup__ICON'> <MdDelete /> </span>
        Delete Account ?
      </h2>
      <ul className='__DeleteAccountPopup__LIST'>
        <li>You will permanently lost your: </li>
        <li className='__DeleteAccountPopup__listITEM'>- profile</li>
        <li className='__DeleteAccountPopup__listITEM'>- messages</li>
        <li className='__DeleteAccountPopup__listITEM'>- Posts</li>
      </ul>
      <div className='__DeleteAccoutPopup_ButtonContainer'>
        <button type='button' onClick={() => CbTogglePopup(false)} className={`__DeleteAccoutPopup_Buttons ${buttonLoading && 'Unactive'}`}>Cancle</button>
        <button type='button' onClick={handleDeleteAccount} className={`__DeleteAccoutPopup_Buttons ${buttonLoading && 'Unactive'}`}>

          {
            buttonLoading ? <ButtonLoader /> : ' Delete Account'
          }
        </button>
      </div>
    </div>
  </section>

}