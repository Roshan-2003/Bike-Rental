import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "./models/User.js";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({
      email: "admin@bikerental.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@123",
      10
    );

    const admin = await User.create({
      name: "Bike Rental Admin",
      email: "admin@bikerental.com",
      password: hashedPassword,
      phone: "9999999999",
      role: "admin",
    });

    console.log("Admin created successfully");
    console.log("Email:", admin.email);
    console.log("Password: Admin@123");
    console.log("Role:", admin.role);

    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

createAdmin();