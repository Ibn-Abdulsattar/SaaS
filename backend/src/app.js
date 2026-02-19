import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.set("PORT", process.env.PORT || 5000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/health", (req, res)=>{
    res.status(200).json({success: true, message: "API is healthy"});
})

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({
    success: false,
    error: error.message || "Internal Server Error",
  });
});

export {app};
