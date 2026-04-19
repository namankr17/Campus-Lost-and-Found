const router = require("express").Router();
const User = require("../../models/users/User");
const Post = require("../../models/posts/Post");
const Comment = require("../../models/comments/Comment");
const { deleteFromCloudinary } = require("../../utils/cloudinary");
const {
  verifyTokenAndAdmin,
  verifyToken,
} = require("../../middleware/verifyToken");
const bcrypt = require("bcryptjs");

// Get all users
router.get("/users", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // Exclude password
      .sort({ createdAt: -1 }); // Newest first

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET ADMIN STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      totalPosts: await Post.countDocuments(),
      resolvedPosts: await Post.countDocuments({ status: "resolved" }),
      unresolvedPosts: await Post.countDocuments({ status: "unresolved" }),
      totalComments: await Comment.countDocuments(),
    };

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unified delete route (admin or self-delete)
router.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    // Find user to be deleted
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If admin is trying to delete themselves, block it
    if (req.user.isAdmin && req.user.id === req.params.id) {
      return res
        .status(403)
        .json({ message: "Admin cannot delete their own account" });
    }

    // If non-admin user is trying to delete someone else, block it
    if (!req.user.isAdmin && req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own account" });
    }

    // Delete profile picture if exists
    if (user.profilePic.publicId) {
      await deleteFromCloudinary(user.profilePic.publicId);
    }

    // 1. Find all posts that have comments by this user
    const postsWithUserComments = await Post.find({
      "comments.commenterId": user._id,
    });

    // Update each post: remove user's comments and update count
    for (const post of postsWithUserComments) {
      const userCommentCount = post.comments.filter(
        (comment) => comment.commenterId.toString() === user._id.toString()
      ).length;

      await Post.findByIdAndUpdate(post._id, {
        $pull: { comments: { commenterId: user._id } },
        $inc: { commentCount: -userCommentCount },
      });
    }

    // 2. Find all posts by the user and delete their images
    const userPosts = await Post.find({ userId: user._id });
    for (const post of userPosts) {
      // Delete post images from Cloudinary
      for (const image of post.images) {
        await deleteFromCloudinary(image.publicId);
      }
      await Comment.deleteMany({ postId: post._id });
    }

    // 3. Delete user's content
    await Post.deleteMany({ userId: user._id });
    await Comment.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Account and all associated content deleted successfully",
    });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create new admin
router.post("/create", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = await User.create({
      username,
      email,
      password: hashedPassword,
      isAdmin: true,
      profilePic: { url: "", publicId: "" },
    });

    // Return new admin without password
    const { password: _, ...adminData } = newAdmin._doc;
    res.status(201).json(adminData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
