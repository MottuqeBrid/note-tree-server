// routes/upload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Multer setup (store files in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /upload/files
router.post("/files", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const file = req.file;

    // Upload file to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "notes",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
    return res.status(200).json({
      success: true,
      file: {
        name: file.originalname,
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Upload failed" });
  }
});

module.exports = router;
// https://res.cloudinary.com/ddpg1myou/raw/upload/fl_attachment:file/notes/g6tdy6go4pspbykfrbpc
