const fs = require("fs");
const path = require("path");
const multer = require("multer");
const ApiError = require("../utils/ApiError");
const { env } = require("../config/env");

const uploadsPath = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadsPath),
  filename: (_req, file, callback) => {
    // Sanitize filename and add timestamp
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, extension).replace(/[^a-zA-Z0-9]/g, '_');
    const safeName = `${baseName}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
    callback(null, safeName);
  }
});

const fileFilter = (req, file, callback) => {
  // Check MIME type
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(new ApiError(415, "Format gambar harus JPG, PNG, atau WEBP."));
  }

  // Check file extension matches MIME type
  const extension = path.extname(file.originalname).toLowerCase();
  const mimeToExt = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp'
  };

  if (mimeToExt[file.mimetype] !== extension && mimeToExt[file.mimetype] !== '.jpg' && extension !== '.jpeg') {
    return callback(new ApiError(415, "Ekstensi file tidak sesuai dengan format gambar."));
  }

  return callback(null, true);
};

const imageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
    files: 1
  }
});

// Cleanup function for failed uploads
const cleanupFailedUpload = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error('Failed to cleanup file:', error);
    }
  }
};

module.exports = {
  avatarUpload: imageUpload.single("avatar"),
  productImageUpload: imageUpload.single("image"),
  cleanupFailedUpload
};
