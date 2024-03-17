const { userSignIn, userRegister, getUser } = require("../controller/user.controller");
// const 
const userRoute = require("express").Router();


userRoute.post("/user/signin", userSignIn)
userRoute.post("/user/register", userRegister);
userRoute.get("/user/:id", getUser)

module.exports = {userRoute}