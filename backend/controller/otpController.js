const { otpCollection } = require("../model/otp.model");

const verifyOTP = async (req, res) => {
    try {
        const { OTP, userEmail } = req.body;
        const otpEntry = await otpCollection.find({ userEmail }).sort({ otpExpireAt: -1 }).limit(1);
        if (otpEntry.length === 0) {
            return res.status(400).json({ success: false, msg: 'Invalid OTP' });
        }

        const now = Date.now();
        if (now > otpEntry[0].otpExpireAt) {
            await otpCollection.deleteMany({ userEmail });
            return res.status(400).json({ success: false, msg: 'OTP has expired' });
        }

        if (OTP !== otpEntry[0].OTP) {
            return res.status(400).json({ success: false, msg: 'Incorrect OTP' });
        } else {
            await otpCollection.deleteMany({ userEmail });
            return res.status(200).json({ success: true });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: `Server vaild to verify OTP, Try again ${err.message}`
        })
    }
}

module.exports = {
    verifyOTP
}