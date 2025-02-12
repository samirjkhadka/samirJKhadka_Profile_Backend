import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/dbConfig.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import router from "./routes/index.js";

const app = express();

//config
dotenv.config();



//middleware
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://192.168.1.73:5173",
  "https://samirjkhadka-portfolio.netlify.app",
  "http://samirjkhadka-portfolio.netlify.app",
  "https://samirjkhadka.com.np",
  "https://admin.samirjkhadka.com.np",
];

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());

//cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(router);
//database
connectDB();
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Samir J Khadka Profile API Is Running !");
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
