const {userRoute} = require("./router/user.route");
const express = require("express");
const cors = require("cors");
const appServer = express();
const dotENV = require("dotenv");
const { mongooseConnection } = require("./config/mongooseConnection");

dotENV.config();
appServer.use(express.json());
appServer.use(
  cors({
    origin: "*",
  })
);

appServer.use("/api/v1/auth",userRoute);


appServer.listen(5000, async () => {
  try {
    await mongooseConnection();
    console.log(`SERVER STARED  : http://localhost:${process.env.PORT}`);
  } catch (err) {
    console.log(`SOMETHING WENT WRONG : ${err}`);
  }
});