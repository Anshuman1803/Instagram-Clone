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

dotENV.config();
appServer.use(express.json());
appServer.use(
  cors({
    origin: "*",
  })
);


appServer.use("/api/v1/auth",authRoute);
appServer.use("/api/v1/users",userRoute);
appServer.use("/api/v1/posts",postRoute);
appServer.use("/api/v1/comments",commentsRoute);
appServer.post("/api/v1/verify-OTP", verifyOTP)


appServer.listen(5000, async () => {
  try {
    await mongooseConnection();
    console.log(`SERVER STARED  : http://localhost:${process.env.PORT}`);
  } catch (err) {
    console.log(`SOMETHING WENT WRONG : ${err}`);
  }
});