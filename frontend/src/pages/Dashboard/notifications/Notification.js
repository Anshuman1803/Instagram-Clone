import React, { useState } from "react";
import pageStyle from "./notifications.module.css";
import { Link } from "react-router-dom";

export default function Notification() {
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [allNotification, setAllNotification] = useState([]);
  // const [Loading, setLoading] = useState(false);

  // Load all the notifications
  const loadNotifications= ()=>{
console.log("Loading notifications")
  }


  // handle toggle notification filter All or unread
  const handleToggleNotificationFilter = (e,filter) => {
    e.preventDefault();
    setNotificationFilter(filter)
    if (filter === "all") {
      loadNotifications();
    } else {
      setAllNotification(allNotification?.filter((notification) => notification.notificationStatus === 'Unread'));
    }
  };
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
        <button className={`${pageStyle.__notificationFilter__items} ${notificationFilter === "all" && pageStyle.__activeItemButton}`} onClick={(e)=> handleToggleNotificationFilter(e, "all")} >All</button>
        <button className={`${pageStyle.__notificationFilter__items} ${notificationFilter === "unread" && pageStyle.__activeItemButton}`} onClick={(e)=> handleToggleNotificationFilter(e, "unread")} >Unread</button>
        <button className={`${pageStyle.__notificationFilter__items}`}>Mark all as read</button>
      </div>

      <div className={`${pageStyle.__notificationbox}`}>
        <article className={`${pageStyle.__notificationsCard}`}>
          <div className={`${pageStyle.__notification__userProfile}`}>
            <img src="https://res.cloudinary.com/project-instagram-clone/image/upload/v1721941029/kuiedff4atxszqvztdrt.jpg" alt="user profile" />
          </div>
          <p className={`${pageStyle.__notification__content}`}>
            <Link className={`${pageStyle.__notification_userName}`}>mahi7781</Link>
            <span  className={`${pageStyle.__notification_text}`}> liked your post</span>
            <span  className={`${pageStyle.__notification_timing}`}>3h</span>
          </p>
          <div className={`${pageStyle.__notification__PostPoster}`}>
          <img src="https://res.cloudinary.com/project-instagram-clone/image/upload/v1715507900/frxirfs9f6ehvluzqsyp.png" alt="post Poster" />
          </div>
        </article>
      </div>
    </section>
  );
}
