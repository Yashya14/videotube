import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(filePath, {
      //   folder: "videotube",
      resource_type: "auto",
    });
    console.log("File is uploaded on cloudinary", response, response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(filePath); // remove locally save file as the upload operation got failed
    console.log("Error while uploading on cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary };
