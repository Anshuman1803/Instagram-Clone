const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotENV = require("dotenv");
dotENV.config();
cloudinary.config({
  cloud_name: process.env.Cloudnary_CLoud_Name,
  api_key: process.env.Cloudnary_Api_Key,
  api_secret: process.env.Cloudnary_Api_Secret,
});

const uploadOnCloudnary = async (path) => {
  try {
    const cloudResponse = await cloudinary.uploader.upload(path, {
      resource_type: "auto",
    });
    fs.unlinkSync(path);
    return cloudResponse;
  } catch (error) {
    fs.unlinkSync(path);
  }
};

module.exports = { uploadOnCloudnary };
