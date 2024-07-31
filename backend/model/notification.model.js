const mongoose = require("mongoose");
const notificationModel = mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    OTP: {
        type: Number,
        required: true,
        length: 6
    },
    otpExpireAt: {
        type: Number,
        required: true,
    }
});
const notificationCollection = mongoose.model("notifications", notificationModel);
module.exports = { notificationCollection }