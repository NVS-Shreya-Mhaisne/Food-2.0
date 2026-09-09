import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import adminAuth from "../middleware/adminAuth.js";
import authMiddleware from "../middleware/auth.js";
import { addFood, listFood, removeFood, updateDiscount, updateFood, getTopDishes } from "../controllers/foodController.js";

const foodRouter = express.Router();

const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== "placeholder_cloud_name" &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== "placeholder_api_key";

let storage;

if (isCloudinaryConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "Home",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });
} else {
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads", { recursive: true });
  }
  storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
}

const upload = multer({ storage });

foodRouter.post("/add", authMiddleware, adminAuth, upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.get("/top-dishes", getTopDishes);
foodRouter.post("/remove", authMiddleware, adminAuth, removeFood);
foodRouter.post("/update-discount", authMiddleware, adminAuth, updateDiscount);
foodRouter.post("/update", authMiddleware, adminAuth, upload.single("image"), updateFood);

export default foodRouter;
