const express = require('express');
const LegacyBook = require('../models/LegacyBook');
const Story = require('../models/Story');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create a new legacy book
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, subtitle, dedication, design, format } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const legacyBook = new LegacyBook({
      resident: req.user._id,
      title,
      subtitle,
      dedication,
      design: design || {},
      format: format || { type: 'both' }
    });

    await legacyBook.save();

    res.status(201).json({
      message: 'Legacy book created successfully',
      legacyBook
    });
  } catch (error) {
    console.error('Legacy book creation error:', error);
    res.status(500).json({ error: 'Failed to create legacy book' });
  }
});

// Get legacy books for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    const filter = { resident: req.user._id };

    if (status) filter.status = status;

    const legacyBooks = await LegacyBook.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await LegacyBook.countDocuments(filter);

    res.json({
      legacyBooks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Legacy books fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch legacy books' });
  }
});

// Get a specific legacy book
router.get('/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const legacyBook = await LegacyBook.findById(bookId)
      .populate('stories.story')
      .populate('messages.message');

    if (!legacyBook) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (legacyBook.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ legacyBook });
  } catch (error) {
    console.error('Legacy book fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch legacy book' });
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

    if (legacyBook.resident.toString() !== req.user._id.toString()) {
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
router.put('/:bookId', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, subtitle, dedication, design, format, content } = req.body;

    const legacyBook = await LegacyBook.findById(bookId);
    if (!legacyBook) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (legacyBook.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates = {};
    if (title) updates.title = title;
    if (subtitle) updates.subtitle = subtitle;
    if (dedication) updates.dedication = dedication;
    if (design) updates.design = { ...legacyBook.design, ...design };
    if (format) updates.format = { ...legacyBook.format, ...format };
    if (content) updates.content = { ...legacyBook.content, ...content };

    const updatedBook = await LegacyBook.findByIdAndUpdate(
      bookId,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Legacy book updated successfully',
      legacyBook: updatedBook
    });
  } catch (error) {
    console.error('Legacy book update error:', error);
    res.status(500).json({ error: 'Failed to update legacy book' });
  }
});

// Generate legacy book (create PDF and prepare for printing)
router.post('/:bookId/generate', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const legacyBook = await LegacyBook.findById(bookId)
      .populate('stories.story')
      .populate('messages.message');

    if (!legacyBook) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (legacyBook.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // TODO: Implement actual PDF generation and book creation
    // For now, just update status
    legacyBook.status = 'in-progress';
    await legacyBook.save();

    res.json({
      message: 'Legacy book generation started',
      legacyBook
    });
  } catch (error) {
    console.error('Legacy book generation error:', error);
    res.status(500).json({ error: 'Failed to generate legacy book' });
  }
});

// Add recipient to legacy book
router.post('/:bookId/recipients', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params;
    const recipientData = req.body;

    const legacyBook = await LegacyBook.findById(bookId);
    if (!legacyBook) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (legacyBook.resident.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await legacyBook.addRecipient(recipientData);

    res.json({
      message: 'Recipient added successfully',
      legacyBook
    });
  } catch (error) {
    console.error('Add recipient error:', error);
    res.status(500).json({ error: 'Failed to add recipient' });
  }
});

module.exports = router; 