import dotenv from "dotenv";
dotenv.config(); 

console.log("Checking Cloudinary Config:", {
  name: process.env.CLOUDINARY_CLOUD_NAME ? "✅ Found" : "❌ MISSING",
  key: process.env.CLOUDINARY_API_KEY ? "✅ Found" : "❌ MISSING"
});




export  {cloudinary};







