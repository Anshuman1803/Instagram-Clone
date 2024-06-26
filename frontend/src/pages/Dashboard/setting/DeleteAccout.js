import React, { useEffect, useRef, useState } from 'react'
import { MdDelete } from "react-icons/md";
import ButtonLoader from "../../../components/ButtonLoader"
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserLoggedOut } from '../../../Redux/ReduxSlice';
import settingStyle from "./setting.module.css"
export default function UserDeleteComponent() {
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

    const handleClickSendOTP = (e) => {
        e.preventDefault();
        setButtonLoading(true)
        if (userDetails.userPassword !== userDetails.confirmPassword) {
            toast.error('Password not matched');
            passRef.current.focus();
            setButtonLoading(false)
        } else {
            axios.post(`http://localhost:5000/api/v1/users/verify-user-password`, {
                userID: instaUserID,
                userPassword: userDetails.userPassword
            }, { headers }).then((response) => {
                if (response.data.success) {
                    toast.success(response.data.msg)
                    setButtonLoading(false);
                    setTogglePopup(true);
                    setUserDetails({
                        userPassword: "",
                        confirmPassword: ""
                    })
                } else {
                    toast.error(response.data.msg);
                    setUserDetails({
                        userPassword: "",
                        confirmPassword: ""
                    })
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
        <h1 className={`${settingStyle.__DeleteAccountBox__heading}`}>Delete Account</h1>

        <form className={`${settingStyle.__DeleteAccountBox_Deleteform}`}>

            <div className={`${settingStyle.__Deleteform_Row}`}>
                <label htmlFor='password' className={`${settingStyle.__Deleteform__label}`}>Enter Password</label>
                <input type={`${togglePass ? 'text' : "password"}`} name='userPassword' id='password' placeholder='Enter your current password' className={`${settingStyle.__DeleteformRow__inputBox}`} onChange={handleOnchangePassword} value={userDetails?.userPassword} autoComplete='off' maxLength={15} />
                {
                    userDetails.userPassword.length > 0 && <button type='button' className={`${settingStyle.__DeleteForm__ShowPassbtn}`} onClick={() => setTogglePass(!togglePass)}>
                        {
                            togglePass ? 'Hide' : 'Show'
                        }
                    </button>
                }
            </div>

            <div className={`${settingStyle.__Deleteform_Row}`}>
                <label htmlFor='confirmPassword' className={`${settingStyle.__Deleteform__label}`}>Confirm Password</label>
                <input type={`${toggleConfirmPass ? 'text' : "password"}`} name='confirmPassword' id='confirmPassword' placeholder='Confirm your password' className={`${settingStyle.__DeleteformRow__inputBox}`} ref={passRef} onChange={handleOnchangePassword} value={userDetails?.confirmPassword} autoComplete='off' maxLength={15} />
                {
                    userDetails.confirmPassword.length > 0 && <button type='button' className={`${settingStyle.__DeleteForm__ShowPassbtn}`} onClick={() => setTogglConfirmPass(!toggleConfirmPass)}>
                        {
                            toggleConfirmPass ? 'Hide' : 'Show'
                        }
                    </button>
                }
            </div>

            <div className={`${settingStyle.__DeleteForm__buttonContainer}`}>
                <button type="button" onClick={handleClickSendOTP} className={`${settingStyle.__Deleteform__deleteButton} ${(userDetails.userPassword.length === 0 || userDetails.confirmPassword.length === 0) && 'Unactive'} ${buttonLoading && 'Unactive'}`}>
                    {
                        buttonLoading ? <ButtonLoader /> : 'Send OTP'
                    }
                </button>
            </div>

        </form>

        {
            togglePopup && <DeleteAccoutPopup CbTogglePopup={setTogglePopup} />
        }

    </>
}

//  After confirming their password user get OTP and here they will verify their OTP and permanently delete their accounts.
function DeleteAccoutPopup({ CbTogglePopup }) {
    const { instaUserID, instaTOKEN } = useSelector((state) => state.Instagram);
    const navigateTO = useNavigate();
    const dispatch = useDispatch();
    const headers = {
        Authorization: `Bearer ${instaTOKEN}`,
    };

    const firstInputRef = useRef();
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [buttonLoading, setbuttonLoading] = useState(false);

    useEffect(() => {
        firstInputRef.current.focus();
    }, []);

    const handleOTPChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value) || value.includes(" ")) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && e.target.nextSibling) {
            e.target.nextSibling.focus();
        }
    };

    const handleOTPkeydown = (e, index) => {
        if (e.keyCode === 8 && !otp[index] && index > 0) {
            e.preventDefault();
            const newOtp = [...otp];
            newOtp[index - 1] = "";
            setOtp(newOtp);
            e.target.previousSibling.focus();
        }
    };

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        setbuttonLoading(true);
        axios.delete("http://localhost:5000/api/v1/users/delete-user-account", {
            headers,
            data: {
                OTP: Number(otp.join("")),
                userID: instaUserID
            }
        }).then((response) => {
            if (response.data.success) {
                toast.success(response.data.msg);
                navigateTO("/user/auth/signin");
                dispatch(UserLoggedOut());
                setbuttonLoading(false);
            } else {
                toast.error(response.data.msg);
                setbuttonLoading(false);
            }
        }).catch((error) => {
            if (error.response && !error.response.data.success) {
                toast.error(error.response.data.msg);
                navigateTO("/user/auth/signin");
                dispatch(UserLoggedOut());
            } else {
                toast.error(`Server error: ${error.message}`);
            }
            setbuttonLoading(false);
        })
    }

    return <section className={`${settingStyle.__DeleteAccoutPopupContainer}`}>

        <div className={`${settingStyle.__DeleteAccoutPopup}`}>
            <h2 className={`${settingStyle.__DeleteAccountPopup__Heading}`}>
                <span className={`${settingStyle.__DeleteAccoutPopup__ICON}`}> <MdDelete /> </span>
                Delete Account ?
            </h2>
            <ul className={`${settingStyle.__DeleteAccountPopup__LIST}`}>
                <li>You will permanently lost your: </li>
                <li className={`${settingStyle.__DeleteAccountPopup__listITEM}`}>- profile</li>
                <li className={`${settingStyle.__DeleteAccountPopup__listITEM}`}>- messages</li>
                <li className={`${settingStyle.__DeleteAccountPopup__listITEM}`}>- Posts</li>
            </ul>
            <div className={`OTPForm__inputboxContainer ${settingStyle.__DeleteAccountPopup__OTPContainer}`}>
                {otp.map((data, index) => (
                    <input
                        key={index}
                        id={index}
                        type="text"
                        maxLength={1}
                        className="OTPForm__input"
                        value={data}
                        onChange={(e) => handleOTPChange(e, index)}
                        onKeyDown={(e) => handleOTPkeydown(e, index)}
                        onFocus={(e) => e.target.select()}
                        ref={index === 0 ? firstInputRef : null}
                        readOnly={buttonLoading}
                    />
                ))}
            </div>
            <div className={`${settingStyle.__DeleteAccoutPopup_ButtonContainer}`}>
                <button type='button' onClick={() => CbTogglePopup(false)} className={`${settingStyle.__DeleteAccoutPopup_Buttons} ${buttonLoading && 'Unactive'}`}>Cancle</button>
                <button type='button' onClick={handleDeleteAccount} className={`${settingStyle.__DeleteAccoutPopup_Buttons} ${buttonLoading && 'Unactive'}`}>
                    {
                        buttonLoading ? <ButtonLoader /> : ' Delete Account'
                    }
                </button>
            </div>

        </div>
    </section>

}