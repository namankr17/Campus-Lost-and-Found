const router = require("express").Router();
const { uploadToCloudinary } = require("../../utils/cloudinary");
const upload = require("../../middleware/uploadImages");
const { verifyToken } = require("../../middleware/verifyToken");

// Upload profile picture
router.post(
  "/profile",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const result = await uploadToCloudinary(req.file, "profile-pics");
      res.status(200).json({
        url: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Upload post images (max 3)
router.post(
  "/post",
  verifyToken,
  upload.array("images", 3),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No image files provided" });
      }

      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file, "post-images")
      );

      const results = await Promise.all(uploadPromises);
      const images = results.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      }));

      res.status(200).json({ images });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
