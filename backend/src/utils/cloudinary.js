import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: "videotube",
      resource_type: "auto",
    });
    // console.log("File is uploaded on cloudinary", response, response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove locally save file as the upload operation got failed
    console.log("Error while uploading on cloudinary", error);
    return null;
  }
};


// Helper to extract Cloudinary public_id from URL
const getCloudinaryPublicId = (url) => {
  if (!url) return null;

  // Example: https://res.cloudinary.com/demo/image/upload/v123456789/videotube/abcd123.jpg
  const parts = url.split("/");
  const filenameWithExt = parts.pop(); // abcd123.jpg
  const folder = parts.pop();          // videotube
  const filename = filenameWithExt.split(".")[0]; // abcd123

  return `${folder}/${filename}`; // videotube/abcd123
};

export { uploadOnCloudinary, getCloudinaryPublicId };
