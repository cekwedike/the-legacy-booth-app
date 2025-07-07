const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Message = require('../models/Message');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Configure multer for message uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/messages');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `message-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'audio/wav', 'audio/mp3'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video and audio files are allowed.'));
    }
  }
});

// Create a new message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, type, recipient, message, scheduledFor } = req.body;

    if (!title || !type || !recipient) {
      return res.status(400).json({ error: 'Title, type, and recipient are required' });
    }

    const newMessage = new Message({
      sender: req.user._id,
      title,
      type,
      recipient,
      message,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : new Date()
    });

    await newMessage.save();

    res.status(201).json({
      message: 'Message created successfully',
      messageData: newMessage
    });
  } catch (error) {
    console.error('Message creation error:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

// Upload recording for a message
router.post('/:messageId/recording', authenticateToken, upload.single('recording'), async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No recording file provided' });
    }

    const fileUrl = `/uploads/messages/${req.file.filename}`;
    const isVideo = req.file.mimetype.startsWith('video/');

    message.content = {
      videoUrl: isVideo ? fileUrl : null,
      audioUrl: isVideo ? null : fileUrl,
      duration: req.body.duration || 0,
      fileSize: req.file.size
    };
    message.status = 'recorded';

    await message.save();

    res.json({
      message: 'Recording uploaded successfully',
      messageData: message
    });
  } catch (error) {
    console.error('Recording upload error:', error);
    res.status(500).json({ error: 'Failed to upload recording' });
  }
});

// Get messages for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, status, limit = 20, page = 1 } = req.query;
    const filter = { sender: req.user._id };

    if (type) filter.type = type;
    if (status) filter.status = status;

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Message.countDocuments(filter);

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Messages fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get a specific message
router.get('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ message: message });
  } catch (error) {
    console.error('Message fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// Update message
router.put('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { title, recipient, message, scheduledFor, privacy } = req.body;

    const messageData = await Message.findById(messageId);
    if (!messageData) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (messageData.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = {};
    if (title) updates.title = title;
    if (recipient) updates.recipient = recipient;
    if (message) updates.message = message;
    if (scheduledFor) updates.scheduledFor = new Date(scheduledFor);
    if (privacy) updates.privacy = { ...messageData.privacy, ...privacy };

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Message updated successfully',
      messageData: updatedMessage
    });
  } catch (error) {
    console.error('Message update error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete a message
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete associated files
    if (message.content.audioUrl) {
      const audioPath = path.join(__dirname, '..', message.content.audioUrl);
      await fs.unlink(audioPath).catch(() => {});
    }
    if (message.content.videoUrl) {
      const videoPath = path.join(__dirname, '..', message.content.videoUrl);
      await fs.unlink(videoPath).catch(() => {});
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Message deletion error:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Send a message (mark as sent and trigger delivery)
router.post('/:messageId/send', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (message.status !== 'recorded') {
      return res.status(400).json({ error: 'Message must be recorded before sending' });
    }

    message.status = 'sent';
    await message.save();

    // TODO: Implement actual delivery logic (email, SMS, etc.)
    // For now, just mark as delivered
    setTimeout(async () => {
      message.status = 'delivered';
      message.deliveredAt = new Date();
      await message.save();
    }, 1000);

    res.json({
      message: 'Message sent successfully',
      messageData: message
    });
  } catch (error) {
    console.error('Message send error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get message types
router.get('/types', authenticateToken, (req, res) => {
  const types = [
    { value: 'birthday', label: 'Birthday Greeting' },
    { value: 'anniversary', label: 'Anniversary Wishes' },
    { value: 'holiday', label: 'Holiday Message' },
    { value: 'daily', label: 'Daily Thought' },
    { value: 'encouragement', label: 'Words of Encouragement' },
    { value: 'memory', label: 'Shared Memory' },
    { value: 'other', label: 'Other' }
  ];
  res.json({ types });
});

module.exports = router; 