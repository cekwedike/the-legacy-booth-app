const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Validate JWT secret is configured
const validateJWTSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  if (process.env.JWT_SECRET === 'your-secret-key' || process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
    throw new Error('JWT_SECRET must be changed from default value');
  }
};

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    // Validate JWT secret on first use
    validateJWTSecret();
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.message.includes('JWT_SECRET')) {
      console.error('JWT configuration error:', error.message);
      return res.status(500).json({ error: 'Server configuration error' });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Check if user is accessing their own data or is staff/admin
const requireOwnershipOrStaff = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const isOwner = req.user._id.toString() === resourceUserId.toString();
    const isStaff = ['staff', 'admin'].includes(req.user.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

// Generate JWT token
const generateToken = (userId) => {
  try {
    validateJWTSecret();
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  } catch (error) {
    console.error('Token generation error:', error.message);
    throw new Error('Unable to generate authentication token');
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnershipOrStaff,
  generateToken
}; 