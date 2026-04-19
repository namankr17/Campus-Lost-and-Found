require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/users/User");

const createInitialAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    // Check if admin already exists
    const adminExists = await User.findOne({ isAdmin: true });
    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin", salt); // Using 'admin' as password

    const adminUser = new User({
      email: "admin@example.com",
      username: "admin",
      password: hashedPassword,
      profilePic: "",
      city: "Chicago",
      state: "Illinois",
      isAdmin: true,
    });

    await adminUser.save();
    console.log("Initial admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
  }
};

createInitialAdmin();
