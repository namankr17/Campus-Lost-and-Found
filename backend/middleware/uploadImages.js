const multer = require("multer");

// File size limit (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(
      new Error(
        "Invalid file type. Only .jpg, .png and .webp files are allowed"
      )
    );
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

module.exports = upload;
