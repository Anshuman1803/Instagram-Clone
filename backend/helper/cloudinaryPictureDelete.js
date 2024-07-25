const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.Cloudnary_CLoud_Name,
  api_key: process.env.Cloudnary_Api_Key,
  api_secret: process.env.Cloudnary_Api_Secret,
});
const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    return error;
  }
};
module.exports = {deleteImageFromCloudinary}
