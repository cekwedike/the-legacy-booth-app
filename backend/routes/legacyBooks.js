const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const LegacyBook = require('../models/LegacyBook');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const PDFDocument = require('pdfkit');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: LegacyBooks
 *   description: Legacy book management
 */

// Configure multer for legacy book uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/legacyBooks');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `legacybook-${req.user._id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'audio/wav', 'audio/mp3', 'audio/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only image, video, and audio files are allowed.'));
    }
  }
});

// Validation middleware
const validateLegacyBook = [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
  body('category').isIn(['family', 'career', 'travel', 'life-lessons', 'achievements', 'memories', 'advice', 'other']).withMessage('Invalid category'),
  body('isPublic').optional().isBoolean().withMessage('isPublic must be a boolean'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
];

/**
 * @swagger
 * /api/legacy-books:
 *   post:
 *     summary: Create a new legacy book
 *     tags: [LegacyBooks]
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
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               tags:
 *                 type: array
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Legacy book created successfully
 *       400:
 *         description: Missing required fields or validation error
 *       500:
 *         description: Failed to create legacy book
 *   get:
 *     summary: Get legacy books for current user
 *     tags: [LegacyBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by category
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
 *         description: List of legacy books
 */

// Create a new legacy book
router.post('/', authenticateToken, upload.single('media'), validateLegacyBook, async (req, res) => {
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
      description,
      category,
      isPublic,
      tags
    } = req.body;

    // Parse tags if provided
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (error) {
        parsedTags = [];
      }
    }

    const newLegacyBook = new LegacyBook({
      author: req.user._id,
      title,
      description: description || '',
      category,
      isPublic: isPublic === 'true',
      tags: parsedTags,
      mediaFile: req.file ? req.file.filename : null,
      mediaPath: req.file ? req.file.path : null,
      mediaType: req.file ? req.file.mimetype.split('/')[0] : null, // 'image', 'video', or 'audio'
      status: 'draft'
    });

    await newLegacyBook.save();

    res.status(201).json({
      message: 'Legacy book created successfully',
      legacyBook: {
        _id: newLegacyBook._id,
        title: newLegacyBook.title,
        category: newLegacyBook.category,
        isPublic: newLegacyBook.isPublic,
        status: newLegacyBook.status,
        createdAt: newLegacyBook.createdAt
      }
    });
  } catch (error) {
    console.error('Legacy book creation error:', error);
    res.status(500).json({ error: 'Failed to create legacy book' });
  }
});

// Get legacy books for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, status, limit = 20, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { author: req.user._id };
    
    if (category) {
      filter.category = category;
    }
    
    if (status) {
      filter.status = status;
    }

    const legacyBooks = await LegacyBook.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-mediaPath'); // Don't send file paths to client

    const total = await LegacyBook.countDocuments(filter);

    res.json({
      legacyBooks,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + legacyBooks.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching legacy books:', error);
    res.status(500).json({ error: 'Failed to fetch legacy books' });
  }
});

/**
 * @swagger
 * /api/legacy-books/{legacyBookId}:
 *   get:
 *     summary: Get a specific legacy book
 *     tags: [LegacyBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: legacyBookId
 *         schema:
 *           type: string
 *         required: true
 *         description: Legacy book ID
 *     responses:
 *       200:
 *         description: Legacy book details
 *       404:
 *         description: Legacy book not found
 *       403:
 *         description: Access denied
 */

