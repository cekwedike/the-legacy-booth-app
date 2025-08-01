import express from 'express';
import LegacyBook from '../models/LegacyBook';
import Story from '../models/Story';
import Message from '../models/Message';
import { authenticateToken, requireOwnershipOrStaff } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Legacy Books
 *   description: Legacy book management
 */

/**
 * @swagger
 * /api/legacy-books:
 *   get:
 *     summary: Get user's legacy books
 *     tags: [Legacy Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Legacy books retrieved successfully
 */
// Get user's legacy books
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter: any = { resident: req.user!._id };

    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    
    const books = await LegacyBook.find(filter)
      .populate('resident', 'name email')
      .populate('stories.story', 'title category')
      .populate('messages.message', 'title type')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await LegacyBook.countDocuments(filter);

    res.json({
      books: books.map(book => book.toJSON()),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Legacy books fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch legacy books' });
  }
});

/**
 * @swagger
 * /api/legacy-books:
 *   post:
 *     summary: Create a new legacy book
 *     tags: [Legacy Books]
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
 *     responses:
 *       201:
 *         description: Legacy book created successfully
 *       400:
 *         description: Missing required fields
 */
// Create new legacy book
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { title, subtitle, dedication } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const book = new LegacyBook({
      resident: req.user!._id,
      title,
      subtitle,
      dedication,
      status: 'draft'
    });

    await book.save();

    res.status(201).json({
      message: 'Legacy book created successfully',
      book: book.toJSON()
    });
  } catch (error) {
    console.error('Legacy book creation error:', error);
    res.status(500).json({ error: 'Failed to create legacy book' });
  }
});

/**
 * @swagger
 * /api/legacy-books/{bookId}:
 *   get:
 *     summary: Get a specific legacy book
 *     tags: [Legacy Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Legacy book retrieved successfully
 *       404:
 *         description: Legacy book not found
 */
// Get specific legacy book
router.get('/:bookId', authenticateToken, requireOwnershipOrStaff('bookId'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { bookId } = req.params;
    
    const book = await LegacyBook.findById(bookId)
      .populate('resident', 'name email')
      .populate('stories.story', 'title category content')
      .populate('messages.message', 'title type content');

    if (!book) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    res.json({
      book: book.toJSON()
    });
  } catch (error) {
    console.error('Legacy book fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch legacy book' });
  }
});

/**
 * @swagger
 * /api/legacy-books/{bookId}:
 *   put:
 *     summary: Update a legacy book
 *     tags: [Legacy Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
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
 *               subtitle:
 *                 type: string
 *               dedication:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Legacy book updated successfully
 *       404:
 *         description: Legacy book not found
 */
// Update legacy book
router.put('/:bookId', authenticateToken, requireOwnershipOrStaff('bookId'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { bookId } = req.params;
    const { title, subtitle, dedication, status } = req.body;

    const book = await LegacyBook.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    if (title) book.title = title;
    if (subtitle) book.subtitle = subtitle;
    if (dedication) book.dedication = dedication;
    if (status) book.status = status;

    await book.save();

    res.json({
      message: 'Legacy book updated successfully',
      book: book.toJSON()
    });
  } catch (error) {
    console.error('Legacy book update error:', error);
    res.status(500).json({ error: 'Failed to update legacy book' });
  }
});

/**
 * @swagger
 * /api/legacy-books/{bookId}/stories:
 *   post:
 *     summary: Add a story to a legacy book
 *     tags: [Legacy Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
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
 *               order:
 *                 type: number
 *     responses:
 *       200:
 *         description: Story added to legacy book successfully
 *       404:
 *         description: Legacy book or story not found
 */
// Add story to legacy book
router.post('/:bookId/stories', authenticateToken, requireOwnershipOrStaff('bookId'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { bookId } = req.params;
    const { storyId, order = 0 } = req.body;

    if (!storyId) {
      return res.status(400).json({ error: 'Story ID is required' });
    }

    const book = await LegacyBook.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Check if story belongs to the same user
    if (story.resident.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await book.addStory(storyId, order);

    res.json({
      message: 'Story added to legacy book successfully',
      book: book.toJSON()
    });
  } catch (error) {
    console.error('Add story to book error:', error);
    res.status(500).json({ error: 'Failed to add story to legacy book' });
  }
});

/**
 * @swagger
 * /api/legacy-books/{bookId}/stories/{storyId}:
 *   delete:
 *     summary: Remove a story from a legacy book
 *     tags: [Legacy Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story removed from legacy book successfully
 *       404:
 *         description: Legacy book not found
 */
// Remove story from legacy book
router.delete('/:bookId/stories/:storyId', authenticateToken, requireOwnershipOrStaff('bookId'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { bookId, storyId } = req.params;

    const book = await LegacyBook.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    await book.removeStory(storyId);

    res.json({
      message: 'Story removed from legacy book successfully',
      book: book.toJSON()
    });
  } catch (error) {
    console.error('Remove story from book error:', error);
    res.status(500).json({ error: 'Failed to remove story from legacy book' });
  }
});

/**
 * @swagger
 * /api/legacy-books/{bookId}:
 *   delete:
 *     summary: Delete a legacy book
 *     tags: [Legacy Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Legacy book deleted successfully
 *       404:
 *         description: Legacy book not found
 */
// Delete legacy book
router.delete('/:bookId', authenticateToken, requireOwnershipOrStaff('bookId'), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { bookId } = req.params;

    const book = await LegacyBook.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Legacy book not found' });
    }

    await LegacyBook.findByIdAndDelete(bookId);

    res.json({
      message: 'Legacy book deleted successfully'
    });
  } catch (error) {
    console.error('Legacy book deletion error:', error);
    res.status(500).json({ error: 'Failed to delete legacy book' });
  }
});

export default router; 