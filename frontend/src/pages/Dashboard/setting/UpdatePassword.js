import React from 'react'
import ResetPassword from '../../Auth/ResetPassword'
import { useSelector } from "react-redux";
import settingStyle from "./setting.module.css"
function UpdatePassword() {
  const { instaUserID} = useSelector((state) => (state.Instagram));

  return (
    <div>
      <ResetPassword PropClassName={`${settingStyle.__Setting__UpdatePasswordContainer}`} CompTitle={"Update Your Password"} instaUserID={instaUserID}/>
    </div>
  )
}

export default UpdatePassword