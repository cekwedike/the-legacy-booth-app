const express = require('express');
const User = require('../models/User');
const Story = require('../models/Story');
const Message = require('../models/Message');
const LegacyBook = require('../models/LegacyBook');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

// Validation middleware
const validateUserAction = [
  body('role').optional().isIn(['user', 'admin', 'moderator']).withMessage('Invalid role'),
  body('status').optional().isIn(['active', 'suspended', 'pending']).withMessage('Invalid status')
];

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       403:
 *         description: Access denied
 */

// Get dashboard statistics
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get basic counts
    const totalUsers = await User.countDocuments();
    const totalStories = await Story.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalLegacyBooks = await LegacyBook.countDocuments();

    // Get active users (users who logged in within last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: sevenDaysAgo }
    });

    // Get user growth data (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const userGrowth = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      
      const usersOnDay = await User.countDocuments({
        createdAt: { $gte: startOfDay, $lt: endOfDay }
      });
      
      userGrowth.push({
        date: startOfDay.toISOString().split('T')[0],
        users: usersOnDay
      });
    }

    // Get content distribution
    const contentStats = [
      { category: 'Stories', count: totalStories, color: '#8b5cf6' },
      { category: 'Messages', count: totalMessages, color: '#f59e0b' },
      { category: 'Legacy Books', count: totalLegacyBooks, color: '#ef4444' }
    ];

    // Get recent activity
    const recentActivity = [];
    
    // Recent user registrations
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('name createdAt');
    
    recentUsers.forEach(user => {
      recentActivity.push({
        id: user._id,
        type: 'user',
        action: `New user registered: ${user.name}`,
        timestamp: user.createdAt,
        user: user.name
      });
    });

    // Recent stories
    const recentStories = await Story.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('user', 'name')
      .select('title createdAt user');
    
    recentStories.forEach(story => {
      recentActivity.push({
        id: story._id,
        type: 'story',
        action: `New story created: ${story.title}`,
        timestamp: story.createdAt,
        user: story.user?.name
      });
    });

    // Recent messages
    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('sender', 'name')
      .select('title createdAt sender');
    
    recentMessages.forEach(message => {
      recentActivity.push({
        id: message._id,
        type: 'message',
        action: `New message created: ${message.title}`,
        timestamp: message.createdAt,
        user: message.sender?.name
      });
    });

    // Sort by timestamp and take top 10
    recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    recentActivity.splice(10);

    // Mock system health data (in production, this would come from actual system monitoring)
    const systemHealth = {
      cpu: Math.floor(Math.random() * 30) + 10, // 10-40%
      memory: Math.floor(Math.random() * 40) + 20, // 20-60%
      storage: Math.floor(Math.random() * 50) + 30, // 30-80%
      uptime: Math.floor(Math.random() * 86400) + 86400 // 1-2 days in seconds
    };

    res.json({
      totalUsers,
      activeUsers,
      totalStories,
      totalMessages,
      totalLegacyBooks,
      systemHealth,
      recentActivity,
      userGrowth,
      contentStats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users for admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by status
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by role
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Access denied
 */

// Get all users
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, role } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;
    if (role) filter.role = role;

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password');

    // Get content counts for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const storiesCount = await Story.countDocuments({ user: user._id });
        const messagesCount = await Message.countDocuments({ sender: user._id });
        
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          storiesCount,
          messagesCount
        };
      })
    );

    const total = await User.countDocuments(filter);

    res.json({
      users: usersWithCounts,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + usersWithCounts.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * @swagger
 * /api/admin/users/{userId}/suspend:
 *   put:
 *     summary: Suspend a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User suspended successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */

// Suspend user
router.put('/users/:userId/suspend', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = 'suspended';
    await user.save();

    res.json({ 
      message: 'User suspended successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({ error: 'Failed to suspend user' });
  }
});

/**
 * @swagger
 * /api/admin/users/{userId}/activate:
 *   put:
 *     summary: Activate a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User activated successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */

// Activate user
router.put('/users/:userId/activate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = 'active';
    await user.save();

    res.json({ 
      message: 'User activated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).json({ error: 'Failed to activate user' });
  }
});

/**
 * @swagger
 * /api/admin/users/{userId}/delete:
 *   put:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */

// Delete user
router.put('/users/:userId/delete', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete user's content
    await Story.deleteMany({ user: user._id });
    await Message.deleteMany({ sender: user._id });
    await LegacyBook.deleteMany({ author: user._id });

    // Delete user
    await User.findByIdAndDelete(user._id);

    res.json({ message: 'User and all associated content deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

/**
 * @swagger
 * /api/admin/users/{userId}/role:
 *   put:
 *     summary: Update user role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin, moderator]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */

// Update user role
router.put('/users/:userId/role', authenticateToken, requireAdmin, validateUserAction, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { role } = req.body;
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({ 
      message: 'User role updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

/**
 * @swagger
 * /api/admin/content/stories:
 *   get:
 *     summary: Get all stories for moderation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of stories
 *       403:
 *         description: Access denied
 */

// Get all stories for moderation
router.get('/content/stories', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;

    const stories = await Story.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Story.countDocuments(filter);

    res.json({
      stories,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / parseInt(limit)),
        hasNext: skip + stories.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

/**
 * @swagger
 * /api/admin/content/messages:
 *   get:
 *     summary: Get all messages for moderation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of messages
 *       403:
 *         description: Access denied
 */

// Get all messages for moderation
router.get('/content/messages', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;

    const messages = await Message.find(filter)
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

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
 * /api/admin/system/health:
 *   get:
 *     summary: Get system health information
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System health data
 *       403:
 *         description: Access denied
 */

// Get system health
router.get('/system/health', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Mock system health data (in production, this would come from actual system monitoring)
    const systemHealth = {
      cpu: Math.floor(Math.random() * 30) + 10,
      memory: Math.floor(Math.random() * 40) + 20,
      storage: Math.floor(Math.random() * 50) + 30,
      uptime: Math.floor(Math.random() * 86400) + 86400,
      responseTime: Math.floor(Math.random() * 100) + 50,
      activeConnections: Math.floor(Math.random() * 100) + 10,
      databaseConnections: Math.floor(Math.random() * 20) + 5
    };

    res.json({ systemHealth });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({ error: 'Failed to fetch system health' });
  }
});

/**
 * @swagger
 * /api/admin/analytics/overview:
 *   get:
 *     summary: Get analytics overview
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics overview
 *       403:
 *         description: Access denied
 */

// Get analytics overview
router.get('/analytics/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // User growth
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: lastMonth } });
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: lastWeek } });

    // Content growth
    const totalStories = await Story.countDocuments();
    const newStoriesThisMonth = await Story.countDocuments({ createdAt: { $gte: lastMonth } });
    const newStoriesThisWeek = await Story.countDocuments({ createdAt: { $gte: lastWeek } });

    const totalMessages = await Message.countDocuments();
    const newMessagesThisMonth = await Message.countDocuments({ createdAt: { $gte: lastMonth } });
    const newMessagesThisWeek = await Message.countDocuments({ createdAt: { $gte: lastWeek } });

    // Activity metrics
    const activeUsersThisWeek = await User.countDocuments({
      lastLogin: { $gte: lastWeek }
    });

    res.json({
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        newThisWeek: newUsersThisWeek,
        activeThisWeek: activeUsersThisWeek
      },
      content: {
        stories: {
          total: totalStories,
          newThisMonth: newStoriesThisMonth,
          newThisWeek: newStoriesThisWeek
        },
        messages: {
          total: totalMessages,
          newThisMonth: newMessagesThisMonth,
          newThisWeek: newMessagesThisWeek
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router; 