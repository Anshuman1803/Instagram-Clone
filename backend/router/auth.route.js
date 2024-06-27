const authRoute = require("express").Router();
const { otpSender,userRegister, userSignIn, forgotPassword, resetPassword, authenticateUser, } = require("../controller/auth.controller");

authRoute.post("/verify/token", authenticateUser);
authRoute.post("/user/verify-account", otpSender);
authRoute.post("/user/register", userRegister);
authRoute.post("/user/signin", userSignIn);
authRoute.post("/user/password/forgot-password", forgotPassword);
authRoute.post("/user/password/reset-password", resetPassword);

module.exports = { authRoute }