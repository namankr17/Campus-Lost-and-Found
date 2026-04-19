const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/users/User");
const multer = require("multer");
const { uploadToCloudinary } = require("../../utils/cloudinary");
const {
  verifyTokenAndAdmin,
  verifyToken,
} = require("../../middleware/verifyToken");

const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: "profilePic", maxCount: 1 },
  { name: "coverPic", maxCount: 1 },
]);

router.post("/register", upload, async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    let profilePic = { url: "", publicId: "" };
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file, "profiles");

        if (!result) {
          throw new Error("No result from Cloudinary upload");
        }

        profilePic = {
          url: result.secure_url,
          publicId: result.public_id,
        };

        console.log("Cloudinary upload successful:", {
          url: profilePic.url,
          publicId: profilePic.publicId,
        });
      } catch (uploadError) {
        console.error("Cloudinary upload error details:", uploadError);
        return res.status(500).json({
          message: "Profile picture upload failed",
          error: uploadError.message,
          details: uploadError.stack,
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      profilePic,
      city: req.body.city,
      state: req.body.state,
    });

    const savedUser = await newUser.save();
    const { password: _, ...userWithoutPassword } = savedUser._doc;
    const token = jwt.sign(
      {
        id: savedUser._id,
        username: savedUser.username,
        isAdmin: savedUser.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(201).json({ ...userWithoutPassword, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/create-admin", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new User({
      email,
      username,
      password: hashedPassword,
      profilePic: req.body.profilePic || { url: "", publicId: "" },
      city: req.body.city,
      state: req.body.state,
      isAdmin: true,
    });

    const savedAdmin = await newAdmin.save();
    const { password: _, ...adminData } = savedAdmin._doc;
    res.status(201).json(adminData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/logout", verifyToken, async (req, res) => {
  try {
    res.status(200).clearCookie("token").json({
      message: "Successfully logged out",
      success: true,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/verify", verifyToken, async (req, res) => {
  try {
    console.log("Verifying token for user:", req.user);
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User verified:", user);
    res.json(user);
  } catch (err) {
    console.error("Verify route error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
