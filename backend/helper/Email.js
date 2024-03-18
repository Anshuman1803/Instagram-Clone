const { response } = require("express");
const nodeMailer = require("nodemailer");

const emailSender = async (receiverEmail, subject, otpText) => {
  try {
    const mailTransporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.senderMail,
        pass: process.env.senderPassword,
      },
    });

    const mailOptions = {
      from: process.env.senderMail,
      to: receiverEmail,
      subject: subject,
      text: otpText,
    };
    const mailResponse = await mailTransporter.sendMail(mailOptions);
    return mailResponse
  } catch (err) {
    return err
  }
};

module.exports = { emailSender };
