const { otpCollection } = require("../model/otp.model")
const otpVerification = async (req, res, next) => {
    try {
        const { OTP, userEmail } = req.body;
        const otpEntry = await otpCollection.findOne({ userEmail });

        if (!otpEntry) {
            return res.status(400).json({ error: 'Invalid Email or OTP' });
        }

        const now = Date.now();
        if (now > otpEntry.otpExpireAt) {
            await otpCollection.deleteOne({ userEmail });
            return res.status(400).json({ error: 'OTP has expired' });
        }

        if (OTP !== otpEntry.OTP) {
            return res.status(400).json({ error: 'Incorrect OTP' });
        }
        await otpCollection.deleteOne({ userEmail });
        next();
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            msg: `Server vaild to verify OTP, Try again ${err.message}`
        })
    }
}

module.exports = { otpVerification };