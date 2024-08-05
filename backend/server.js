const { userRoute } = require("./router/user.route");
const { postRoute } = require("./router/post.route");
const { commentsRoute } = require("./router/comments.route");
const express = require("express");
const cors = require("cors");
const appServer = express();
const dotENV = require("dotenv");
const { mongooseConnection } = require("./config/mongooseConnection");
const { verifyOTP } = require("./controller/otpController");
const { authRoute } = require("./router/auth.route");
const { reportProblem } = require("./controller/report.conroller");
const session = require("express-session");
const passport = require("passport");
const { googleRoute } = require("./router/google.routes");
const { userCollection } = require("./model/user.model");
const { notificationRoutes } = require("./router/notification.routes");
const { emailSender } = require("./helper/Email");
const { notificationCollection } = require("./model/notification.model");
dotENV.config();
appServer.use(express.json());
appServer.use(
  cors({
    origin: "*",
  })
);
appServer.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
appServer.use(passport.initialize());
appServer.use(passport.session());

appServer.use("/api/v1/auth", authRoute);
appServer.use("/api/v1", googleRoute);
appServer.use("/api/v1/users", userRoute);
appServer.use("/api/v1/posts", postRoute);
appServer.use("/api/v1/comments", commentsRoute);
appServer.use("/api/v1/notifications", notificationRoutes);
appServer.post("/api/v1/verify-OTP", verifyOTP);
appServer.post("/api/v1/send/reportorfeedback/:currentuser", reportProblem);

const httpServer = require("http").createServer(appServer);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: "GET, POST, PATCH, DELETE, PUT",
    credentials: true,
  },
});
io.on("connection", async (socket) => {
  const { instaUserID } = socket.handshake.query;
  try {
    await userCollection.findByIdAndUpdate(instaUserID, { socketId: socket.id }, { upsert: true });
    console.log(`Connected user ${instaUserID} ${socket.id}`);
  } catch (error) {
    console.log("Error while connecting user", error.message);
  }

  // sending the notification to the postOwner
  socket.on("sendNotificationFromUser", async (data) => {
    const { owner } = data;
    try {
      const findOwner = await userCollection.findById(owner);
      if (findOwner?.socketId) {
        io.to(findOwner.socketId).emit("receiveNotificationFromUser", data);
      } else {
        const emailSubject = `Someone ${
          data.notificationType === "like" ? "liked your post" : "commented on your post"
        } on Instagram-Clone`;
        await emailSender(
          findOwner.userEmail,
          emailSubject,
          `Hi ${findOwner?.userName},\n\nWe wanted to let you know that ${emailSubject}!\n\nThank you for being an active member of our community. If you have any questions or need assistance, please do not hesitate to contact us.\nSincerely,\nThe Instagram-Clone support team\nContact: +917061751101`
        );
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });

  // trigger the notification method on the frontend
  socket.on("sendLoadNotification", () => {
    socket.emit("loadNotification");
  });

  // send Email & Notification to the followers when the user post something
  socket.on("sendNotificationFromUserToFollowers", (data) => {
    try {
      const { postCreator, postCreatorUserName, postID, followersList } = data;
      followersList.length > 0 &&
        followersList.forEach(async (followers) => {
          notificationCollection.create({
            owner: followers,
            postID: postID,
            userID: postCreator,
            notificationText: "post new picture",
            notificationStatus: "unread",
            notificationType: "post",
            createdAt: new Date(),
          });
          let findFollowersUser = await userCollection.findById(followers).select("userEmail userName _id socketId");

          if (findFollowersUser.socketId) {
            io.to(findFollowersUser.socketId).emit("receiveNotificationFromUser", data);
          } else {
            await emailSender(
              findFollowersUser.userEmail,
              `${postCreatorUserName} post a new picture`,
              `Hi ${followers?.userName},\n\nWe wanted to let you know that ${postCreatorUserName} post a new picture!\n\nThank you for being an active member of our community. If you have any questions or need assistance, please do not hesitate to contact us.\nSincerely,\nThe Instagram-Clone support team\nContact: +917061751101`
            );
          }
        });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });

  socket.on("disconnect", async () => {
    try {
      await userCollection.findByIdAndUpdate(instaUserID, { socketId: "" }, { upsert: true });
    } catch (error) {
      console.log("Error while connecting user", error.message);
    }
  });
});

httpServer.listen(5000, async () => {
  try {
    await mongooseConnection();
    console.log(`SERVER STARED  : http://localhost:${process.env.PORT}`);
  } catch (err) {
    console.log(`SOMETHING WENT WRONG : ${err}`);
  }
});
