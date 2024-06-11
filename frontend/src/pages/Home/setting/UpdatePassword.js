import React from 'react'
import ResetPassword from '../../Auth/ResetPassword'
import { useSelector } from "react-redux";

function UpdatePassword() {
  const { instaUserID} = useSelector((state) => (state.Instagram));

  return (
    <div>
      <ResetPassword PropClassName={"__Setting__UpdatePasswordContainer"} CompTitle={"Update Your Password"} instaUserID={instaUserID}/>
    </div>
  )
}

export default UpdatePassword