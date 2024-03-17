const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const dotENV = require("dotenv");
dotENV.config();
const MONGO__USER = process.env.mongooseUser;
const MONGO__PASS = process.env.mongoosePass;
const MONGO__URL = `mongodb+srv://${MONGO__USER}:${MONGO__PASS}@cluster0.48mqrke.mongodb.net/Instagram?retryWrites=true&w=majority`


const mongooseConnection = async()=>{
    try{
        await mongoose.connect(MONGO__URL);
        console.log("SUCCESSFULLY CONNECTED WITH DATABASE");
    }catch(err){
        console.log(`SOMETHING WENT WRONG IN DATABASE CONNECTION : ${err}`);
    }
}


module.exports = {mongooseConnection}