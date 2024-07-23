const {userRoute} = require("./router/user.route");
const { postRoute } = require("./router/post.route");
const {commentsRoute} = require('./router/comments.route')
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


appServer.use("/api/v1/auth",authRoute);
appServer.use("/api/v1", googleRoute)
appServer.use("/api/v1/users",userRoute);
appServer.use("/api/v1/posts",postRoute);
appServer.use("/api/v1/comments",commentsRoute);
appServer.post("/api/v1/verify-OTP", verifyOTP);
appServer.post("/api/v1/send/reportorfeedback/:currentuser", reportProblem)


appServer.listen(5000, async () => {
  try {
    await mongooseConnection();
    console.log(`SERVER STARED  : http://localhost:${process.env.PORT}`);
  } catch (err) {
    console.log(`SOMETHING WENT WRONG : ${err}`);
  }
});