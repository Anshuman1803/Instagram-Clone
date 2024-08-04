import React, { useCallback, useEffect, useState } from "react";
import pageStyle from "./notifications.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { UserLoggedOut } from "../../../Redux/ReduxSlice";
import toast from "react-hot-toast";
import { CalculateTimeAgo } from "../../../utility/TimeAgo";
import { MdDelete } from "react-icons/md";
import { MdMarkEmailRead } from "react-icons/md";
// import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { FaUser } from "react-icons/fa";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import Loader from "../../../Assets/postCommentLoader.gif";
import Notification404 from "./Notification404";
import socket from "../../../utility/socket";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export default function Notification() {
  const navigateTO = useNavigate();
  const dispatch = useDispatch();
  const { instaUserID,instaTOKEN } = useSelector((state) => state.Instagram);
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [allNotification, setAllNotification] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState({});
  const headers = {
    Authorization: `Bearer ${instaTOKEN}`,
  };

  // Load all the notifications
  const loadNotifications = () => {
    axios
      .get(`${BACKEND_URL}notifications/get-notifications/${instaUserID}`,{headers})
      .then((response) => {
        if (response.data.success) {
          setAllNotification(response.data.notifications);
        } else {
          setAllNotification(response.data.notifications);
        }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          dispatch(UserLoggedOut());
          navigateTO("/user/auth/signin");
          toast.error("Your session has expired. Please login again.");
        } else if (error.response?.status === 404) {
          setAllNotification(error.response.data.notifications);
        } else {
          toast.error(`Server error: ${error.message}`);
        }
      }).finally(()=>{
        setLoading(false);
      })
  };

  // toggle the optiong popup
  const handleToggleOptions = useCallback(
    (e, notificationID, userID, postID,notificationStatus) => {
      e.preventDefault();
      setSelectedNotification({
        notificationID: notificationID,
        userID: userID,
        postID: postID,
        notificationStatus : notificationStatus
      });
      setShowOptions(!showOptions);
    },
    [showOptions]
  );

  // handle toggle notification filter All or unread
  const handleToggleNotificationFilter = (e, filter) => {
    e.preventDefault();
    setNotificationFilter(filter);
    if (filter === "all") {
      loadNotifications();
    } else {
      setAllNotification(allNotification?.filter((notification) => notification.notificationStatus === "unread"));
    }
  };

  // sorting based on notification time oldest or newest
  const handleNotificationSorting = (e) => {
    const { value } = e.target;
    let sortedNotifications;
    switch (value) {
      case "oldest": {
        sortedNotifications = [...allNotification].sort((a, b) => a.createdAt - b.createdAt);
        break;
      }
      case "newest": {
        sortedNotifications = [...allNotification].sort((a, b) => b.createdAt - a.createdAt);
        break;
      }
      default: {
        loadNotifications();
      }
    }
    setAllNotification(sortedNotifications);
  };

  // Mark all the notifications as read
  const handleMarkAllAsRead = (e) => {
    e.preventDefault();
    axios
    .patch(`${BACKEND_URL}notifications/mark-All-notification-as-read/${instaUserID}`,{},{headers})
      .then((response) => {
        if (response.data.success) {
          toast.success(`${response.data.msg}`);
        } else {
          toast.error(`${response.data.msg}`);
        }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          dispatch(UserLoggedOut());
          navigateTO("/user/auth/signin");
          toast.error("Your session has expired. Please login again.");
        } else {
          toast.error(`Server error: ${error.message}`);
        }
      }).finally(()=>{
        socket.emit("sendLoadNotification", "load")
      })
  };

  useEffect(() => {
    socket.on("receiveNotificationFromUser", () => {
      loadNotifications();
    });

    socket.on("loadNotification", () => {
      loadNotifications();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadNotifications, []);

  return (
    <section className={`${pageStyle.__notificationContainer}`}>
      <h1 className={`${pageStyle.__notificationHeading}`}>
        Notifications
        {allNotification.length > 0 && (
          <select className={`${pageStyle.__notificationSort}`} onChange={handleNotificationSorting}>
            <option value="oldest">oldest</option>
            <option value="newest">newest</option>
          </select>
        )}
      </h1>

      <div className={`${pageStyle.__notification_FilterBox}`}>
        <button
          className={`${pageStyle.__notificationFilter__items} ${
            notificationFilter === "all" && pageStyle.__activeItemButton
          }`}
          onClick={(e) => handleToggleNotificationFilter(e, "all")}
        >
          All
        </button>
        <button
          className={`${pageStyle.__notificationFilter__items} ${
            notificationFilter === "unread" && pageStyle.__activeItemButton
          }`}
          onClick={(e) => handleToggleNotificationFilter(e, "unread")}
        >
          Unread
        </button>
       
       {
        allNotification?.some((data)=>data.notificationStatus === 'unread') && <button onClick={handleMarkAllAsRead} className={`${pageStyle.__notificationFilter__items} ${pageStyle.__markAllAsReadButton}`}>Mark all as read</button>
       }
      </div>

      <div className={`${pageStyle.__notificationbox}`}>
        {Loading ? (
         <img src={Loader} alt="Loader" className={`${pageStyle.__notificationLoader}`}/>
        ) : (
          <>
            {allNotification.length === 0 ? (
              <>
             <Notification404 notificationFilter={notificationFilter}/>
              </>
            ) : (
              <>
                {allNotification?.map((notification) => {
                  return (
                    <article
                      key={notification._id}
                      className={`${pageStyle.__notificationsCard} ${
                        notification?.notificationStatus === "unread" && pageStyle.__unreadNotification
                      }`}
                    >
                      <div className={`${pageStyle.__notification__userProfile}`}>
                        <img src={notification?.user?.userProfile} alt={`${notification?.user?.userName}'s profile`} />
                      </div>
                      <p className={`${pageStyle.__notification__content}`}>
                        <span className={`${pageStyle.__notification_text}`}> {notification?.notificationText}</span>
                        <span className={`${pageStyle.__notification_timing}`}>
                          <CalculateTimeAgo time={notification?.createdAt} />
                          <PiDotsThreeOutlineFill
                            onClick={(e) =>
                              handleToggleOptions(e, notification._id, notification?.user?._id, notification?.post?._id,notification?.notificationStatus )
                            }
                            className={`${pageStyle.__notificationOption}`}
                          />
                        </span>
                      </p>

                      <div className={`${pageStyle.__notification__PostPoster}`}>
                        <img src={notification?.post?.postPoster} alt={`post poster`} />
                      </div>
                    </article>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
      {showOptions && (
        <NotificationActionPopup
          selectedNotification={selectedNotification}
          CbClosePopup={handleToggleOptions}
        />
      )}
    </section>
  );
}

const NotificationActionPopup = ({ CbClosePopup, selectedNotification }) => {
  const navigateTO = useNavigate();
  const dispatch = useDispatch();
  const {instaTOKEN } = useSelector((state) => state.Instagram);
  const headers = {
    Authorization: `Bearer ${instaTOKEN}`,
  };

  // go to user profile
  const handleGotoProfile = (e) => {
    CbClosePopup(e);
    navigateTO(`/${selectedNotification.userID}`);
  };

  // delete notification
  const handleDeleteNotification = (e) => {
    e.preventDefault();
    axios.delete(`${BACKEND_URL}notifications/delete-notification/${selectedNotification.notificationID}`,{headers}).then((response)=>{
      if (response.data.success) {
        toast.success(response.data.msg);
      }
    }).catch((error)=>{
      if (error.response?.status === 401) {
        dispatch(UserLoggedOut());
        navigateTO("/user/auth/signin");
        toast.error("Your session has expired. Please login again.");
      } else {
        toast.error(`Server error: ${error.message}`);
      }
    }).finally(()=>{
      CbClosePopup(e);
      socket.emit("sendLoadNotification", "load")
    })
  };

  // marked notification as read
  const handleMarkAsRead = (e) => {
    e.preventDefault();
    axios
      .patch(`${BACKEND_URL}notifications/mark-notification-as-read/${selectedNotification.notificationID}`,{},{headers})
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.msg);
        }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          dispatch(UserLoggedOut());
          navigateTO("/user/auth/signin");
          toast.error("Your session has expired. Please login again.");
        } else {
          toast.error(`Server error: ${error.message}`);
        }
      }).finally(()=>{
        CbClosePopup(e);
        socket.emit("sendLoadNotification", "load")
      })
  };

  return (
    <div className={`${pageStyle.__notificationActionContainer}`}>
      <div className={`${pageStyle.__actionBox}`}>
        <h2 className={`${pageStyle.__actionBoxHeading}`}>Notifications</h2>
        <button
          onClick={handleDeleteNotification}
          title="Delete Notification"
          className={`${pageStyle.__notificationActionButton}`}
        >
          <MdDelete className={`${pageStyle.__notificationActionICON}`} />
          Delete notification
        </button>
        <button onClick={handleMarkAsRead} title="Mark as read" className={`${pageStyle.__notificationActionButton} ${selectedNotification.notificationStatus === "read" && pageStyle.__notificationActionUnacitve}`}>
          <MdMarkEmailRead className={`${pageStyle.__notificationActionICON}`} />
          Mark as read
        </button>
        {/* <button onClick={handleGotoProfile} className={`${pageStyle.__notificationActionButton}`}>
          <LiaExternalLinkAltSolid className={`${pageStyle.__notificationActionICON}`} />
          Go to post
        </button> */}
        <button onClick={handleGotoProfile} className={`${pageStyle.__notificationActionButton}`}>
          <FaUser className={`${pageStyle.__notificationActionICON}`} />
          Go to profile
        </button>
        <button className={`${pageStyle.__notificationActionButton}`} onClick={CbClosePopup}>
          <RxCross2 className={`${pageStyle.__notificationActionICON}`} />
          Close
        </button>
      </div>
    </div>
  );
};
