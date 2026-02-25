import cloudinary from "../config/cloudinary.js";

const Cloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "SaaS", resource_type: "auto" },
      (err, uploadResult) => {
        if (err) {
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
