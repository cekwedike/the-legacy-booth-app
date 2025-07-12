const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Message = require('../models/Message');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message management
 */

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
    const allowedTypes = ['video/mp4', 'video/webm', 'audio/wav', 'audio/mp3', 'audio/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video and audio files are allowed.'));
    }
  }
});

// Validation middleware
const validateMessage = [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('recipientName').trim().isLength({ min: 1, max: 50 }).withMessage('Recipient name is required and must be less than 50 characters'),
  body('messageType').isIn(['birthday', 'anniversary', 'holiday', 'daily', 'encouragement', 'memory', 'advice', 'gratitude', 'love', 'wisdom', 'personal']).withMessage('Invalid message type'),
  body('recipientEmail').optional().isEmail().withMessage('Invalid email format'),
  body('isScheduled').optional().isBoolean().withMessage('isScheduled must be a boolean'),
  body('scheduledDate').optional().isISO8601().withMessage('Invalid date format'),
  body('scheduledTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('isPrivate').optional().isBoolean().withMessage('isPrivate must be a boolean'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
];

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - recipientName
 *               - messageType
 *               - audio
 *             properties:
 *               title:
 *                 type: string
 *               recipientName:
 *                 type: string
 *               recipientEmail:
 *                 type: string
 *               recipientRelationship:
 *                 type: string
 *               messageType:
 *                 type: string
 *               description:
 *                 type: string
 *               isScheduled:
 *                 type: boolean
 *               scheduledDate:
 *                 type: string
 *               scheduledTime:
 *                 type: string
 *               isPrivate:
 *                 type: boolean
 *               tags:
 *                 type: array
 *               audio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Missing required fields or validation error
 *       500:
 *         description: Failed to create message
 *   get:
 *     summary: Get messages for current user
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Limit results
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of messages
 */

// Create a new message
router.post('/', authenticateToken, upload.single('audio'), validateMessage, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const {
      title,
      recipientName,
      recipientEmail,
      recipientRelationship,
      messageType,
      description,
      isScheduled,
      scheduledDate,
      scheduledTime,
      isPrivate,
      tags
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Audio recording is required' });
    }

    // Calculate scheduled date/time if scheduling is enabled
    let scheduledFor = null;
    if (isScheduled === 'true' && scheduledDate && scheduledTime) {
      const [hours, minutes] = scheduledTime.split(':');
      scheduledFor = new Date(scheduledDate);
      scheduledFor.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      // Check if scheduled time is in the future
      if (scheduledFor <= new Date()) {
        return res.status(400).json({ error: 'Scheduled time must be in the future' });
      }
    }

    // Parse tags if provided
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (error) {
        parsedTags = [];
      }
    }

    const newMessage = new Message({
      sender: req.user._id,
      title,
      recipientName,
      recipientEmail: recipientEmail || null,
      recipientRelationship: recipientRelationship || null,
      messageType,
      description: description || '',
      audioFile: req.file.filename,
      audioPath: req.file.path,
      isScheduled: isScheduled === 'true',
      scheduledFor,
      isPrivate: isPrivate === 'true',
      tags: parsedTags,
      status: isScheduled === 'true' ? 'scheduled' : 'active',
      duration: 0 // Will be calculated when audio is processed
    });

    await newMessage.save();

    res.status(201).json({
      message: 'Message created successfully',
      messageData: {
        _id: newMessage._id,
        title: newMessage.title,
        recipientName: newMessage.recipientName,
        messageType: newMessage.messageType,
        isScheduled: newMessage.isScheduled,
        scheduledFor: newMessage.scheduledFor,
        status: newMessage.status,
        createdAt: newMessage.createdAt
      }
    });
  } catch (error) {
    console.error('Message creation error:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

/**
 * @swagger
 * /api/messages/templates:
 *   get:
 *     summary: Get message templates
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of message templates
 */

// Get message templates
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const templates = [
      {
        id: '1',
        title: 'Birthday Blessings',
        content: "Happy Birthday! On this special day, I want you to know how much joy you bring to my life. May your day be filled with love, laughter, and wonderful memories. You deserve all the happiness in the world!",
        category: 'birthday',
        isFavorite: false,
        suggestedDuration: 30
      },
      {
        id: '2',
        title: 'Anniversary Love',
        content: "Happy Anniversary! Every day with you has been a gift. Thank you for being my partner, my friend, and my love. Here's to many more years together filled with love and laughter.",
        category: 'anniversary',
        isFavorite: false,
        suggestedDuration: 25
      },
      {
        id: '3',
        title: 'Daily Encouragement',
        content: "Good morning! Remember that you are capable of amazing things. Today is a new opportunity to shine and make a difference. I believe in you and I'm cheering you on!",
        category: 'daily',
        isFavorite: false,
        suggestedDuration: 20
      },
      {
        id: '4',
        title: 'Life Advice',
        content: "Always remember that challenges are opportunities in disguise. When life gets tough, that's when you discover your true strength. Trust yourself, stay positive, and keep moving forward.",
        category: 'advice',
        isFavorite: false,
        suggestedDuration: 35
      },
      {
        id: '5',
        title: 'Gratitude Message',
        content: "Thank you for being such an important part of my life. Your kindness, support, and love mean the world to me. I'm so grateful to have you in my life.",
        category: 'gratitude',
        isFavorite: false,
        suggestedDuration: 25
      },
      {
        id: '6',
        title: 'Words of Wisdom',
        content: "Life is not about waiting for the storm to pass, but learning to dance in the rain. Embrace every moment, learn from every experience, and always choose kindness.",
        category: 'wisdom',
        isFavorite: false,
        suggestedDuration: 30
      }
    ];

    res.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get messages for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, status, limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { sender: req.user._id };
    
    if (type) {
      filter.messageType = type;
    }
    
    if (status) {
      filter.status = status;
    }

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-audioPath'); // Don't send file paths to client

    const total = await Message.countDocuments(filter);

    res.json({
      messages,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + messages.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
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
 *         schema:
 *           type: string
 *         required: true
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message details
 *       404:
 *         description: Message not found
 *       403:
 *         description: Access denied
 */

// Get a specific message
router.get('/:messageId', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Don't send file path to client
    const messageData = message.toObject();
    delete messageData.audioPath;

    res.json({ message: messageData });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

/**
 * @swagger
 * /api/messages/{messageId}/audio:
 *   get:
 *     summary: Get message audio file
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Audio file
 *       404:
 *         description: Message or audio file not found
 *       403:
 *         description: Access denied
 */

// Get message audio file
router.get('/:messageId/audio', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!message.audioPath || !fs.existsSync(message.audioPath)) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    res.sendFile(message.audioPath);
  } catch (error) {
    console.error('Error serving audio file:', error);
    res.status(500).json({ error: 'Failed to serve audio file' });
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
 *         schema:
 *           type: string
 *         required: true
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               isPrivate:
 *                 type: boolean
 *               tags:
 *                 type: array
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       404:
 *         description: Message not found
 *       403:
 *         description: Access denied
 */

// Update a message
router.put('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { title, description, isPrivate, tags } = req.body;
    
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only allow updating certain fields
    if (title !== undefined) message.title = title;
    if (description !== undefined) message.description = description;
    if (isPrivate !== undefined) message.isPrivate = isPrivate;
    if (tags !== undefined) message.tags = tags;

    await message.save();

    res.json({ 
      message: 'Message updated successfully',
      messageData: {
        _id: message._id,
        title: message.title,
        description: message.description,
        isPrivate: message.isPrivate,
        tags: message.tags
      }
    });
  } catch (error) {
    console.error('Error updating message:', error);
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
 *         schema:
 *           type: string
 *         required: true
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 *       403:
 *         description: Access denied
 */

// Delete a message
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete audio file if it exists
    if (message.audioPath && fs.existsSync(message.audioPath)) {
      await fs.unlink(message.audioPath);
    }

    await Message.findByIdAndDelete(req.params.messageId);

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

/**
 * @swagger
 * /api/messages/scheduled:
 *   get:
 *     summary: Get scheduled messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of scheduled messages
 */

// Get scheduled messages
router.get('/scheduled/list', authenticateToken, async (req, res) => {
  try {
    const scheduledMessages = await Message.find({
      sender: req.user._id,
      isScheduled: true,
      status: 'scheduled',
      scheduledFor: { $gt: new Date() }
    })
    .sort({ scheduledFor: 1 })
    .select('-audioPath');

    res.json({ scheduledMessages });
  } catch (error) {
    console.error('Error fetching scheduled messages:', error);
    res.status(500).json({ error: 'Failed to fetch scheduled messages' });
  }
});

module.exports = router; 