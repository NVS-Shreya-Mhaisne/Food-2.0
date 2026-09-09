import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ DB Connected to MongoDB");
  } catch (error) {
    console.error("❌ DB Connection Failed:", error.message);
    process.exit(1); // exit if db not connected
  }
};
