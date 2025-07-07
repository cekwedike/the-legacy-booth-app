const express = require('express');
const User = require('../models/User');
const Story = require('../models/Story');
const Message = require('../models/Message');
const LegacyBook = require('../models/LegacyBook');
const { authenticateToken, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get facility statistics
router.get('/stats', authenticateToken, requireRole(['staff', 'admin']), async (req, res) => {
  try {
    const totalResidents = await User.countDocuments({ role: 'resident', isActive: true });
    const totalStories = await Story.countDocuments();
    const totalMessages = await Message.countDocuments();
    const totalLegacyBooks = await LegacyBook.countDocuments();

    const recentStories = await Story.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('resident', 'name');

    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('sender', 'name');

    const storiesByCategory = await Story.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const messagesByType = await Message.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      stats: {
        totalResidents,
        totalStories,
        totalMessages,
        totalLegacyBooks
      },
      recentActivity: {
        stories: recentStories,
        messages: recentMessages
      },
      breakdowns: {
        storiesByCategory,
        messagesByType
      }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get all residents
router.get('/residents', authenticateToken, requireRole(['staff', 'admin']), async (req, res) => {
  try {
    const { isActive, limit = 50, page = 1 } = req.query;
    const filter = { role: 'resident' };

    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const residents = await User.find(filter)
      .select('-password')
      .sort({ name: 1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      residents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Residents fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch residents' });
  }
});

// Get resident details with their content
router.get('/residents/:residentId', authenticateToken, requireRole(['staff', 'admin']), async (req, res) => {
  try {
    const { residentId } = req.params;

    const resident = await User.findById(residentId).select('-password');
    if (!resident || resident.role !== 'resident') {
      return res.status(404).json({ error: 'Resident not found' });
    }

    const stories = await Story.find({ resident: residentId }).sort({ createdAt: -1 });
    const messages = await Message.find({ sender: residentId }).sort({ createdAt: -1 });
    const legacyBooks = await LegacyBook.find({ resident: residentId }).sort({ createdAt: -1 });

    res.json({
      resident,
      content: {
        stories,
        messages,
        legacyBooks
      }
    });
  } catch (error) {
    console.error('Resident details fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch resident details' });
  }
});

// Get all stories (staff view)
router.get('/stories', authenticateToken, requireRole(['staff', 'admin']), async (req, res) => {
  try {
    const { category, status, resident, limit = 20, page = 1 } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (resident) filter.resident = resident;

    const stories = await Story.find(filter)
      .populate('resident', 'name roomNumber')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Story.countDocuments(filter);

    res.json({
      stories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Stories fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// Get all messages (staff view)
router.get('/messages', authenticateToken, requireRole(['staff', 'admin']), async (req, res) => {
  try {
    const { type, status, sender, limit = 20, page = 1 } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (sender) filter.sender = sender;

    const messages = await Message.find(filter)
      .populate('sender', 'name roomNumber')
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

// Get all legacy books (staff view)
router.get('/legacy-books', authenticateToken, requireRole(['staff', 'admin']), async (req, res) => {
  try {
    const { status, resident, limit = 10, page = 1 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (resident) filter.resident = resident;

    const legacyBooks = await LegacyBook.find(filter)
      .populate('resident', 'name roomNumber')
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

// Export facility data
router.get('/export', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let data;
    switch (type) {
      case 'stories':
        data = await Story.find(filter).populate('resident', 'name roomNumber');
        break;
      case 'messages':
        data = await Message.find(filter).populate('sender', 'name roomNumber');
        break;
      case 'legacy-books':
        data = await LegacyBook.find(filter).populate('resident', 'name roomNumber');
        break;
      case 'residents':
        data = await User.find({ role: 'resident', ...filter }).select('-password');
        break;
      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }

    res.json({
      type,
      count: data.length,
      data,
      exportedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

module.exports = router; 