import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserModel from "./models/UserModel.js";
import { connectDB } from "./config/db.js";

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "shreya@gmail.com";
    const exists = await UserModel.findOne({ email });

    if (exists) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("patil", 10);

    const admin = await UserModel.create({
      name: "Shreya",
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    console.log("✅ Admin user created:", admin);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
};

createAdmin();
