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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export default function Notification() {
  const navigateTO = useNavigate();
  const dispatch = useDispatch();
  const { instaUserID } = useSelector((state) => state.Instagram);
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [allNotification, setAllNotification] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Load all the notifications
  const loadNotifications = () => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}notifications/get-notifications/${instaUserID}`)
      .then((response) => {
        if (response.data.success) {
          setAllNotification(response.data.notifications);
          setLoading(false);
          console.log(response.data.notifications);
        } else {
          setAllNotification(response.data.notifications);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response?.status === 401) {
          dispatch(UserLoggedOut());
          navigateTO("/user/auth/signin");
          toast.error("Your session has expired. Please login again.");
        } else if (error.response?.status === 404) {
          setAllNotification(error.response.data.notifications);
        } else {
          toast.error(`Server error: ${error.message}`);
        }
      });
  };

  const handleToggleOptions = useCallback(
    (e) => {
      e.preventDefault();
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
      setAllNotification(allNotification?.filter((notification) => notification.notificationStatus === "Unread"));
    }
  };

  // initial notificationLoading
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadNotifications, []);
  return (
    <section className={`${pageStyle.__notificationContainer}`}>
      <h1 className={`${pageStyle.__notificationHeading}`}>
        Notifications
        <select className={`${pageStyle.__notificationSort}`}>
          <option value="">Sort by</option>
          <option value="oldest">oldest</option>
          <option value="newest">newest</option>
        </select>
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
        <button className={`${pageStyle.__notificationFilter__items}`}>Mark all as read</button>
      </div>

      <div className={`${pageStyle.__notificationbox}`}>
        {Loading ? (
          <p></p>
        ) : (
          <>
            {allNotification.length === 0 ? (
              <p></p>
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
                            onClick={handleToggleOptions}
                            className={`${pageStyle.__notificationOption}`}
                          />
                        </span>
                      </p>

                      <div className={`${pageStyle.__notification__PostPoster}`}>
                        <img src={notification?.post?.postPoster} alt={`post poster`} />
                      </div>

                      {showOptions && (
                        <NotificationActionPopup
                          notificationID={notification._id}
                          userID={notification?.user?._id}
                          postID={notification?.post?._id}
                          CbClosePopup={handleToggleOptions}
                        />
                      )}
                    </article>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

const NotificationActionPopup = ({ CbClosePopup, notificationID, userID }) => {
  const navigateTO = useNavigate();

  // go to user profile
  const handleGotoProfile = (e) => {
    CbClosePopup(e);
    navigateTO(`/${userID}`);
  };

  // delete notification
  const handleDeleteNotification = (e) => {
    e.preventDefault();
  };

  // marked notification as read
  const handleMarkAsRead = (e) => {
    e.preventDefault();
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
        <button onClick={handleMarkAsRead} title="Mark as read" className={`${pageStyle.__notificationActionButton}`}>
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