// Get a specific legacy book
router.get('/:legacyBookId', authenticateToken, async (req, res) => {
  try {
    const legacyBook = await LegacyBook.findById(req.params.legacyBookId)
      .populate('author', 'name email');

    if (!legacyBook) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (legacyBook.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Don't send file path to client
    const legacyBookData = legacyBook.toObject();
    delete legacyBookData.mediaPath;

    res.json({ legacyBook: legacyBookData });
  } catch (error) {
    console.error('Error fetching legacy book:', error);
    res.status(500).json({ error: 'Failed to fetch legacy book' });
  }
});

/**
 * @swagger
 * /api/legacy-books/{legacyBookId}/media:
 *   get:
 *     summary: Get legacy book media file
 *     tags: [LegacyBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: legacyBookId
 *         schema:
 *           type: string
 *         required: true
 *         description: Legacy book ID
 *     responses:
 *       200:
 *         description: Media file
 *       404:
 *         description: Legacy book or media file not found
 *       403:
 *         description: Access denied
 */

// Get legacy book media file
router.get('/:legacyBookId/media', authenticateToken, async (req, res) => {
  try {
    const legacyBook = await LegacyBook.findById(req.params.legacyBookId);

    if (!legacyBook) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (legacyBook.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!legacyBook.mediaPath || !fs.existsSync(legacyBook.mediaPath)) {
      return res.status(404).json({ error: 'Media file not found' });
    }

    res.sendFile(legacyBook.mediaPath);
  } catch (error) {
    console.error('Error serving media file:', error);
    res.status(500).json({ error: 'Failed to serve media file' });
  }
});

/**
 * @swagger
 * /api/legacy-books/{legacyBookId}/pdf:
 *   get:
 *     summary: Generate PDF for legacy book
 *     tags: [LegacyBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: legacyBookId
 *         schema:
 *           type: string
 *         required: true
 *         description: Legacy book ID
 *     responses:
 *       200:
 *         description: PDF file
 *       404:
 *         description: Legacy book not found
 *       403:
 *         description: Access denied
 */

// Generate PDF for legacy book
router.get('/:legacyBookId/pdf', authenticateToken, async (req, res) => {
  try {
    const legacyBook = await LegacyBook.findById(req.params.legacyBookId)
      .populate('author', 'name email');

    if (!legacyBook) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (legacyBook.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${legacyBook.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add content to PDF
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text(legacyBook.title, { align: 'center' })
       .moveDown();

    doc.fontSize(12)
       .font('Helvetica')
       .text(`Author: ${legacyBook.author.name}`, { align: 'center' })
       .moveDown(0.5);

    doc.text(`Category: ${legacyBook.category}`, { align: 'center' })
       .moveDown(0.5);

    doc.text(`Created: ${new Date(legacyBook.createdAt).toLocaleDateString()}`, { align: 'center' })
       .moveDown(2);

    if (legacyBook.description) {
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('Description')
         .moveDown(0.5);

      doc.fontSize(12)
         .font('Helvetica')
         .text(legacyBook.description)
         .moveDown(2);
    }

    if (legacyBook.tags && legacyBook.tags.length > 0) {
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('Tags')
         .moveDown(0.5);

      doc.fontSize(12)
         .font('Helvetica')
         .text(legacyBook.tags.join(', '))
         .moveDown(2);
    }

    // Add stories and messages if they exist
    if (legacyBook.stories && legacyBook.stories.length > 0) {
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .text('Stories')
         .moveDown();

      legacyBook.stories.forEach((story, index) => {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text(`${index + 1}. ${story.title}`)
           .moveDown(0.5);

        if (story.description) {
          doc.fontSize(12)
             .font('Helvetica')
             .text(story.description)
             .moveDown();
        }

        if (story.transcription) {
          doc.fontSize(11)
             .font('Helvetica-Oblique')
             .text(story.transcription)
             .moveDown();
        }

        doc.moveDown();
      });
    }

    if (legacyBook.messages && legacyBook.messages.length > 0) {
      doc.fontSize(16)
         .font('Helvetica-Bold')
         .text('Messages')
         .moveDown();

      legacyBook.messages.forEach((message, index) => {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text(`${index + 1}. ${message.title}`)
           .moveDown(0.5);

        doc.fontSize(12)
           .font('Helvetica')
           .text(`To: ${message.recipientName}`)
           .moveDown(0.5);

        if (message.description) {
          doc.fontSize(12)
             .font('Helvetica')
             .text(message.description)
             .moveDown();
        }

        if (message.transcription) {
          doc.fontSize(11)
             .font('Helvetica-Oblique')
             .text(message.transcription)
             .moveDown();
        }

        doc.moveDown();
      });
    }

    // Add footer
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Generated on ${new Date().toLocaleString()}`, { align: 'center' })
       .moveDown();

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

/**
 * @swagger
 * /api/legacy-books/{legacyBookId}:
 *   put:
 *     summary: Update a legacy book
 *     tags: [LegacyBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: legacyBookId
 *         schema:
 *           type: string
 *         required: true
 *         description: Legacy book ID
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
 *               category:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               tags:
 *                 type: array
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Legacy book updated successfully
 *       404:
 *         description: Legacy book not found
 *       403:
 *         description: Access denied
 */

// Update a legacy book
router.put('/:legacyBookId', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, isPublic, tags, status } = req.body;
    
    const legacyBook = await LegacyBook.findById(req.params.legacyBookId);

    if (!legacyBook) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (legacyBook.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only allow updating certain fields
    if (title !== undefined) legacyBook.title = title;
    if (description !== undefined) legacyBook.description = description;
    if (category !== undefined) legacyBook.category = category;
    if (isPublic !== undefined) legacyBook.isPublic = isPublic;
    if (tags !== undefined) legacyBook.tags = tags;
    if (status !== undefined) legacyBook.status = status;

    await legacyBook.save();

    res.json({ 
      message: 'Legacy book updated successfully',
      legacyBook: {
        _id: legacyBook._id,
        title: legacyBook.title,
        description: legacyBook.description,
        category: legacyBook.category,
        isPublic: legacyBook.isPublic,
        tags: legacyBook.tags,
        status: legacyBook.status
      }
    });
  } catch (error) {
    console.error('Error updating legacy book:', error);
    res.status(500).json({ error: 'Failed to update legacy book' });
  }
});

/**
 * @swagger
 * /api/legacy-books/{legacyBookId}:
 *   delete:
 *     summary: Delete a legacy book
 *     tags: [LegacyBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: legacyBookId
 *         schema:
 *           type: string
 *         required: true
 *         description: Legacy book ID
 *     responses:
 *       200:
 *         description: Legacy book deleted successfully
 *       404:
 *         description: Legacy book not found
 *       403:
 *         description: Access denied
 */

// Delete a legacy book
router.delete('/:legacyBookId', authenticateToken, async (req, res) => {
  try {
    const legacyBook = await LegacyBook.findById(req.params.legacyBookId);

    if (!legacyBook) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (legacyBook.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete media file if it exists
    if (legacyBook.mediaPath && fs.existsSync(legacyBook.mediaPath)) {
      await fs.unlink(legacyBook.mediaPath);
    }

    await LegacyBook.findByIdAndDelete(req.params.legacyBookId);

    res.json({ message: 'Legacy book deleted successfully' });
  } catch (error) {
    console.error('Error deleting legacy book:', error);
    res.status(500).json({ error: 'Failed to delete legacy book' });
  }
});

/**
 * @swagger
 * /api/legacy-books/{legacyBookId}/stories:
 *   post:
 *     summary: Add a story to a legacy book
 *     tags: [LegacyBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: legacyBookId
 *         schema:
 *           type: string
 *         required: true
 *         description: Legacy book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storyId
 *             properties:
 *               storyId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Story added successfully
 *       404:
 *         description: Legacy book or story not found
 *       403:
 *         description: Access denied
 */

// Add a story to a legacy book
router.post('/:legacyBookId/stories', authenticateToken, async (req, res) => {
  try {
    const { storyId } = req.body;
    
    const legacyBook = await LegacyBook.findById(req.params.legacyBookId);

    if (!legacyBook) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (legacyBook.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if story already exists in the legacy book
    if (legacyBook.stories.includes(storyId)) {
      return res.status(400).json({ error: 'Story already exists in this legacy book' });
    }

    legacyBook.stories.push(storyId);
    await legacyBook.save();

    res.json({ 
      message: 'Story added successfully',
      legacyBook: {
        _id: legacyBook._id,
        stories: legacyBook.stories
      }
    });
  } catch (error) {
    console.error('Error adding story to legacy book:', error);
    res.status(500).json({ error: 'Failed to add story to legacy book' });
  }
});

/**
 * @swagger
 * /api/legacy-books/{legacyBookId}/messages:
 *   post:
 *     summary: Add a message to a legacy book
 *     tags: [LegacyBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: legacyBookId
 *         schema:
 *           type: string
 *         required: true
 *         description: Legacy book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messageId
 *             properties:
 *               messageId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message added successfully
 *       404:
 *         description: Legacy book or message not found
 *       403:
 *         description: Access denied
 */

// Add a message to a legacy book
router.post('/:legacyBookId/messages', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.body;
    
    const legacyBook = await LegacyBook.findById(req.params.legacyBookId);

    if (!legacyBook) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (legacyBook.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if message already exists in the legacy book
    if (legacyBook.messages.includes(messageId)) {
      return res.status(400).json({ error: 'Message already exists in this legacy book' });
    }

    legacyBook.messages.push(messageId);
    await legacyBook.save();

    res.json({ 
      message: 'Message added successfully',
      legacyBook: {
        _id: legacyBook._id,
        messages: legacyBook.messages
      }
    });
  } catch (error) {
    console.error('Error adding message to legacy book:', error);
    res.status(500).json({ error: 'Failed to add message to legacy book' });
  }
});

module.exports = router; 