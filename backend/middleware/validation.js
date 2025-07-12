const { body, param, query, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  
  body('role')
    .isIn(['resident', 'staff', 'admin'])
    .withMessage('Role must be resident, staff, or admin'),
  
  body('roomNumber')
    .if(body('role').equals('resident'))
    .notEmpty()
    .withMessage('Room number is required for residents')
    .isLength({ min: 1, max: 10 })
    .withMessage('Room number must be between 1 and 10 characters'),
  
  body('dateOfBirth')
    .if(body('role').equals('resident'))
    .isISO8601()
    .withMessage('Date of birth must be a valid date')
    .custom((value) => {
      const age = Math.floor((new Date() - new Date(value)) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 18) {
        throw new Error('User must be at least 18 years old');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Story creation validation
const validateStoryCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('category')
    .isIn(['childhood', 'family', 'career', 'travel', 'hobbies', 'life-lessons', 'memories', 'other'])
    .withMessage('Invalid category'),
  
  handleValidationErrors
];

// Message creation validation
const validateMessageCreation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('type')
    .isIn(['birthday', 'anniversary', 'holiday', 'daily', 'encouragement', 'memory', 'other'])
    .withMessage('Invalid message type'),
  
  body('recipient.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Recipient name must be between 2 and 50 characters'),
  
  body('recipient.relationship')
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage('Relationship must be between 2 and 30 characters'),
  
  body('recipient.email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

// File upload validation
const validateFileUpload = [
  body('duration')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Duration must be a positive number'),
  
  handleValidationErrors
];

// Sanitize HTML content
const sanitizeHtml = (req, res, next) => {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitize(obj[key]);
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      });
    }
    return obj;
  };

  // Sanitize request body
  if (req.body) {
    sanitize(req.body);
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateStoryCreation,
  validateMessageCreation,
  validateId,
  validatePagination,
  validateFileUpload,
  sanitizeHtml,
  handleValidationErrors
}; 