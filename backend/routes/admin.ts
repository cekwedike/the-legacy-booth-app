import express from 'express';
import User from '../models/User';
import Story from '../models/Story';
import Message from '../models/Message';
import LegacyBook from '../models/LegacyBook';
import { authenticateToken, requireRole } from '../middleware/auth';
import { AuthenticatedRequest, AdminStats } from '../types';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
// Get admin dashboard stats
router.get('/dashboard', authenticateToken, requireRole(['admin', 'staff']), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const [
      totalUsers,
      totalStories,
      totalMessages,
      totalBooks,
      activeUsers
    ] = await Promise.all([
      User.countDocuments(),
      Story.countDocuments(),
      Message.countDocuments(),
      LegacyBook.countDocuments(),
      User.countDocuments({ isActive: true })
    ]);

    // Get recent activity
    const recentStories = await Story.find()
      .populate('resident', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentMessages = await Message.find()
      .populate('sender', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const stats: AdminStats = {
      totalUsers,
      totalStories,
      totalMessages,
      totalBooks,
      activeUsers,
      recentActivity: [
        ...recentStories.map(story => ({
          type: 'story' as const,
          action: 'created',
          timestamp: story.createdAt,
          userId: story.resident.toString()
        })),
        ...recentMessages.map(message => ({
          type: 'message' as const,
          action: 'created',
          timestamp: message.createdAt,
          userId: message.sender.toString()
        }))
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10)
    };

    res.json({
      stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
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
 *         description: Users retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
// Get all users (admin only)
router.get('/users', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;
    const filter: any = {};

    if (role) filter.role = role;
    if (status) filter.isActive = status === 'active';

    const skip = (Number(page) - 1) * Number(limit);
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users: users.map(user => user.toJSON()),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   put:
 *     summary: Update user (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               isActive:
 *                 type: boolean
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Insufficient permissions
 *       404:
 *         description: User not found
 */
// Update user (admin only)
router.put('/users/:userId', authenticateToken, requireRole(['admin']), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { userId } = req.params;
    const { isActive, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (role) user.role = role;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * @swagger
 * /api/admin/stories:
 *   get:
 *     summary: Get all stories (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
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
 *         description: Stories retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
// Get all stories (admin only)
router.get('/stories', authenticateToken, requireRole(['admin', 'staff']), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    
    const stories = await Story.find(filter)
      .populate('resident', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Story.countDocuments(filter);

    res.json({
      stories: stories.map(story => story.toJSON()),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Stories fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

/**
 * @swagger
 * /api/admin/messages:
 *   get:
 *     summary: Get all messages (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
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
 *       403:
 *         description: Insufficient permissions
 */
// Get all messages (admin only)
router.get('/messages', authenticateToken, requireRole(['admin', 'staff']), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const filter: any = {};

    if (status) filter.status = status;
    if (type) filter.type = type;

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
 * /api/admin/books:
 *   get:
 *     summary: Get all legacy books (admin only)
 *     tags: [Admin]
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
 *       403:
 *         description: Insufficient permissions
 */
// Get all legacy books (admin only)
router.get('/books', authenticateToken, requireRole(['admin', 'staff']), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter: any = {};

    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    
    const books = await LegacyBook.find(filter)
      .populate('resident', 'name email')
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

export default router; 