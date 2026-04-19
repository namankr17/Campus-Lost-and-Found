const mongoose = require("mongoose");
const User = require("./models/users/User");
const Post = require("./models/posts/Post");
const Comment = require("./models/comments/Comment");
const Notification = require("./models/notifications/Notifications");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Categories array
const categories = [
  "pets",
  "electronic",
  "jewelry",
  "accessory",
  "clothing",
  "documents",
  "keys",
  "bags",
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Notification.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      username: "admin",
      email: "admin@admin.com",
      password: await bcrypt.hash("admin", 10),
      isAdmin: true,
      profilePic: {
        url: `https://picsum.photos/200/200?random=${Math.random()}`,
        publicId: `admin_avatar_${Math.random()}`,
      },
    });

    // Create regular users
    const regularUsers = await Promise.all([
      User.create({
        username: "user1",
        email: "user1@test.com",
        password: await bcrypt.hash("password123", 10),
        city: "New York",
        state: "NY",
        profilePic: {
          url: `https://picsum.photos/200/200?random=${Math.random()}`,
          publicId: `user_avatar_${Math.random()}`,
        },
      }),
      User.create({
        username: "user2",
        email: "user2@test.com",
        password: await bcrypt.hash("password123", 10),
        city: "Chicago",
        state: "IL",
        profilePic: {
          url: `https://picsum.photos/200/200?random=${Math.random()}`,
          publicId: `user_avatar_${Math.random()}`,
        },
      }),
      User.create({
        username: "user3",
        email: "user3@test.com",
        password: await bcrypt.hash("password123", 10),
        city: "Miami",
        state: "FL",
        profilePic: {
          url: `https://picsum.photos/200/200?random=${Math.random()}`,
          publicId: `user_avatar_${Math.random()}`,
        },
      }),
      User.create({
        username: "breezy",
        email: "breezy@test.com",
        password: await bcrypt.hash("password123", 10),
        city: "Los Angeles",
        state: "CA",
        profilePic: {
          url: `https://picsum.photos/200/200?random=${Math.random()}`,
          publicId: `user_avatar_${Math.random()}`,
        },
      }),
    ]);

    console.log("Created users");

    // Create 3 posts for each regular user
    for (const user of regularUsers) {
      // Create posts
      const userPosts = await Promise.all([
        Post.create({
          userId: user._id,
          username: user.username,
          title: "Lost Item",
          description: "Test lost item post",
          category: categories[0],
          city: user.city,
          state: user.state,
          itemType: "lost",
          status: "unresolved",
          images: [
            {
              url: `https://picsum.photos/400/300?random=${Math.random()}`,
              publicId: `seed_image_${Math.random()}`,
            },
          ],
        }),
        Post.create({
          userId: user._id,
          username: user.username,
          title: "Found Item",
          description: "Test found item post",
          category: categories[1],
          city: user.city,
          state: user.state,
          itemType: "found",
          status: "resolved",
          images: [
            {
              url: `https://picsum.photos/400/300?random=${Math.random()}`,
              publicId: `seed_image_${Math.random()}`,
            },
          ],
        }),
        Post.create({
          userId: user._id,
          username: user.username,
          title: "Another Lost Item",
          description: "Another test lost item post",
          category: categories[2],
          city: user.city,
          state: user.state,
          itemType: "lost",
          status: "unresolved",
          images: [
            {
              url: `https://picsum.photos/400/300?random=${Math.random()}`,
              publicId: `seed_image_${Math.random()}`,
            },
          ],
        }),
      ]);

      // Update user's post counts
      await User.findByIdAndUpdate(user._id, {
        postCount: 3,
        resolvedCount: 1,
        unresolvedCount: 2,
      });

      // For each post, create one comment from a different user
      for (const post of userPosts) {
        // Get a random user that isn't the post owner
        const commenter = regularUsers.find(
          (u) => u._id.toString() !== post.userId.toString()
        );

        // Create comment
        const comment = await Comment.create({
          postId: post._id,
          userId: commenter._id,
          username: commenter.username,
          userProfilePic: commenter.profilePic,
          text: `Test comment from ${commenter.username}`,
        });

        // Create notification since commenter isn't post owner
        await Notification.create({
          userId: post.userId,
          postId: post._id,
          commentId: comment._id,
          message: `${commenter.username} commented on your post: ${post.title}`,
        });

        // Update post's comment count
        await Post.findByIdAndUpdate(post._id, {
          $inc: { commentCount: 1 },
        });

        // Update notification count for post owner
        await User.findByIdAndUpdate(post.userId, {
          $inc: { notificationCount: 1 },
        });
      }
    }

    console.log("Database seeded successfully!");

    // Log final counts
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();
    const commentCount = await Comment.countDocuments();
    const notificationCount = await Notification.countDocuments();

    console.log(`
      Final counts:
      Users: ${userCount} (4 regular + 1 admin = 5)
      Posts: ${postCount} (4 users × 3 posts = 12)
      Comments: ${commentCount} (12 posts × 1 comment = 12) 
      Notifications: ${notificationCount} (12 comments = 12)
    `);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed");
    process.exit(0);
  }
};

seedDatabase();
