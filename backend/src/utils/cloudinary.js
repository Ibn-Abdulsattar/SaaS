import {v2 as cloudinary} from "cloudinary";

const Cloudinary = async (file) => {
  if (!file || !file.buffer) {
    console.error("🛑 ERROR: No file buffer found in Cloudinary utility!");
    return  new Error("File buffer is missing");
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "SaaS", resource_type: "auto" },
      (err, uploadResult) => {
        if (err) {
          console.log("--- CLOUDINARY ERROR DETAILS ---");
          console.log(err); 
          console.log("-------------------------------");
          reject(err);
        } else {
          resolve(uploadResult);
        }
      },
    );

    stream.end(file.buffer);
  });
};

export default Cloudinary;
