const { verify } = require("jsonwebtoken");
const { config } = require("dotenv");
config();

const KEY = process.env.secretKey;

const userAuthenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                status: false,
                msg: "Access denied"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: false,
                msg: "Unauthenticated user"
            });
        }

        try {
            const user = verify(token, KEY);
            req.userID = user.id;
        } catch (err) {
            return res.status(401).json({
                status: false,
                msg: "Expired Token, Login Again"
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            status: false,
            msg: `Server failed to authenticate! Try again later. Error: ${error.message}`
        });
    }
}

module.exports = { userAuthenticate };
