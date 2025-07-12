const express = require('express');
const LegacyBook = require('../models/LegacyBook');
const Story = require('../models/Story');
const Message = require('../models/Message');
const { authenticateToken, requireOwnershipOrStaff } = require('../middleware/auth');
const { validateStoryCreation, validateId, sanitizeHtml } = require('../middleware/validation');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: LegacyBooks
 *   description: Legacy Book management
 */

// Create a new legacy book
router.post('/', authenticateToken, sanitizeHtml, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      theme, 
      isPublic, 
      dedication, 
      acknowledgments,
      stories,
      messages 
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ 
        error: 'Title and description are required',
        details: 'Please provide both a title and description for your legacy book'
      });
    }

    // Validate stories and messages exist
    if (stories && stories.length > 0) {
      const validStories = await Story.find({ _id: { $in: stories }, user: req.user._id });
      if (validStories.length !== stories.length) {
        return res.status(400).json({ 
          error: 'Invalid stories selected',
          details: 'Some selected stories do not exist or belong to you'
        });
      }
    }

    if (messages && messages.length > 0) {
      const validMessages = await Message.find({ _id: { $in: messages }, user: req.user._id });
      if (validMessages.length !== messages.length) {
        return res.status(400).json({ 
          error: 'Invalid messages selected',
          details: 'Some selected messages do not exist or belong to you'
        });
      }
    }

    const legacyBook = new LegacyBook({
      user: req.user._id,
      title,
      description,
      theme: theme || 'classic',
      isPublic: isPublic || false,
      dedication,
      acknowledgments,
      stories: stories || [],
      messages: messages || [],
      status: 'draft',
      isFavorite: false
    });

    await legacyBook.save();

    res.status(201).json({
      message: 'Legacy book created successfully',
      book: legacyBook
    });
  } catch (error) {
    console.error('Legacy book creation error:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors
      });
    }
    res.status(500).json({ 
      error: 'Failed to create legacy book',
      details: 'Please try again later'
    });
  }
});

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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               dedication:
 *                 type: string
 *               design:
 *                 type: object
 *               format:
 *                 type: object
 *     responses:
 *       201:
 *         description: Legacy book created successfully
 *       400:
 *         description: Title is required
 *       500:
 *         description: Failed to create legacy book
 *   get:
 *     summary: Get legacy books for current user
 *     tags: [LegacyBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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

// Get legacy books for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const filter = { user: req.user._id };

    if (status && status !== 'all') {
      filter.status = status;
    }

    const books = await LegacyBook.find(filter)
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await LegacyBook.countDocuments(filter);

    res.json({
      books,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Legacy books fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch legacy books',
      details: 'Please try again later'
    });
  }
});

/**
 * @swagger
 * /api/legacy-books/{bookId}:
 *   get:
 *     summary: Get a specific legacy book
 *     tags: [LegacyBooks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: Legacy book ID
 *     responses:
 *       200:
 *         description: Legacy book details
 *       404:
 *         description: Legacy book not found
 *       500:
 *         description: Failed to fetch legacy book
 */

// Get a specific legacy book
router.get('/:bookId', authenticateToken, validateId, async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await LegacyBook.findById(bookId)
      .populate('stories')
      .populate('messages');

    if (!book) {
      return res.status(404).json({ 
        error: 'Legacy book not found',
        details: 'The requested book could not be located'
      });
    }

    // Check ownership or if book is public
    if (book.user.toString() !== req.user._id.toString() && !book.isPublic) {
      return res.status(403).json({ 
        error: 'Access denied',
        details: 'This book is private and does not belong to you'
      });
    }

    res.json({ book });
  } catch (error) {
    console.error('Legacy book fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch legacy book',
      details: 'Please try again later'
    });
  }
});

// Add story to legacy book
router.post('/:bookId/stories', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { storyId, order } = req.body;

    const legacyBook = await LegacyBook.findById(bookId);
    if (!legacyBook) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (legacyBook.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    await legacyBook.addStory(storyId, order || 0);

    res.json({
      message: 'Story added to legacy book successfully',
      legacyBook
    });
  } catch (error) {
    console.error('Add story to book error:', error);
    res.status(500).json({ error: 'Failed to add story to book' });
  }
});

