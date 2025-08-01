import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Recordings
 *   description: Audio/video recording uploads
 */

/**
 * @swagger
 * /api/recordings/upload:
 *   post:
 *     summary: Upload a recording
 *     tags: [Recordings]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               recording:
 *                 type: string
 *                 format: binary
 *               duration:
 *                 type: number
 *     responses:
 *       200:
 *         description: Recording uploaded successfully
 *       400:
 *         description: No recording file provided
 *       500:
 *         description: Failed to upload recording
 */

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req: any, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(__dirname, '../uploads/recordings');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (req: AuthenticatedRequest, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `recording-${req.user!._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/m4a', 'video/mp4', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio and video files are allowed.'));
    }
  }
});

// Upload recording
router.post('/upload', upload.single('recording'), async (req: AuthenticatedRequest, res: express.Response) => {
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

export default router; 