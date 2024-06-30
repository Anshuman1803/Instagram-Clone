import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from 'react-icons/rx';
import { UserLoggedOut } from '../Redux/ReduxSlice';

import defaultProfile from '../Assets/DefaultProfile.png';
import Loader from '../Assets/postCommentLoader.gif';
import toast from 'react-hot-toast';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export function LikedByList({ postID, CbClose }) {
    const { instaTOKEN, instaFollowing, instaUserID } = useSelector((state) => state.Instagram);
    const headers = { Authorization: `Bearer ${instaTOKEN}` };
    const [userList, setUserList] = useState([]);
    const [Loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigateTO = useNavigate();
    useEffect(() => {
        setLoading(true);
        axios
            .get(`${BACKEND_URL}posts/get-likedby-user-list/${postID}`, { headers })
            .then((response) => {
                if (response.data.success) {
                    setUserList(response.data.likedByData);
                    setLoading(false);
                } else {
                    toast.error(response.data.msg);
                    setUserList(response.data.likedByData);
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                if (error.response && !error.response.data.success) {
                    toast.error(error.response.data.msg);
                    navigateTO('/user/auth/signin');
                    dispatch(UserLoggedOut());
                } else {
                    toast.error(`Server error: ${error.message}`);
                }
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <section className="__likelistPopup_Container">
            <div className="__likelistPopup">
                <header className="__likelistPopup_heading">
                    Likes
                    <RxCross2 className="__likelistPopup_closeButton" onClick={() => CbClose('')} />
                </header>
                <ul className="__likelistPopup_userList">
                    {Loading ? (
                        <img src={Loader} alt="Loading" className="__likelistPopup_loading" />
                    ) : (
                        <>
                            {userList?.map((data) => {
                                return (
                                    <li key={data?._id} className="__likelistPopup_userList_ITEMS">
                                        <img
                                            src={data?.userProfile ? data?.userProfile : defaultProfile}
                                            alt="user profile"
                                            className="__likelistPopup_userProfile"
                                        />
                                        <p className="__likelistPopup_userInfo">
                                            <Link to={`/${data?._id}`} className="__likelistPopup_userName">
                                                {data?.userName}
                                            </Link>
                                            <span className="__likelistPopup_userFullName">{data?.fullName}</span>
                                        </p>
                                        {instaUserID !== data?._id && (
                                            <>
                                                {instaFollowing?.includes(data?._id) ? (
                                                    <button className="__likelistPopup_buttons">Unfollow</button>
                                                ) : (
                                                    <button className="__likelistPopup_buttons">Follow</button>
                                                )}
                                            </>
                                        )}
                                    </li>
                                );
                            })}
                        </>
                    )}
                </ul>
            </div>
        </section>
    );
}