// Update legacy book
router.put('/:bookId', authenticateToken, validateId, sanitizeHtml, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { 
      title, 
      description, 
      theme, 
      isPublic, 
      dedication, 
      acknowledgments,
      stories,
      messages,
      status 
    } = req.body;

    const book = await LegacyBook.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        error: 'Legacy book not found',
        details: 'The requested book could not be located'
      });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Access denied',
        details: 'You can only edit your own books'
      });
    }

    // Validate stories and messages if provided
    if (stories && stories.length > 0) {
      const validStories = await Story.find({ _id: { $in: stories }, user: req.user._id });
      if (validStories.length !== stories.length) {
        return res.status(400).json({ 
          error: 'Invalid stories selected',
          details: 'Some selected stories do not exist or belong to you'
        });
      }
    }

    if (messages && messages.length > 0) {
      const validMessages = await Message.find({ _id: { $in: messages }, user: req.user._id });
      if (validMessages.length !== messages.length) {
        return res.status(400).json({ 
          error: 'Invalid messages selected',
          details: 'Some selected messages do not exist or belong to you'
        });
      }
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (theme !== undefined) updates.theme = theme;
    if (isPublic !== undefined) updates.isPublic = isPublic;
    if (dedication !== undefined) updates.dedication = dedication;
    if (acknowledgments !== undefined) updates.acknowledgments = acknowledgments;
    if (stories !== undefined) updates.stories = stories;
    if (messages !== undefined) updates.messages = messages;
    if (status !== undefined) updates.status = status;

    const updatedBook = await LegacyBook.findByIdAndUpdate(
      bookId,
      updates,
      { new: true, runValidators: true }
    ).populate('stories').populate('messages');

    res.json({
      message: 'Legacy book updated successfully',
      book: updatedBook
    });
  } catch (error) {
    console.error('Legacy book update error:', error);
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: validationErrors
      });
    }
    res.status(500).json({ 
      error: 'Failed to update legacy book',
      details: 'Please try again later'
    });
  }
});

// Delete legacy book
router.delete('/:bookId', authenticateToken, validateId, async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await LegacyBook.findById(bookId);

    if (!book) {
      return res.status(404).json({ 
        error: 'Legacy book not found',
        details: 'The requested book could not be located'
      });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Access denied',
        details: 'You can only delete your own books'
      });
    }

    await LegacyBook.findByIdAndDelete(bookId);

    res.json({
      message: 'Legacy book deleted successfully'
    });
  } catch (error) {
    console.error('Legacy book deletion error:', error);
    res.status(500).json({ 
      error: 'Failed to delete legacy book',
      details: 'Please try again later'
    });
  }
});

// Toggle favorite status
router.patch('/:bookId/favorite', authenticateToken, validateId, async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await LegacyBook.findById(bookId);

    if (!book) {
      return res.status(404).json({ 
        error: 'Legacy book not found',
        details: 'The requested book could not be located'
      });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Access denied',
        details: 'You can only favorite your own books'
      });
    }

    book.isFavorite = !book.isFavorite;
    await book.save();

    res.json({
      message: `Book ${book.isFavorite ? 'added to' : 'removed from'} favorites`,
      book
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ 
      error: 'Failed to update favorite status',
      details: 'Please try again later'
    });
  }
});

// Download legacy book (PDF generation)
router.get('/:bookId/download', authenticateToken, validateId, async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await LegacyBook.findById(bookId)
      .populate('stories')
      .populate('messages');

    if (!book) {
      return res.status(404).json({ 
        error: 'Legacy book not found',
        details: 'The requested book could not be located'
      });
    }

    if (book.user.toString() !== req.user._id.toString() && !book.isPublic) {
      return res.status(403).json({ 
        error: 'Access denied',
        details: 'This book is private and does not belong to you'
      });
    }

    // TODO: Implement PDF generation
    // For now, return a placeholder response
    res.json({
      message: 'PDF download feature coming soon',
      book: {
        title: book.title,
        stories: book.stories.length,
        messages: book.messages.length
      }
    });

    // Future implementation:
    // const pdfBuffer = await generatePDF(book);
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', `attachment; filename="${book.title}.pdf"`);
    // res.send(pdfBuffer);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: 'Failed to generate download',
      details: 'Please try again later'
    });
  }
});

// Publish legacy book
router.patch('/:bookId/publish', authenticateToken, validateId, async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await LegacyBook.findById(bookId);

    if (!book) {
      return res.status(404).json({ 
        error: 'Legacy book not found',
        details: 'The requested book could not be located'
      });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Access denied',
        details: 'You can only publish your own books'
      });
    }

    if (book.stories.length === 0 && book.messages.length === 0) {
      return res.status(400).json({ 
        error: 'Cannot publish empty book',
        details: 'Please add at least one story or message before publishing'
      });
    }

    book.status = 'published';
    book.publishedAt = new Date();
    await book.save();

    res.json({
      message: 'Legacy book published successfully',
      book
    });
  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({ 
      error: 'Failed to publish book',
      details: 'Please try again later'
    });
  }
});

// Archive legacy book
router.patch('/:bookId/archive', authenticateToken, validateId, async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await LegacyBook.findById(bookId);

    if (!book) {
      return res.status(404).json({ 
        error: 'Legacy book not found',
        details: 'The requested book could not be located'
      });
    }

    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Access denied',
        details: 'You can only archive your own books'
      });
    }

    book.status = 'archived';
    book.archivedAt = new Date();
    await book.save();

    res.json({
      message: 'Legacy book archived successfully',
      book
    });
  } catch (error) {
    console.error('Archive error:', error);
    res.status(500).json({ 
      error: 'Failed to archive book',
      details: 'Please try again later'
    });
  }
});

module.exports = router; 