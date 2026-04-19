const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/auth/auth");
const adminRoutes = require("./routes/admin/admin");
const postRoutes = require("./routes/posts/posts");
const commentsRoutes = require("./routes/comments/comments");
const userRoutes = require("./routes/users/users");
const notificationsRoutes = require("./routes/notifications/notifications");
const uploadRoutes = require("./routes/upload/upload");
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://lost-and-found-rosy.vercel.app",
      "https://lost-and-found-git-main-eric-capizs-projects.vercel.app",
      "https://lost-and-found-a07korgs9-eric-capizs-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());

// Additional security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff"); //prevents MIME type sniffing
  res.setHeader("X-Frame-Options", "DENY"); //stops clickjacking and no embedding
  res.setHeader("X-XSS-Protection", "1; mode=block"); //prevents XSS attacks
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/posts", commentsRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Lost and Found API is running" });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Start the Server
app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
