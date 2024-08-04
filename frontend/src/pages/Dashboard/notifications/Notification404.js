import React from "react";
import pageStyle from "./notifications.module.css";
import noNotificationPoster from "../../../Assets/noNotification.png";

function Notification404({ notificationFilter }) {
  return (
    <div className={pageStyle.__noNotificationBox}>
      <img src={noNotificationPoster} alt="No-Notification" className={pageStyle.__noNotificationPoster} />

      {notificationFilter === "all" ? (
        <>
          <h1 className={pageStyle.__noNotificationHeading}>No Notifications Yet</h1>
          <p className={pageStyle.__noNotificationSecondary_Heading}>
            We will let you know when something needs your attention
          </p>
        </>
      ): <>
       <h1 className={pageStyle.__noNotificationHeading}>All Notifications Read</h1>
          <p className={pageStyle.__noNotificationSecondary_Heading}>
          You're all caught up with your notifications
          </p>
      
      </>}
    </div>
  );
}

export default Notification404;
