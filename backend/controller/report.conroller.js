const { emailSender } = require("../helper/Email");
const { userCollection } = require("../model/user.model");

const reportProblem = async (request, response) => {
    try {
        const { subject, message, } = request.body;
        const { currentuser } = request.params;
        const findUser = await userCollection.findOne({ _id: currentuser });
        const emailResponse = await emailSender(
            process.env.senderMail,
            subject,
            `Hello Team, I am ${findUser.fullName} one of the user of your instagram-clone website.\n I want to ${subject === 'report' ? "Report a problem while using your project" : "Share some feedbacks about your project"} \n\n ${message} \n\n Sincerely,\n\n${findUser.fullName}\nuserName : ${findUser.userName}\nRegistered Email : ${findUser.userEmail}`
        );
        if(emailResponse.messageId){
            response.status(200).json({
                success: true,
                msg: `Your ${subject} has been sent to our team. We will connect to you soon.`
            })
        }else{
            response.status(500).json({
                success: false,
                msg: `Failed to send your ${subject}. Try again later.`
            })
        }
    } catch (error) {
        response.status(500).json({
            success: false,
            msg: `server failed to send message! Try again ${error.message}`
        })
    }
}

module.exports = { reportProblem };