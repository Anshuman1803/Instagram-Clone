import React, { useState } from 'react'

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
  const [togglePass, setTogglePass] = useState(false)
  const [toggleConfirmPass, setTogglConfirmPass] = useState(false)
  const [userDetails, setUserDetails] = useState({
    userPassword: "",
    confirmPassword: ""
  });

  const handleOnchangePassword = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value.trim() });
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
        <input type={`${toggleConfirmPass ? 'text' : "password"}`} name='confirmPassword' id='confirmPassword' placeholder='Confirm your password' className='__DeleteformRow__inputBox' onChange={handleOnchangePassword} value={userDetails?.confirmPassword} autoComplete='off' maxLength={15} />
        {
          userDetails.confirmPassword.length > 0 && <button type='button' className='__DeleteForm__ShowPassbtn' onClick={() => setTogglConfirmPass(!toggleConfirmPass)}>
            {
              toggleConfirmPass ? 'Hide' : 'Show'
            }
          </button>
        }
      </div>

      <div className='__DeleteForm__buttonContainer'>
        <button type="button" className={`__Deleteform__deleteButton ${(userDetails.userPassword.length === 0 || userDetails.confirmPassword.length === 0) && 'Unactive'}`}>Delete </button>
      </div>

    </form>

  </>
}