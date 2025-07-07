const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/recordings');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `recording-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/m4a', 'video/mp4', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio and video files are allowed.'));
    }
  }
});

// Upload recording
router.post('/upload', upload.single('recording'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No recording file provided' });
    }

    const fileUrl = `/uploads/recordings/${req.file.filename}`;
    const isVideo = req.file.mimetype.startsWith('video/');

    res.json({
      message: 'Recording uploaded successfully',
      file: {
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        type: isVideo ? 'video' : 'audio',
        duration: req.body.duration || 0
      }
    });
  } catch (error) {
    console.error('Recording upload error:', error);
    res.status(500).json({ error: 'Failed to upload recording' });
  }
});

module.exports = router; 