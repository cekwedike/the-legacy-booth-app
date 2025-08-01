import express from 'express';
import User from '../models/User';
import { authenticateToken, generateToken, requireRole } from '../middleware/auth';
import { AuthenticatedRequest, RegisterRequest, LoginRequest } from '../types';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [resident, family, caregiver, staff, admin]
 *               roomNumber:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               emergencyContact:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists or missing required fields
 *       500:
 *         description: Registration failed
 */
// Register new user (public)
router.post('/register', async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password, role, roomNumber, dateOfBirth, emergencyContact }: RegisterRequest = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Validate required fields based on role
    if (role === 'resident') {
      if (!roomNumber || !dateOfBirth) {
        return res.status(400).json({ error: 'Room number and date of birth required for residents' });
      }
    }

    const user = new User({
      name,
      email,
      password,
      role,
      roomNumber,
      dateOfBirth,
      emergencyContact
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Login failed
 */
// Login user (public)
router.post('/login', async (req: express.Request, res: express.Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
// Get user profile (protected)
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const user = await User.findById(req.user!._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               preferences:
 *                 type: object
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Update failed
 */
// Update user profile (protected)
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { name, preferences } = req.body;
    const user = await User.findById(req.user!._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Invalid current password
 *       500:
 *         description: Password change failed
 */
// Change password (protected)
router.post('/change-password', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user!._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by user role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by user status
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       403:
 *         description: Insufficient permissions
 */
// Get all users (admin only)
router.get('/users', authenticateToken, requireRole(['admin', 'staff']), async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { role, status } = req.query;
    const filter: any = {};

    if (role) filter.role = role;
    if (status) filter.isActive = status === 'active';

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.json({
      users: users.map(user => user.toJSON())
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

/**
 * @swagger
 * /api/auth/users/{userId}:
 *   put:
 *     summary: Update user (admin only)
 *     tags: [Auth]
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

export default router; 