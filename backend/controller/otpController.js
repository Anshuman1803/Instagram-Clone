const { otpCollection } = require("../model/otp.model");

const verifyOTP = async (req, res) => {
    try {
        const { OTP, userEmail } = req.body;
        const otpEntry = await otpCollection.findOne({ userEmail });

        if (!otpEntry) {
            return res.status(400).json({ success: false, msg: 'Invalid OTP' });
        }

        const now = Date.now();
        if (now > otpEntry.otpExpireAt) {
            await otpCollection.deleteOne({ userEmail });
            return res.status(400).json({ success: false, msg: 'OTP has expired' });
        }

        if (OTP !== otpEntry.OTP) {
            return res.status(400).json({ success: false, msg: 'Incorrect OTP' });
        } else {
            await otpCollection.deleteOne({ userEmail });
            return res.status(200).json({ success: true });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            msg: `Server vaild to verify OTP, Try again ${err.message}`
        })
    }
}

module.exports = {
    verifyOTP
}