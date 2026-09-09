import dotenv from "dotenv";
dotenv.config();

console.log("MongoDB URI Configured:", !!process.env.MONGODB_URI);
console.log("Stripe Key Loaded:", !!process.env.STRIPE_SECRET_KEY);
console.log("JWT Secret Loaded:", !!process.env.JWT_SECRET); 
console.log("Cloudinary Loaded:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET ? "set" : "missing"
});

import express from "express";
import cloudinary from "./config/cloudinary.js";
import cors from "cors";
import { connectDB } from "./config/db.js";

import foodRouter from "./routes/FoodRoute.js";
import userRouter from "./routes/UseRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import restaurantRouter from "./routes/restaurantRoute.js";
import aiRouter from "./routes/aiRoute.js";

console.log("Cloudinary test:", cloudinary.config().cloud_name);

// App configuration
const app = express();
const port = process.env.PORT;

// Dynamic CORS whitelist from .env
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Database connection
connectDB();

// API Endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/ai", aiRouter);

// Serve uploaded static images
app.use("/images", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Cravely API Service Running 🚀");
});

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});

export default app;