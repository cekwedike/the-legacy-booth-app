import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import OpenAI from 'openai';
import Message from '../models/Message';
import { authenticateToken, requireOwnershipOrStaff } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message management
 */

// Configure OpenAI (optional)
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req: any, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = path.join(__dirname, '../uploads/messages');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error as Error, uploadDir);
    }
  },
  filename: (req: AuthenticatedRequest, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `message-${req.user!._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
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

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get user's messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 */
// Get user's messages
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    const filter: any = { sender: req.user!._id };

    if (type) filter.type = type;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    
    const messages = await Message.find(filter)
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Message.countDocuments(filter);

    res.json({
      messages: messages.map(message => message.toJSON()),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Messages fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - recipient
 *             properties:
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *               recipient:
 *                 type: object
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Missing required fields
 */
// Create new message
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { title, type, recipient } = req.body;

    if (!title || !type || !recipient) {
      return res.status(400).json({ error: 'Title, type, and recipient are required' });
    }

    const message = new Message({
      sender: req.user!._id,
      title,
      type,
      recipient,
      status: 'draft'
    });

    await message.save();

    res.status(201).json({
      message: 'Message created successfully',
      messageData: message.toJSON()
    });
  } catch (error) {
    console.error('Message creation error:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

/**
 * @swagger
 * /api/messages/{messageId}:
 *   get:
 *     summary: Get a specific message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message retrieved successfully
 *       404:
 *         description: Message not found
 */
// Get specific message
router.get('/:messageId', authenticateToken, requireOwnershipOrStaff('messageId'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { messageId } = req.params;
    
    const message = await Message.findById(messageId)
      .populate('sender', 'name email');

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({
      message: message.toJSON()
    });
  } catch (error) {
    console.error('Message fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

/**
 * @swagger
 * /api/messages/{messageId}/upload:
 *   post:
 *     summary: Upload recording for a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
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
 *       404:
 *         description: Message not found
 */
// Upload recording for message
router.post('/:messageId/upload', authenticateToken, requireOwnershipOrStaff('messageId'), upload.single('recording'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { messageId } = req.params;
    const { duration } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No recording file provided' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const fileUrl = `/uploads/messages/${req.file.filename}`;
    const isVideo = req.file.mimetype.startsWith('video/');

    message.content = {
      videoUrl: isVideo ? fileUrl : undefined,
      audioUrl: isVideo ? undefined : fileUrl,
      duration: Number(duration) || 0,
      fileSize: req.file.size
    } as any;
    message.status = 'recorded';

    await message.save();

    // Start transcription if OpenAI is available
    if (openai && req.file?.path && messageId) {
      const filePath = req.file.path;
      transcribeMessage(messageId, filePath).catch(console.error);
    }

    res.json({
      message: 'Recording uploaded successfully',
      messageData: message.toJSON()
    });
  } catch (error) {
    console.error('Recording upload error:', error);
    res.status(500).json({ error: 'Failed to upload recording' });
  }
});

/**
 * @swagger
 * /api/messages/{messageId}:
 *   put:
 *     summary: Update a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       404:
 *         description: Message not found
 */
// Update message
router.put('/:messageId', authenticateToken, requireOwnershipOrStaff('messageId'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { messageId } = req.params;
    const { title, status } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (title) message.title = title;
    if (status) message.status = status;

    await message.save();

    res.json({
      message: 'Message updated successfully',
      messageData: message.toJSON()
    });
  } catch (error) {
    console.error('Message update error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

/**
 * @swagger
 * /api/messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 */
// Delete message
router.delete('/:messageId', authenticateToken, requireOwnershipOrStaff('messageId'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Delete associated files
    if (message.content?.audioUrl) {
      const filePath = path.join(__dirname, '..', message.content.audioUrl);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting audio file:', error);
      }
    }

    if (message.content?.videoUrl) {
      const filePath = path.join(__dirname, '..', message.content.videoUrl);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting video file:', error);
      }
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Message deletion error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Helper function to transcribe message
async function transcribeMessage(messageId: string, filePath: string): Promise<void> {
  try {
    if (!openai) return;

    const message = await Message.findById(messageId);
    if (!message) return;

    // Update transcription status
    message.transcription = { ...message.transcription, status: 'processing' };
    await message.save();

    const transcription = await openai.audio.transcriptions.create({
      file: await fs.readFile(filePath) as any,
      model: "whisper-1",
    });

    message.transcription = {
      text: transcription.text,
      confidence: 0.9,
      language: (transcription as any).language || 'en',
      status: 'completed'
    };

    await message.save();
  } catch (error) {
    console.error('Transcription error:', error);
    
    const message = await Message.findById(messageId);
    if (message) {
      message.transcription = { ...message.transcription, status: 'failed' };
      await message.save();
    }
  }
}

export default router; 