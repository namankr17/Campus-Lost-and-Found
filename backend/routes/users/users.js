const router = require("express").Router();
const User = require("../../models/users/User");
const Post = require("../../models/posts/Post");
const Notification = require("../../models/notifications/Notifications");
const { verifyToken } = require("../../middleware/verifyToken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../../utils/cloudinary");

const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: "profilePic", maxCount: 1 },
  { name: "coverPic", maxCount: 1 },
]);

router.get("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "You can only view your own profile" });
    }

    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ userId: user._id });

    res.status(200).json({ user, posts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/update", verifyToken, upload, async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = {};

    const allowedUpdates = ["username", "email", "password", "city", "state"];
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key) && req.body[key]) {
        updates[key] = req.body[key];
      }
    });

    // Check username uniqueness if being updated
    if (updates.username) {
      const existingUsername = await User.findOne({
        username: updates.username,
        _id: { $ne: userId }, // Exclude current user
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // Check email uniqueness if being updated
    if (updates.email) {
      const existingEmail = await User.findOne({
        email: updates.email,
        _id: { $ne: userId }, // Exclude current user
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
    }

    if (req.files?.profilePic) {
      const user = await User.findById(userId);
      if (user.profilePic?.publicId) {
        await deleteFromCloudinary(user.profilePic.publicId);
      }
      const result = await uploadToCloudinary(
        req.files.profilePic[0],
        "profiles"
      );
      updates.profilePic = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    if (req.files?.coverPic) {
      const user = await User.findById(userId);
      if (user.coverPic?.publicId) {
        await deleteFromCloudinary(user.coverPic.publicId);
      }
      const result = await uploadToCloudinary(req.files.coverPic[0], "covers");
      updates.coverPic = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // If username is being updated, update it in all related collections
    if (updates.username) {
      const oldUsername = req.user.username;
      const newUsername = updates.username;

      // Update username in all posts
      await Post.updateMany(
        { userId: userId },
        { $set: { username: newUsername } }
      );

      // Update username in all comments across all posts
      await Post.updateMany(
        { "comments.commenterId": userId },
        { $set: { "comments.$[comment].commenterUsername": newUsername } },
        { arrayFilters: [{ "comment.commenterId": userId }] }
      );

      // Update username in notifications if you have any
      await Notification.updateMany(
        { userId: userId },
        { $set: { username: newUsername } }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
