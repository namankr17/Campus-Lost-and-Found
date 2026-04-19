const router = require("express").Router();
const Comment = require("../../models/comments/Comment");
const Post = require("../../models/posts/Post");
const { verifyToken } = require("../../middleware/verifyToken");
const Notification = require("../../models/notifications/Notifications");
const User = require("../../models/users/User");

// Add comment to post
router.post("/:id/comments", verifyToken, async (req, res) => {
  try {
    // Get user to access profile picture
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create new comment
    const newComment = new Comment({
      postId: req.params.id,
      userId: req.user.id,
      username: req.user.username,
      userProfilePic: {
        url: user.profilePic?.url || "",
      },
      text: req.body.text,
    });

    // Save the comment
    const savedComment = await newComment.save();

    // Get post to check owner
    const post = await Post.findById(req.params.id);

    // Create notification if commenter isn't post owner
    if (post.userId.toString() !== req.user.id) {
      await Notification.create({
        userId: post.userId,
        postId: req.params.id,
        commentId: savedComment._id,
        message: `${req.user.username} left a comment on your post: ${post.title}`,
      });

      // Increment notification count for post owner
      await User.findByIdAndUpdate(post.userId, {
        $inc: { notificationCount: 1 },
      });
    }

    // Update the post's comment count
    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { commentCount: 1 },
    });

    res.status(201).json(savedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all comments for a post
router.get("/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete comment
router.delete("/:id/comments/:commentId", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user owns comment or is admin
    if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }

    // Delete the notification associated with this comment
    await Notification.deleteMany({ commentId: req.params.commentId });

    // Delete from Comments collection
    await Comment.findByIdAndDelete(req.params.commentId);

    // Update the post's comment count
    await Post.findByIdAndUpdate(req.params.id, {
      $inc: { commentCount: -1 },
    });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
