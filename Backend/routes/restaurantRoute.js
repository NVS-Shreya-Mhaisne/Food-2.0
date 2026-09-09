import express from "express";
import multer from "multer";
import fs from "fs";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import adminAuth from "../middleware/adminAuth.js";
import authMiddleware from "../middleware/auth.js";
import {
  addRestaurant,
  listRestaurants,
  getRestaurantById,
  removeRestaurant,
  updateRestaurant,
  getPopularRestaurants
} from "../controllers/restaurantController.js";

const restaurantRouter = express.Router();

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
      folder: "Restaurants",
      allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
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

restaurantRouter.post("/add", authMiddleware, adminAuth, upload.single("image"), addRestaurant);
restaurantRouter.get("/list", listRestaurants);
restaurantRouter.get("/popular", getPopularRestaurants);
restaurantRouter.get("/:id", getRestaurantById);
restaurantRouter.post("/remove", authMiddleware, adminAuth, removeRestaurant);
restaurantRouter.post("/update", authMiddleware, adminAuth, updateRestaurant);

export default restaurantRouter;
