const mongoose = require("mongoose");
const otpModel = mongoose.Schema({
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
const otpCollection = mongoose.model("OTPS", otpModel);
module.exports = { otpCollection }